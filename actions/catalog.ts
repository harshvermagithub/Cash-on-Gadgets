'use server';

import { brands, models, variantSets } from '@/lib/data';
import { Brand, Model } from '@/lib/store';

export async function fetchBrands(category?: string) {
    const targetCategory = category || 'smartphone';

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter brands that include the category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return brands.filter((brand: any) => brand.categories && brand.categories.includes(targetCategory));
}

export async function fetchModels(brandId: string, category?: string) {
    const allModels = models[brandId as keyof typeof models] || [];
    if (category) {
        return allModels.filter((m: any) => m.category === category);
    }
    return allModels;
}

// In a real app, this would fetch from DB based on model ID
// For now, we mock based on the category of the model (which we can infer or pass)
export async function fetchVariants(modelId: string, category: string = 'smartphone'): Promise<any[]> { // Using any[] for simplicity, assuming Variant type is defined elsewhere
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get variants for the category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sets = variantSets; // Directly use imported variantSets
    const categoryVariants = sets[category as keyof typeof sets] || sets['smartphone'];

    return categoryVariants.map((v: any) => ({
        id: v.id,
        modelId,
        name: v.name,
        basePrice: v.basePrice
    }));
}
