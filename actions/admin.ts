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

export async function addBrand(name: string, logo: string, category?: string, priority: number = 100) {
    await requireAdmin();
    const id = name.toLowerCase().replace(/\s+/g, '-');

    // Check if brand exists to append category instead of fail/duplicate
    const existing = await db.getBrand(id);

    if (existing) {
        if (category) {
            await db.addCategoryToBrand(id, category);
        }
        // Update details (last write wins for name/logo/priority)
        await db.updateBrand(id, name, logo, priority);
    } else {
        await db.addBrand({
            id,
            name,
            logo,
            categories: category ? [category] : []
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    }

    revalidatePath(`/admin/category/${category}`);
    revalidatePath('/sell');
    return { success: true, id };
}

export async function deleteBrand(id: string, category?: string) {
    await requireAdmin();

    if (category) {
        // Check if brand actually has this category
        const brand = await db.getBrand(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b = brand as any;

        if (b && b.categories && b.categories.includes(category)) {
            await db.removeCategoryFromBrand(id, category);
        } else if (b && (!b.categories || b.categories.length === 0)) {
            // It's an orphan/untagged brand appearing via fallback (e.g. smartphone)
            // User likely wants to delete this garbage entry entirely.
            // Attempt full delete (will fail if constraints exist, but for 'as' it should work)
            await db.deleteBrand(id);
        }
    } else {
        await db.deleteBrand(id);
    }

    if (category) revalidatePath(`/admin/category/${category}`);
    revalidatePath('/sell');
    revalidatePath('/admin/brands'); // General refresh
    return { success: true };
}

export async function updateBrand(id: string, name: string, logo: string, priority?: number) {
    await requireAdmin();
    await db.updateBrand(id, name, logo, priority);
    revalidatePath('/admin/brands');
    revalidatePath('/sell');
    return { success: true };
}

// --- Models ---

export async function getModels(brandId?: string) {
    return await db.getModels(brandId);
}

export async function addModel(brandId: string, name: string, img: string, category: string = 'smartphone', priority: number = 100) {
    await requireAdmin();
    await db.addModel({
        id: randomUUID(),
        brandId,
        name,
        img,
        category,
        priority
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    revalidatePath('/admin/models');
    return { success: true };
}

export async function updateModel(id: string, brandId: string, name: string, img: string, category: string = 'smartphone', priority: number = 100) {
    await requireAdmin();
    await db.updateModel(id, brandId, name, img, category, priority);
    revalidatePath('/admin/models');
    return { success: true };
}

export async function reorderModels(items: { id: string, priority: number }[]) {
    await requireAdmin();
    // Use transaction to ensure consistency if possible, or just Promise.all
    // Prisma transaction is preferred for bulk updates, but simple loops work for small batches.
    // For SQLite/Postgres with Prisma:
    await db.updateModelPriorities(items);
    revalidatePath('/admin/models');
    revalidatePath('/sell'); // Ensure frontend updates immediately
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

// --- Evaluation Rules ---

export async function getEvaluationRules(category: string) {
    return await db.getEvaluationRules(category);
}

export async function upsertEvaluationRule(data: { category: string, questionKey: string, answerKey: string, label: string, deductionAmount: number, deductionPercent: number }) {
    await requireAdmin();
    await db.upsertEvaluationRule(data);
    revalidatePath(`/admin/category/${data.category}`);
    revalidatePath('/sell');
    return { success: true };
}
