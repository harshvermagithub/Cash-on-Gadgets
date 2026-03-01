
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

    await db.addUser({ id, email, phone, passwordHash, name, role: 'USER' });

    await login({ id, email, name, role: 'USER' });
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

    console.log('DEBUG SIGNIN USER:', user);
    await login({ id: user.id, email: user.email, name: user.name, role: user.role });
    redirect('/');
}

export async function createOrderAction(_device: string, _variant: string, _price: number) {
    // This action will be called from client side
}

import { supabase } from '@/lib/supabase';

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
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
        });

        if (error) {
            console.error(`[SUPABASE OTP] Gateway Error: ${error.message}`);
            return { error: `Email failed to send: ${error.message}` };
        }

        console.log(`[SUPABASE OTP] OTP successfully sent to ${email}`);
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

    const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
    });

    if (error) {
        return { error: `Invalid OTP: ${error.message}` };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.updateUserPassword(email, passwordHash);
    await db.clearResetToken(email);

    return { success: 'Password reset successfully! You can now login.' };
}
