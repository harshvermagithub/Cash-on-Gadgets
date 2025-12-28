
'use server';

import { db } from '@/lib/store';

export async function fetchBrands() {
    return db.getBrands();
}

export async function fetchModels(brandId: string) {
    return db.getModels(brandId);
}

export async function fetchVariants(modelId: string) {
    return db.getVariants(modelId);
}
