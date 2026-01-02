
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

// Map of Brand ID (or Name) to Logo URL
const BRAND_LOGOS: Record<string, string> = {
    'apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'xiaomi': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    'samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    'vivo': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg',
    'oneplus': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OnePlus_logo.svg',
    'oppo': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
    'realme': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg',
    'motorola': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Motorola_logo.svg',
    'lenovo': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg',
    'nokia': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Nokia_logoblue.svg',
    'honor': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Honor_Logo.svg',
    'google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'poco': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg',
    'infinix': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Infinix_Mobility_logo.svg',
    'tecno': 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Tecno_Mobile_logo.svg',
    'iqoo': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/IQOO_logo.svg',
    'nothing': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Nothing_Technology_logo.svg',
    'sony': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg',
    'lg': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg',
    'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'nintendo': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg',
};

export async function GET() {
    try {
        let log = '';

        // 1. Fix Brands
        const brands = await db.getBrands();
        for (const brand of brands) {
            const key = brand.name.toLowerCase();
            if (BRAND_LOGOS[key]) {
                await db.updateBrand(brand.id, brand.name, BRAND_LOGOS[key]);
                log += `Updated Logo: ${brand.name}\n`;
            }
        }

        // 2. Fix Models (Set Placeholder Images)
        const models = await db.getModels();
        for (const model of models) {
            // Check if image is broken (local path) or empty
            if (!model.img || model.img.startsWith('/images/')) {
                const encodedName = encodeURIComponent(model.name);
                // Using a clean placeholder service
                const placeholderUrl = `https://placehold.co/300x400/png?text=${encodedName}`;

                // Using updateModel (requires brandId, usually we don't change brandId, but the store method needs it)
                // We need to pass the existing brandId.
                await db.updateModel(model.id, model.brandId, model.name, placeholderUrl);
                log += `Updated Image: ${model.name}\n`;
            }
        }

        return NextResponse.json({ success: true, log });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
