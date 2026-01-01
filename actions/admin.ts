'use server';

import { db } from '@/lib/store';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// Auth check helper
async function requireAdmin() {
    const session = await getSession();
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }
    // In a real app, check specifically for admin role or email
    // if (session.user.email !== 'admin@fonzkart.com') throw new Error('Forbidden');
}

// --- Brands ---

export async function getBrands() {
    return await db.getBrands();
}

export async function addBrand(name: string, logo: string) {
    await requireAdmin();
    await db.addBrand({
        id: name.toLowerCase().replace(/\s+/g, '-'), // Generate ID from name
        name,
        logo
    });
    revalidatePath('/admin/brands');
    revalidatePath('/sell'); // Update the main sell page too
    return { success: true };
}

export async function deleteBrand(id: string) {
    await requireAdmin();
    await db.deleteBrand(id);
    revalidatePath('/admin/brands');
    revalidatePath('/sell');
    return { success: true };
}

export async function updateBrand(id: string, name: string, logo: string) {
    await requireAdmin();
    await db.updateBrand(id, name, logo);
    revalidatePath('/admin/brands');
    revalidatePath('/sell');
    return { success: true };
}

// --- Models ---

export async function getModels(brandId?: string) {
    return await db.getModels(brandId);
}

export async function addModel(brandId: string, name: string, img: string) {
    await requireAdmin();
    await db.addModel({
        id: randomUUID(),
        brandId,
        name,
        img
    });
    revalidatePath('/admin/models');
    return { success: true };
}

export async function updateModel(id: string, brandId: string, name: string, img: string) {
    await requireAdmin();
    await db.updateModel(id, brandId, name, img);
    revalidatePath('/admin/models');
    return { success: true };
}

export async function deleteModel(id: string) {
    await requireAdmin();
    await db.deleteModel(id);
    revalidatePath('/admin/models');
    return { success: true };
}

// --- Variants ---

export async function getVariants(modelId?: string) {
    return await db.getVariants(modelId);
}

export async function addVariant(modelId: string, name: string, basePrice: number) {
    await requireAdmin();
    await db.addVariant({
        id: randomUUID(),
        modelId,
        name,
        basePrice
    });
    revalidatePath('/admin/variants');
    return { success: true };
}

export async function updateVariant(id: string, modelId: string, name: string, basePrice: number) {
    await requireAdmin();
    await db.updateVariant(id, modelId, name, basePrice);
    revalidatePath('/admin/variants');
    return { success: true };
}

export async function deleteVariant(id: string) {
    await requireAdmin();
    await db.deleteVariant(id);
    revalidatePath('/admin/variants');
    return { success: true };
}

// --- Riders ---

export async function addRider(name: string, phone: string) {
    await requireAdmin();
    await db.addRider({
        id: randomUUID(),
        name,
        phone,
        status: 'available',
        password: null
    });
    revalidatePath('/admin/riders');
    return { success: true };
}

export async function deleteRider(id: string) {
    await requireAdmin();
    await db.deleteRider(id);
    revalidatePath('/admin/riders');
    return { success: true };
}

// --- Orders ---

export async function assignRider(orderId: string, riderId: string) {
    await requireAdmin();
    const success = await db.updateOrderRider(orderId, riderId);
    if (!success) throw new Error('Order not found');

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    return { success: true };
}
