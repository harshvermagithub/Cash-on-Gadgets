
'use server';

import { db } from '@/lib/store';
import { login } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export async function signup(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || !name) {
        return { error: 'Please fill all fields' };
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
        return { error: 'Email already registered' };
    }

    // A real UUID would be better but simple random string works for mock
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    db.addUser({ id, email, passwordHash, name });

    await login({ id, email, name });
    redirect('/');
}

export async function signin(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please fill all fields' };
    }

    const user = db.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return { error: 'Invalid email or password' };
    }

    await login({ id: user.id, email: user.email, name: user.name });
    redirect('/');
}

export async function createOrderAction(device: string, variant: string, price: number) {
    // This action will be called from client side
}
