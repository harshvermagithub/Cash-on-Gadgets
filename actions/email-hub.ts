'use server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

/**
 * Syncs IMAP emails to the database for all or a specific account
 */
export async function syncImapEmails(targetAccount?: string) {
    const accounts = await prisma.emailAccount.findMany({
        where: targetAccount ? { email: targetAccount } : {}
    });

    const results = [];

    for (const acc of accounts) {
        try {
            const client = new ImapFlow({
                host: '82.208.22.226',
                port: 143,
                secure: false,
                auth: { user: acc.email, pass: acc.password },
                tls: { rejectUnauthorized: false },
                logger: false
            });
            await client.connect();
            let lock = await client.getMailboxLock('INBOX');
            try {
                const mailbox = client.mailbox as any;
                if (mailbox && mailbox.exists > 0) {
                    const limit = 50; 
                    const seq = mailbox.exists > limit ? `${mailbox.exists - (limit - 1)}:*` : '1:*';
                    
                    for await (let msg of client.fetch(seq, { source: true, uid: true })) {
                        if (msg.source) {
                            const parsed = await simpleParser(msg.source);
                            const fromEmail = (parsed.from as any)?.value?.[0]?.address || (parsed.from as any)?.text || '';
                            const toEmail = (parsed.to as any)?.value?.[0]?.address || (parsed.to as any)?.text || acc.email;
                            const messageId = msg.uid.toString() + '-' + acc.email;

                            await prisma.emailMessage.upsert({
                                where: { messageId },
                                create: {
                                    messageId,
                                    from: fromEmail,
                                    to: toEmail,
                                    subject: parsed.subject || 'No Subject',
                                    bodyText: parsed.text || '',
                                    bodyHtml: typeof parsed.html === 'string' ? parsed.html : undefined,
                                    bodySnippet: (parsed.text || '').substring(0, 150),
                                    receivedAt: parsed.date || new Date(),
                                    isOutbound: false,
                                    status: 'received'
                                },
                                update: {}
                            });
                        }
                    }
                }
                results.push({ email: acc.email, status: 'success' });
            } finally {
                lock.release();
            }
            await client.logout();
        } catch (e: any) {
            console.error(`IMAP sync failed for ${acc.email}: ${e}`);
            results.push({ email: acc.email, status: 'failed', error: e.message });
        }
    }
    return results;
}

export async function fetchRoleBasedEmails(selectedAccount?: string, skipSync: boolean = false) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: 'Unauthorized', emails: [] };

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        });
        if (!currentUser) return { error: 'User not found in database', emails: [] };

        const role = currentUser.role;

        // Trigger sync only if requested
        if (role === 'SUPER_ADMIN' && !skipSync) {
            await syncImapEmails(selectedAccount);
        }

        // Fetch from database
        let whereClause: any = {};
        if (selectedAccount) {
            whereClause = {
                OR: [
                    { from: selectedAccount },
                    { to: selectedAccount }
                ]
            };
        }

        const messages = await prisma.emailMessage.findMany({
            where: whereClause,
            orderBy: { receivedAt: 'desc' },
            take: 300 
        });

        const totalInDb = await prisma.emailMessage.count();
        const totalAccounts = await prisma.emailAccount.count();

        const allEmails = messages.map(msg => ({
            id: msg.id,
            subject: msg.subject || 'No Subject',
            fromEmail: msg.from,
            toEmail: msg.to,
            date: msg.receivedAt,
            text: msg.bodyText || '',
            snippet: msg.bodySnippet || '',
            isOutbound: msg.isOutbound,
            bodyHtml: msg.bodyHtml
        }));

        let filtered = allEmails;

        // Elevated Roles Logic:
        // SUPER_ADMIN, ADMIN, ZONAL_HEAD should see broader emails.
        if (role === 'ADMIN' || role === 'ZONAL_HEAD') {
            const allUsers = await prisma.user.findMany({ select: { email: true, role: true }});
            const superAdmins = allUsers.filter(u => u.role === 'SUPER_ADMIN').map(u => u.email);
            
            filtered = allEmails.filter(e => {
                // Allow if it involves the current user specifically
                if (e.fromEmail.includes(currentUser.email) || e.toEmail.includes(currentUser.email)) return true;
                
                // Exclude if it's exclusively between super admins
                const fromSuper = superAdmins.some(sa => e.fromEmail.includes(sa));
                const toSuper = superAdmins.some(sa => e.toEmail.includes(sa));
                if (fromSuper && toSuper) return false;

                // For Zonal Head/Admin, allow seeing emails with system accounts (e.g. fonzkart.in)
                if (e.fromEmail.includes('@fonzkart.in') || e.toEmail.includes('@fonzkart.in')) return true;

                return false;
            });
        } else if (role !== 'SUPER_ADMIN') {
            // Normal users only see their own
            filtered = allEmails.filter(e => e.fromEmail.includes(currentUser.email) || e.toEmail.includes(currentUser.email));
        }

        return { 
            emails: filtered, 
            totalInDb, 
            totalAccounts,
            userRole: role,
            userEmail: currentUser.email 
        };
    } catch (e: any) {
        return { error: e.message, emails: [], totalInDb: 0 };
    }
}

export async function fetchEmailById(id: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error('Unauthorized');

    return await prisma.emailMessage.findUnique({
        where: { id }
    });
}
