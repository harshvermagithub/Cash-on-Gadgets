
'use server';

import { db } from '@/lib/store';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginExecutive(phone: string, password?: string) {
    const riders = db.getRiders();
    const executive = riders.find(r => r.phone === phone);

    if (!executive) {
        return { success: false, error: 'Phone number not found. Access denied.' };
    }

    // Check if onboarding is needed
    if (!executive.password) {
        return { success: true, needsOnboarding: true, id: executive.id };
    }

    // If already onboarded, verify password
    if (!password) {
        return { success: false, error: 'Password required' };
    }

    if (executive.password !== password) {
        return { success: false, error: 'Invalid password' };
    }

    // Set session
    const cookieStore = await cookies();
    cookieStore.set('executive_id', executive.id, { httpOnly: true, path: '/' });

    redirect('/pickup/dashboard');
}

export async function onboardExecutive(id: string, password: string) {
    const riders = db.getRiders();
    const executive = riders.find(r => r.id === id);

    if (!executive) return { success: false, error: 'Executive not found' };

    db.updateRiderPassword(id, password);

    const cookieStore = await cookies();
    cookieStore.set('executive_id', executive.id, { httpOnly: true, path: '/' });

    redirect('/pickup/dashboard');
}

export async function logoutExecutive() {
    const cookieStore = await cookies();
    cookieStore.delete('executive_id');
    redirect('/pickup');
}

export async function getExecutiveSession() {
    const cookieStore = await cookies();
    const executiveId = cookieStore.get('executive_id')?.value;
    if (!executiveId) return null;

    const riders = db.getRiders();
    return riders.find(r => r.id === executiveId) || null;
}

export async function getExecutiveOrders() {
    const executive = await getExecutiveSession();
    if (!executive) return [];

    const allOrders = db.getAllOrders();
    // Filter orders assigned to this executive
    return allOrders.filter(o => o.riderId === executive.id);
}

export async function updateOrderStatus(orderId: string, status: string) {
    const executive = await getExecutiveSession();
    if (!executive) throw new Error('Unauthorized');

    db.updateOrderStatus(orderId, status);
    revalidatePath('/pickup/dashboard');
    return { success: true };
}
