
'use server';

import { db } from '@/lib/store';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function placeOrder(
    device: string,
    variant: string,
    price: number,
    address: string,
    location: { lat: number; lng: number } | null,
    answers: any
) {
    const session = await getSession();
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    const order = {
        id: crypto.randomUUID(),
        userId: session.user.id,
        device: `${device} (${variant})`,
        price,
        date: new Date().toISOString(),
        status: 'Pending Pickup',
        address,
        location,
        answers
    };

    db.addOrder(order);
    return { success: true };
}

export async function getUserOrders() {
    const session = await getSession();
    if (!session || !session.user) return [];

    return db.getOrders(session.user.id);
}
