import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

// Only instantiate if the env is available or return null/error if missing for safety
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function getEmails() {
    return await prisma.emailMessage.findMany({
        orderBy: {
            receivedAt: 'desc'
        }
    });
}

export async function sendEmail(prevState: any, formData: FormData) {
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const bodyText = formData.get('bodyText') as string;

    // We send via a verified domain alias e.g. support@fonzkart.in
    const from = 'Fonzkart Support <support@fonzkart.in>';

    if (!to || !subject || !bodyText) {
        return { error: 'Please fill all fields.' };
    }

    if (!resend) {
        return { error: 'Resend API Key is missing. Please configure RESEND_API_KEY.' };
    }

    try {
        const data = await resend.emails.send({
            from,
            to,
            subject,
            text: bodyText,
        });

        if (data.error) {
            return { error: `Email failed to send: ${data.error.message}` };
        }

        // Save to DB
        await prisma.emailMessage.create({
            data: {
                from,
                to,
                subject,
                bodyText,
                isOutbound: true,
                status: 'sent',
            }
        });

        revalidatePath('/admin/inbox');
        return { success: 'Email sent successfully!' };
    } catch (e: any) {
        return { error: e.message || 'Failed to send email.' };
    }
}
