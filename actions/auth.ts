
'use server';

import { db } from '@/lib/store';
import { login } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
// import { v4 as uuidv4 } from 'uuid';

export async function signup(prevState: { error?: string } | null, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    let phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    if (!email || !password || !name || !phone) {
        return { error: 'Please fill all fields' };
    }

    if (phone && !phone.startsWith('+91')) {
        phone = `+91${phone}`;
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
        return { error: 'Email already registered' };
    }

    // A real UUID would be better but simple random string works for mock
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    await db.addUser({ id, email, phone, passwordHash, name, role: 'UNVERIFIED' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    await db.setResetToken(email, otp, expiry);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || '82.208.22.226',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: { rejectUnauthorized: false }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@fonzkart.in',
            to: email,
            subject: 'Verify your Fonzkart Account',
            html: `
              <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to Fonzkart!</h2>
                <p>Please use the following 6-digit OTP to verify your email address and finish signing up:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #888; font-size: 12px;">This code will expire in 15 minutes.</p>
              </div>
            `,
        });
    } catch (e: unknown) {
        console.error("Signup Email Verify Failed", e);
    }

    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function verifyEmailSignup(prevState: { error?: string, success?: string } | null, formData: FormData) {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;

    if (!email || !otp) {
        return { error: 'Missing information.' };
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
        return { error: 'User not found.' };
    }

    if (user.resetToken !== otp) {
        return { error: 'Invalid OTP provided.' };
    }
    
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return { error: 'Your OTP has expired. Please sign up again or request a new one.' };
    }

    // Verify user
    await db.updateUserRole(email, 'USER');
    await db.clearResetToken(email);

    // Auto login
    await login({ id: user.id, email: user.email, name: user.name, role: 'USER' });
    redirect('/');
}

export async function signin(prevState: { error?: string } | null, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please fill all fields' };
    }

    const user = await db.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return { error: 'Invalid email or password' };
    }

    if (user.role === 'UNVERIFIED') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        await db.setResetToken(email, otp, expiry);

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || '82.208.22.226',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
                tls: { rejectUnauthorized: false }
            });
            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@fonzkart.in',
                to: email,
                subject: 'Verify your Fonzkart Account',
                html: `<p>Your new verification OTP is: <b>${otp}</b></p>`
            });
        } catch(e) {}

        redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    }

    console.log('DEBUG SIGNIN USER:', user);
    await login({ id: user.id, email: user.email, name: user.name, role: user.role });
    redirect('/');
}

export async function createOrderAction(_device: string, _variant: string, _price: number) {
    // This action will be called from client side
}

import nodemailer from 'nodemailer';

export async function requestPasswordReset(prevState: { error?: string, success?: string, email?: string, step?: string } | null, formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Please enter your registered email address.' };
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
        return { error: 'Invalid email. We could not verify ownership.' };
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
        
        await db.setResetToken(email, otp, expiry);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || '82.208.22.226',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@fonzkart.in',
            to: email,
            subject: 'Your Password Reset OTP - Fonzkart',
            html: `
              <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Password Reset Verification</h2>
                <p>You requested to reset your password on Fonzkart. Please use the following 6-digit OTP to verify your identity:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #888; font-size: 12px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
              </div>
            `,
        });

        console.log(`[MAIL SERVER] OTP successfully sent to ${email}`);
    } catch (e: unknown) {
        console.error("Email Sending Failed", e instanceof Error ? e.message : e);
        return { error: 'Failed to connect to the email gateway. Please try again later.' };
    }

    return { success: 'OTP successfully sent to your registered email address.', email, step: 'verify' };
}

export async function verifyAndResetPassword(prevState: { error?: string, success?: string } | null, formData: FormData) {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;
    const password = formData.get('password') as string;

    if (!email || !otp || !password) {
        return { error: 'Please fill all fields.' };
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
        return { error: 'Invalid user.' };
    }

    if (user.resetToken !== otp) {
        return { error: 'Invalid OTP provided.' };
    }
    
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return { error: 'Your OTP has expired. Please request a new one.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.updateUserPassword(email, passwordHash);
    await db.clearResetToken(email);

    return { success: 'Password reset successfully! You can now login.' };
}
