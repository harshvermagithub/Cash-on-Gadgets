import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        const from = payload.from || 'Unknown';
        const to = payload.to || 'Unknown';
        const subject = payload.subject || 'No Subject';
        const bodyText = payload.text || '';
        const bodyHtml = payload.html || '';

        // Avoid self-loops if somehow the outbound email is caught here
        if (from.includes('@fonzkart.in') && to.includes('@fonzkart.in')) {
            console.log('Detected internal loop, ignoring webhook for', subject);
            return NextResponse.json({ status: 'ignored' });
        }

        await prisma.emailMessage.create({
            data: {
                from,
                to,
                subject,
                bodyText,
                bodyHtml,
                isOutbound: false,
                status: 'delivered',
            }
        });

        console.log(`[RESEND INBOUND] Received email from ${from} to ${to}: ${subject}`);
        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error handling resend webhook', error);
        return NextResponse.json({ error: 'Failed to handle webhook' }, { status: 500 });
    }
}
