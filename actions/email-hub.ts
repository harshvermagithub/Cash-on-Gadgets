'use server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export async function fetchRoleBasedEmails() {
    const session = await getSession();
    if (!session || !session.user) throw new Error('Unauthorized');

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedCities: true } // If zonal head
    });
    if (!currentUser) throw new Error('User not found');

    const role = currentUser.role;

    // 1. Fetch Sent Emails directly from Database
    let dbSentEmails = await prisma.emailMessage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch Received Emails from IMAP (from all connected Email Accounts)
    const accounts = await prisma.emailAccount.findMany();
    let imapReceived: any[] = [];
    
    // Process IMAP in parallel or sequentially. We will do sequentially to avoid spamming the host
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
                    const seq = mailbox.exists > 50 ? `${mailbox.exists - 49}:*` : '1:*';
                    for await (let msg of client.fetch(seq, { source: true, envelope: true })) {
                        if (msg.source) {
                            const parsed = await simpleParser(msg.source);
                            const fromEmail = parsed.from?.value?.[0]?.address || parsed.from?.text || '';
                            const toEmail = parsed.to?.value?.[0]?.address || parsed.to?.text || acc.email;
                            imapReceived.push({
                                id: msg.uid.toString(),
                                subject: parsed.subject || 'No Subject',
                                fromEmail,
                                toEmail,
                                date: parsed.date || new Date(),
                                text: parsed.text || (typeof parsed.html === 'string' ? parsed.html.replace(/<[^>]+>/g, '') : ''),
                                isOutbound: false
                            });
                        }
                    }
                }
            } finally {
                lock.release();
            }
            await client.logout();
        } catch (e) {
            console.error(`IMAP sync failed for ${acc.email}`);
        }
    }

    // Unify all emails
    const unifiedSent = dbSentEmails.map(msg => ({
        id: msg.id,
        subject: msg.subject || 'No Subject',
        fromEmail: msg.from,
        toEmail: msg.to,
        date: msg.createdAt,
        text: msg.bodyText || '',
        isOutbound: true
    }));

    let allEmails = [...unifiedSent, ...imapReceived];
    allEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter Logic based on Role
    // Super Admin: sees all
    // Admin: sees emails involving Partners, Zonal Heads, Delivery Executives, Users
        // Actually, who else is there? Mostly everyone except Super Admin. 
        // We will just let Admin see everything except emails exclusively between Super Admins.
    // Zonal Head: sees emails of themselves, their partners, their delivery execs, users in their zone
    // Partner: sees emails of themselves and their delivery execs

    if (role === 'SUPER_ADMIN') {
        return allEmails;
    }

    // We need to fetch users to get their emails and roles to filter properly
    const allUsers = await prisma.user.findMany({
        include: { riders: true, city: true }
    });
    const riders = await prisma.rider.findMany({ include: { partner: true }});

    if (role === 'ADMIN') {
        const superAdmins = allUsers.filter(u => u.role === 'SUPER_ADMIN').map(u => u.email);
        return allEmails.filter(e => {
             // Exclude emails where BOTH from and to are super admins
             const fromSuper = superAdmins.some(sa => e.fromEmail.includes(sa));
             const toSuper = superAdmins.some(sa => e.toEmail.includes(sa));
             if (fromSuper && toSuper) return false;
             return true;
        });
    }

    if (role === 'ZONAL_HEAD') {
        // Collect emails of their users
        const myCities = currentUser.managedCities.map(c => c.id);
        const myPartners = allUsers.filter(u => u.role === 'PARTNER' && u.cityId && myCities.includes(u.cityId));
        const myRiders = riders.filter(r => r.partner && myPartners.find(p => p.id === r.partner?.id));
        const myUsers = allUsers.filter(u => u.role === 'USER' && u.cityId && myCities.includes(u.cityId));

        const allowedEmails = [
            currentUser.email,
            ...myPartners.map(p => p.email),
            ...myUsers.map(u => u.email)
        ];

        return allEmails.filter(e => {
            return allowedEmails.some(a => e.fromEmail.includes(a) || e.toEmail.includes(a));
        });
    }

    if (role === 'PARTNER') {
        // Partner sees themselves + their assigned riders (but riders don't have emails, they have phone numbers. Wait, do riders have emails?)
        // Riders only have 'phone' in DB! So partners basically just see their own emails.
        return allEmails.filter(e => e.fromEmail.includes(currentUser.email) || e.toEmail.includes(currentUser.email));
    }

    // Fallback normal users
    return allEmails.filter(e => e.fromEmail.includes(currentUser.email) || e.toEmail.includes(currentUser.email));
}
