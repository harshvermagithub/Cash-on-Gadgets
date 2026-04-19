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
                    // Fetch more emails (last 100 or so)
                    const limit = 100;
                    const seq = mailbox.exists > limit ? `${mailbox.exists - (limit - 1)}:*` : '1:*';
                    
                    for await (let msg of client.fetch(seq, { source: true, uid: true })) {
                        if (msg.source) {
                            const parsed = await simpleParser(msg.source);
                            const fromEmail = (parsed.from as any)?.value?.[0]?.address || (parsed.from as any)?.text || '';
                            const toEmail = (parsed.to as any)?.value?.[0]?.address || (parsed.to as any)?.text || acc.email;
                            const messageId = msg.uid.toString() + '-' + acc.email; // Local unique ID

                            // Upsert into DB to avoid duplicates
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
                                update: {} // Don't update once received
                            });
                        }
                    }
                }
            } finally {
                lock.release();
            }
            await client.logout();
        } catch (e) {
            console.error(`IMAP sync failed for ${acc.email}: ${e}`);
        }
    }
}

export async function fetchRoleBasedEmails(selectedAccount?: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error('Unauthorized');

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedCities: true }
    });
    if (!currentUser) throw new Error('User not found');

    const role = currentUser.role;

    // Trigger background sync (non-blocking if possible, but for consistency we do it here)
    if (role === 'SUPER_ADMIN') {
        try {
            await syncImapEmails(selectedAccount);
        } catch (e) {
            console.error("Auto-sync failed", e);
        }
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

    if (role === 'SUPER_ADMIN') {
        return allEmails;
    }

    const allUsers = await prisma.user.findMany({ select: { email: true, role: true }});
    
    if (role === 'ADMIN') {
        const superAdmins = allUsers.filter(u => u.role === 'SUPER_ADMIN').map(u => u.email);
        return allEmails.filter(e => {
             const fromSuper = superAdmins.some(sa => e.fromEmail.includes(sa));
             const toSuper = superAdmins.some(sa => e.toEmail.includes(sa));
             return !(fromSuper && toSuper);
        });
    }

    return allEmails.filter(e => e.fromEmail.includes(currentUser.email) || e.toEmail.includes(currentUser.email));
}

export async function fetchEmailById(id: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error('Unauthorized');

    return await prisma.emailMessage.findUnique({
        where: { id }
    });
}
