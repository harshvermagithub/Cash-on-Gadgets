'use server';

import { db } from '@/lib/store';

export async function fetchBrands(category?: string) {
    return await db.getBrands(category);
}

export async function fetchModels(brandId: string, category?: string) {
    return await db.getModels(brandId, category);
}

export async function searchGlobalModels(query: string) {
    if (!query || query.length < 2) return [];
    return await db.searchModels(query);
}

export async function fetchVariants(modelId: string, category: string = 'smartphone') {
    // Fetch variants from DB
    return await db.getVariants(modelId);
}
