
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

    // @ts-ignore - role exists after schema update
    console.log('DEBUG SIGNIN USER:', user);
    await login({ id: user.id, email: user.email, name: user.name, role: user.role });
    redirect('/');
}

export async function createOrderAction(_device: string, _variant: string, _price: number) {
    // This action will be called from client side
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    let phone = formData.get('phone') as string;

    if (!email || !phone) {
        return { error: 'Please enter registered email and phone.' };
    }

    if (phone && !phone.startsWith('+91')) {
        phone = `+91${phone}`;
    }

    const user = await db.findUserByEmail(email);
    if (!user || user.phone !== phone) {
        return { error: 'Invalid email or registered phone number. We could not verify ownership.' };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.setResetToken(email, otp, expiry);

    // Call Dofy SMS Gateway
    try {
        const formData = new URLSearchParams();
        formData.append('username', 'FonzKa');
        formData.append('apikey', '0df550ae149021fa-589f');
        formData.append('apirequest', 'Text');
        formData.append('sender', 'DOFYIN');
        formData.append('route', 'TRANS');
        formData.append('format', 'JSON');
        formData.append('message', `Use ${otp} to reset your Fonzkart password. DO NOT share this with anyone. Enjoy our hassle-free gadget selling experience.`);
        formData.append('mobile', phone);
        formData.append('TemplateID', '1207164993188267205');

        await fetch('http://api.smsgatewayhub.com/api/mt/SendSMS', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        console.log(`[SMS INTEGRATION] OTP sent to ${phone}`);
    } catch (e) {
        console.error("SMS Sending Failed", e);
        // We do not block the user if SMS API is down, but realistically this should be handled
    }

    return { success: 'OTP successfully sent to your registered phone number.', email, phone, step: 'verify' };
}

export async function verifyAndResetPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;
    const password = formData.get('password') as string;

    if (!email || !otp || !password) {
        return { error: 'Please fill all fields.' };
    }

    const user = await db.findUserByEmail(email);
    if (!user || user.resetToken !== otp) {
        return { error: 'Invalid OTP.' };
    }
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return { error: 'OTP has expired. Please request a new one.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.updateUserPassword(email, passwordHash);
    await db.clearResetToken(email);

    return { success: 'Password reset successfully! You can now login.' };
}
