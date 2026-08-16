import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getCanonicalModelKey } from '@/lib/catalog2026';

// Apple iPhone Data
const IPHONE_DATA = [
    { name: 'iPhone X', variants: [{ name: '64GB', price: 9280 }, { name: '256GB', price: 9770 }] },
    { name: 'iPhone XR', variants: [{ name: '64GB', price: 9460 }, { name: '128GB', price: 9700 }, { name: '256GB', price: 9950 }] },
    { name: 'iPhone XS', variants: [{ name: '64GB', price: 10200 }, { name: '256GB', price: 11250 }, { name: '512GB', price: 11580 }] },
    { name: 'iPhone XS Max', variants: [{ name: '64GB', price: 11760 }, { name: '256GB', price: 12040 }, { name: '512GB', price: 12440 }] },
    { name: 'iPhone 11', variants: [{ name: '64GB', price: 13390 }, { name: '128GB', price: 13910 }, { name: '256GB', price: 14450 }] },
    { name: 'iPhone 11 Pro', variants: [{ name: '64GB', price: 16230 }, { name: '256GB', price: 16950 }, { name: '512GB', price: 17440 }] },
    { name: 'iPhone 11 Pro Max', variants: [{ name: '64GB', price: 17050 }, { name: '256GB', price: 19040 }, { name: '512GB', price: 19520 }] },
    { name: 'iPhone SE 2020', variants: [{ name: '64GB', price: 7420 }, { name: '128GB', price: 7710 }, { name: '256GB', price: 7910 }] },
    { name: 'iPhone 12', variants: [{ name: '64GB', price: 16210 }, { name: '128GB', price: 17610 }, { name: '256GB', price: 18070 }] },
    { name: 'iPhone 12 Mini', variants: [{ name: '64GB', price: 14090 }, { name: '128GB', price: 14770 }, { name: '256GB', price: 15020 }] },
    { name: 'iPhone 12 Pro', variants: [{ name: '128GB', price: 23350 }, { name: '256GB', price: 23840 }, { name: '512GB', price: 24320 }] },
    { name: 'iPhone 12 Pro Max', variants: [{ name: '128GB', price: 24820 }, { name: '256GB', price: 26760 }, { name: '512GB', price: 27170 }] },
    { name: 'iPhone 13', variants: [{ name: '128GB', price: 29960 }, { name: '256GB', price: 30860 }, { name: '512GB', price: 31680 }] },
    { name: 'iPhone 13 Mini', variants: [{ name: '128GB', price: 25440 }, { name: '256GB', price: 26880 }, { name: '512GB', price: 27260 }] },
    { name: 'iPhone 13 Pro', variants: [{ name: '128GB', price: 42830 }, { name: '256GB', price: 43510 }, { name: '512GB', price: 44000 }, { name: '1TB', price: 44880 }] },
    { name: 'iPhone 13 Pro Max', variants: [{ name: '128GB', price: 44790 }, { name: '256GB', price: 45960 }, { name: '512GB', price: 48270 }, { name: '1TB', price: 49000 }] },
    { name: 'iPhone 14', variants: [{ name: '128GB', price: 34330 }, { name: '256GB', price: 35000 }, { name: '512GB', price: 36480 }] },
    { name: 'iPhone 14 Pro', variants: [{ name: '128GB', price: 53070 }, { name: '256GB', price: 55970 }, { name: '512GB', price: 57230 }, { name: '1TB', price: 57910 }] },
    { name: 'iPhone 14 Pro Max', variants: [{ name: '128GB', price: 57040 }, { name: '256GB', price: 60630 }, { name: '512GB', price: 61600 }, { name: '1TB', price: 62370 }] },
    { name: 'iPhone 14 Plus', variants: [{ name: '128GB', price: 36990 }, { name: '256GB', price: 37470 }, { name: '512GB', price: 38590 }] },
    { name: 'iPhone 15', variants: [{ name: '128GB', price: 38040 }, { name: '256GB', price: 42700 }, { name: '512GB', price: 44590 }] },
    { name: 'iPhone 15 Pro', variants: [{ name: '128GB', price: 62400 }, { name: '256GB', price: 65520 }, { name: '512GB', price: 66110 }, { name: '1TB', price: 66790 }] },
    { name: 'iPhone 15 Pro Max', variants: [{ name: '256GB', price: 74980 }, { name: '512GB', price: 76440 }, { name: '1TB', price: 77030 }] },
    { name: 'iPhone 15 Plus', variants: [{ name: '128GB', price: 44410 }, { name: '256GB', price: 46660 }, { name: '512GB', price: 47330 }] },
    { name: 'iPhone 16', variants: [{ name: '128GB', price: 47430 }, { name: '256GB', price: 49200 }, { name: '512GB', price: 50290 }] },
    { name: 'iPhone 16 Plus', variants: [{ name: '128GB', price: 49780 }, { name: '256GB', price: 51250 }, { name: '512GB', price: 53460 }] },
    { name: 'iPhone 16 Pro', variants: [{ name: '128GB', price: 70000 }, { name: '256GB', price: 72600 }, { name: '512GB', price: 74100 }, { name: '1TB', price: 75400 }] },
    { name: 'iPhone 16 Pro Max', variants: [{ name: '256GB', price: 87100 }, { name: '512GB', price: 89700 }, { name: '1TB', price: 91000 }] },
    { name: 'iPhone 16e', variants: [{ name: '128GB', price: 36000 }, { name: '256GB', price: 38500 }, { name: '512GB', price: 43000 }] },
    { name: 'iPhone 17', variants: [{ name: '256GB', price: 58500 }, { name: '512GB', price: 67000 }] },
    { name: 'iPhone 17 Pro', variants: [{ name: '256GB', price: 89000 }, { name: '512GB', price: 93000 }, { name: '1TB', price: 105000 }] },
    { name: 'iPhone Air', variants: [{ name: '256GB', price: 77000 }, { name: '512GB', price: 86500 }, { name: '1TB', price: 95500 }] },
    { name: 'iPhone 17 Pro Max', variants: [{ name: '256GB', price: 98000 }, { name: '512GB', price: 106000 }, { name: '1TB', price: 114000 }, { name: '2TB', price: 125000 }] },
];

// 2026 Newly Launched Models for Samsung, Redmi, Realme, POCO, Vivo
const NEW_2026_MODELS = [
    // Samsung (9 models)
    { brandId: 'samsung', name: "Galaxy S26 Ultra 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_S25_Ultra.png', variants: [{ name: "12GB + 256GB", price: 78540 }, { name: "16GB + 512GB", price: 82500 }] },
    { brandId: 'samsung', name: "Galaxy S26+ 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_S25_Plus.png', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "12GB + 512GB", price: 59000 }] },
    { brandId: 'samsung', name: "Galaxy S26 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_S25.png', variants: [{ name: "12GB + 128GB", price: 44880 }, { name: "12GB + 256GB", price: 47000 }] },
    { brandId: 'samsung', name: "Galaxy Z Fold 8 Ultra", priority: 10, logo: '/models/samsung/Samsung_Galaxy_Z_Fold_7.png', variants: [{ name: "16GB + 512GB", price: 100980 }, { name: "16GB + 1TB", price: 108000 }] },
    { brandId: 'samsung', name: "Galaxy Z Fold 8", priority: 10, logo: '/models/samsung/Samsung_Galaxy_Z_Fold_6.png', variants: [{ name: "12GB + 256GB", price: 89760 }, { name: "12GB + 512GB", price: 94000 }] },
    { brandId: 'samsung', name: "Galaxy Z Flip 8", priority: 10, logo: '/models/samsung/Samsung_Galaxy_Z_Flip_7.png', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "12GB + 512GB", price: 59000 }] },
    { brandId: 'samsung', name: "Galaxy F70 Pro 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_F56_5G.png', variants: [{ name: "8GB + 128GB", price: 14025 }, { name: "8GB + 256GB", price: 15500 }] },
    { brandId: 'samsung', name: "Galaxy M47 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_M56_5G.png', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'samsung', name: "Galaxy A86 5G", priority: 10, logo: '/models/samsung/Samsung_Galaxy_A56_5G.png', variants: [{ name: "8GB + 128GB", price: 22440 }, { name: "8GB + 256GB", price: 24000 }] },

    // Redmi (8 models)
    { brandId: 'xiaomi', name: "Redmi Turbo 5", priority: 10, logo: '/models/xiaomi/Xiaomi_15.png', variants: [{ name: "8GB + 256GB", price: 23562 }, { name: "12GB + 256GB", price: 25000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 Pro+ 5G", priority: 10, logo: '/models/xiaomi/Redmi_Note_15_Pro_Plus_5G.png', variants: [{ name: "8GB + 256GB", price: 22440 }, { name: "12GB + 512GB", price: 24000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 Pro 5G", priority: 10, logo: '/models/xiaomi/Redmi_Note_15_Pro_5G.png', variants: [{ name: "8GB + 128GB", price: 19635 }, { name: "8GB + 256GB", price: 21000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 5G", priority: 10, logo: '/models/xiaomi/Redmi_Note_15_5G.png', variants: [{ name: "6GB + 128GB", price: 15147 }, { name: "8GB + 256GB", price: 16500 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 SE 5G", priority: 10, logo: '/models/xiaomi/Redmi_Note_14_SE_5G.png', variants: [{ name: "6GB + 128GB", price: 14586 }, { name: "8GB + 128GB", price: 15500 }] },
    { brandId: 'xiaomi', name: "Redmi Note 17 5G", priority: 10, logo: '/models/xiaomi/Redmi_Note_14_5G.png', variants: [{ name: "8GB + 128GB", price: 17391 }, { name: "8GB + 256GB", price: 18500 }] },
    { brandId: 'xiaomi', name: "Redmi 15C 5G", priority: 10, logo: '/models/xiaomi/Redmi_15C_5G.png', variants: [{ name: "6GB + 128GB", price: 10378 }, { name: "8GB + 128GB", price: 11000 }] },
    { brandId: 'xiaomi', name: "Redmi 15A 5G", priority: 10, logo: '/models/xiaomi/Redmi_15_5G.png', variants: [{ name: "4GB + 128GB", price: 8592 }, { name: "6GB + 128GB", price: 9200 }] },

    // Realme (9 models)
    { brandId: 'realme', name: "Realme GT6 Pro 5G", priority: 10, logo: '/models/realme/Realme_GT_7_Pro_5G.png', variants: [{ name: "12GB + 256GB", price: 33660 }, { name: "16GB + 512GB", price: 36000 }] },
    { brandId: 'realme', name: "Realme GT6 5G", priority: 10, logo: '/models/realme/Realme_GT_6.png', variants: [{ name: "8GB + 256GB", price: 23001 }, { name: "12GB + 256GB", price: 25000 }] },
    { brandId: 'realme', name: "Realme GT Neo 8 5G", priority: 10, logo: '/models/realme/REALME_GT_NEO_3_150W.png', variants: [{ name: "8GB + 256GB", price: 20196 }, { name: "12GB + 256GB", price: 21500 }] },
    { brandId: 'realme', name: "Realme 14 Pro+ 5G", priority: 10, logo: '/models/realme/Realme_14_Pro_Plus_5G.png', variants: [{ name: "8GB + 256GB", price: 18513 }, { name: "12GB + 256GB", price: 19500 }] },
    { brandId: 'realme', name: "Realme 14 Pro 5G", priority: 10, logo: '/models/realme/Realme_14_Pro_5G.png', variants: [{ name: "8GB + 128GB", price: 15708 }, { name: "8GB + 256GB", price: 16800 }] },
    { brandId: 'realme', name: "Realme 14 5G", priority: 10, logo: '/models/realme/Realme_14X_5G.png', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'realme', name: "Realme Narzo 80 Pro", priority: 10, logo: '/models/realme/Realme_Narzo_80_Pro_5G.png', variants: [{ name: "8GB + 128GB", price: 12903 }, { name: "8GB + 256GB", price: 14000 }] },
    { brandId: 'realme', name: "Realme Narzo 80x 5G", priority: 10, logo: '/models/realme/Realme_Narzo_80X_5G.png', variants: [{ name: "6GB + 128GB", price: 8976 }, { name: "8GB + 128GB", price: 9500 }] },
    { brandId: 'realme', name: "Realme C75 5G", priority: 10, logo: '/models/realme/Realme_C75_5G.png', variants: [{ name: "4GB + 128GB", price: 7293 }, { name: "6GB + 128GB", price: 7900 }] },

    // POCO (10 models)
    { brandId: 'poco', name: "POCO F8 Pro 5G", priority: 10, logo: '/models/poco/Poco_F7.png', variants: [{ name: "12GB + 256GB", price: 25245 }, { name: "16GB + 512GB", price: 27500 }] },
    { brandId: 'poco', name: "POCO F8 5G", priority: 10, logo: '/models/poco/Poco_F6_5G.png', variants: [{ name: "8GB + 256GB", price: 19635 }, { name: "12GB + 256GB", price: 21000 }] },
    { brandId: 'poco', name: "POCO F8 GT 5G", priority: 10, logo: '/models/poco/POCO_F3_GT.png', variants: [{ name: "8GB + 256GB", price: 22440 }, { name: "12GB + 256GB", price: 24000 }] },
    { brandId: 'poco', name: "POCO X8 Pro 5G", priority: 10, logo: '/models/poco/Poco_X7_Pro_5G.png', variants: [{ name: "8GB + 256GB", price: 16269 }, { name: "12GB + 256GB", price: 17500 }] },
    { brandId: 'poco', name: "POCO X8 5G", priority: 10, logo: '/models/poco/Poco_X7_5G.png', variants: [{ name: "8GB + 128GB", price: 12342 }, { name: "8GB + 256GB", price: 13500 }] },
    { brandId: 'poco', name: "POCO X8 Neo 5G", priority: 10, logo: '/models/poco/Poco_X6_Neo.png', variants: [{ name: "6GB + 128GB", price: 10098 }, { name: "8GB + 256GB", price: 11000 }] },
    { brandId: 'poco', name: "POCO M8 Pro 5G", priority: 10, logo: '/models/poco/Poco_M7_Pro_5G.png', variants: [{ name: "6GB + 128GB", price: 8415 }, { name: "8GB + 128GB", price: 9000 }] },
    { brandId: 'poco', name: "POCO M8 5G", priority: 10, logo: '/models/poco/Poco_M8_5G.png', variants: [{ name: "4GB + 128GB", price: 6732 }, { name: "6GB + 128GB", price: 7200 }] },
    { brandId: 'poco', name: "POCO C8 5G", priority: 10, logo: '/models/poco/Poco_C75_5G.png', variants: [{ name: "4GB + 128GB", price: 5610 }, { name: "6GB + 128GB", price: 6000 }] },
    { brandId: 'poco', name: "POCO C8 Plus", priority: 10, logo: '/models/poco/POCO_C85.png', variants: [{ name: "4GB + 64GB", price: 5049 }, { name: "4GB + 128GB", price: 5500 }] },

    // Vivo (20 models)
    { brandId: 'vivo', name: "Vivo X300 Ultra", priority: 10, logo: '/models/vivo/Vivo_X300_Pro.png', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "16GB + 512GB", price: 60000 }] },
    { brandId: 'vivo', name: "Vivo X300 Pro 5G", priority: 10, logo: '/models/vivo/Vivo_X300_Pro.png', variants: [{ name: "12GB + 256GB", price: 44880 }, { name: "12GB + 512GB", price: 48000 }] },
    { brandId: 'vivo', name: "Vivo X300 5G", priority: 10, logo: '/models/vivo/Vivo_X300.png', variants: [{ name: "8GB + 256GB", price: 36465 }, { name: "12GB + 256GB", price: 39000 }] },
    { brandId: 'vivo', name: "Vivo X300 FE 5G", priority: 10, logo: '/models/vivo/Vivo_X200_FE.png', variants: [{ name: "8GB + 256GB", price: 28050 }, { name: "12GB + 256GB", price: 30000 }] },
    { brandId: 'vivo', name: "Vivo X200T", priority: 10, logo: '/models/vivo/Vivo_X200T.png', variants: [{ name: "8GB + 128GB", price: 25245 }, { name: "8GB + 256GB", price: 27000 }] },
    { brandId: 'vivo', name: "Vivo X200 Pro", priority: 10, logo: '/models/vivo/Vivo_X200_Pro_5G.png', variants: [{ name: "12GB + 256GB", price: 39270 }, { name: "12GB + 512GB", price: 42000 }] },
    { brandId: 'vivo', name: "Vivo V70 5G", priority: 10, logo: '/models/vivo/Vivo_V60_5G.png', variants: [{ name: "8GB + 128GB", price: 21879 }, { name: "8GB + 256GB", price: 23500 }] },
    { brandId: 'vivo', name: "Vivo V70 Elite", priority: 10, logo: '/models/vivo/Vivo_V60_5G.png', variants: [{ name: "8GB + 128GB", price: 19635 }, { name: "8GB + 256GB", price: 21000 }] },
    { brandId: 'vivo', name: "Vivo V70 FE", priority: 10, logo: '/models/vivo/Vivo_V50_5G.png', variants: [{ name: "8GB + 128GB", price: 16830 }, { name: "8GB + 256GB", price: 18000 }] },
    { brandId: 'vivo', name: "Vivo V60 5G", priority: 10, logo: '/models/vivo/Vivo_V60_5G.png', variants: [{ name: "8GB + 128GB", price: 17952 }, { name: "8GB + 256GB", price: 19000 }] },
    { brandId: 'vivo', name: "Vivo V60e 5G", priority: 10, logo: '/models/vivo/Vivo_V60e.png', variants: [{ name: "8GB + 128GB", price: 14586 }, { name: "8GB + 256GB", price: 15500 }] },
    { brandId: 'vivo', name: "Vivo T5 Pro", priority: 10, logo: '/models/vivo/Vivo_T4_Pro_5G.png', variants: [{ name: "8GB + 128GB", price: 14025 }, { name: "8GB + 256GB", price: 15000 }] },
    { brandId: 'vivo', name: "Vivo T5x 5G", priority: 10, logo: '/models/vivo/Vivo_T4x_5G.png', variants: [{ name: "6GB + 128GB", price: 9537 }, { name: "8GB + 128GB", price: 10000 }] },
    { brandId: 'vivo', name: "Vivo T5 Lite 5G", priority: 10, logo: '/models/vivo/Vivo_T4_Lite_5G.png', variants: [{ name: "4GB + 128GB", price: 7854 }, { name: "6GB + 128GB", price: 8500 }] },
    { brandId: 'vivo', name: "Vivo T4 5G / Ultra", priority: 10, logo: '/models/vivo/Vivo_T4_Ultra.png', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'vivo', name: "Vivo S2 5G", priority: 10, logo: '/models/vivo/Vivo_S1_Pro.png', variants: [{ name: "8GB + 256GB", price: 18513 }, { name: "12GB + 256GB", price: 19800 }] },
    { brandId: 'vivo', name: "Vivo S50 / Mini", priority: 10, logo: '/models/vivo/Vivo_S1.png', variants: [{ name: "8GB + 128GB", price: 15708 }, { name: "8GB + 256GB", price: 16800 }] },
    { brandId: 'vivo', name: "Vivo Y600 Pro", priority: 10, logo: '/models/vivo/Vivo_Y400_Pro_5G.png', variants: [{ name: "8GB + 128GB", price: 12342 }, { name: "8GB + 256GB", price: 13500 }] },
    { brandId: 'vivo', name: "Vivo Y500 Pro", priority: 10, logo: '/models/vivo/Vivo_Y400_5G.png', variants: [{ name: "6GB + 128GB", price: 10098 }, { name: "8GB + 128GB", price: 11000 }] },
    { brandId: 'vivo', name: "Vivo Y500 5G", priority: 10, logo: '/models/vivo/Vivo_Y300_5G.png', variants: [{ name: "6GB + 128GB", price: 8415 }, { name: "8GB + 128GB", price: 9000 }] }
];

export async function GET(req: Request) {
    try {
        // Protect this heavy route from unauthorized calls
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');
        if (key !== process.env.INTERNAL_API_KEY && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let log = '';
        const apple = await prisma.brand.findUnique({ where: { id: 'apple' } });
        if (!apple) {
            log += 'Error: Apple brand missing. Cannot sync.\n';
            return NextResponse.json({ error: 'Apple brand missing', log });
        }

        log += `--- Starting iPhone Price Sync ---\n`;

        for (const item of IPHONE_DATA) {
            // 1. Find or Create Model
            let model = await prisma.model.findFirst({
                where: {
                    brandId: 'apple',
                    name: { equals: item.name, mode: 'insensitive' }
                }
            });

            if (!model) {
                log += `Creating Model: ${item.name}\n`;
                model = await prisma.model.create({
                    data: {
                        id: randomUUID(),
                        brandId: 'apple',
                        name: item.name,
                        category: 'smartphone',
                        img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
                        priority: 100
                    }
                });
            }

            // 2. Find or Create Variants
            for (const v of item.variants) {
                const vName = v.name.toUpperCase();
                let variant = await prisma.variant.findFirst({
                    where: {
                        modelId: model.id,
                        name: { equals: vName, mode: 'insensitive' }
                    }
                });

                if (variant) {
                    if (variant.basePrice !== v.price) {
                        await prisma.variant.update({
                            where: { id: variant.id },
                            data: { basePrice: v.price }
                        });
                        log += `Updated ${item.name} ${vName} price: ${variant.basePrice} -> ${v.price}\n`;
                    }
                } else {
                    await prisma.variant.create({
                        data: {
                            id: randomUUID(),
                            modelId: model.id,
                            name: vName,
                            basePrice: v.price
                        }
                    });
                    log += `Created ${item.name} ${vName} at ${v.price}\n`;
                }
            }
        }

        log += `\n--- Starting 2026 Newly Launched Models Sync ---\n`;

        for (const item of NEW_2026_MODELS) {
            // Check if brand exists in DB, if not create it
            let brand = await prisma.brand.findUnique({ where: { id: item.brandId } });
            if (!brand) {
                log += `Creating Brand: ${item.brandId}\n`;
                brand = await prisma.brand.create({
                    data: {
                        id: item.brandId,
                        name: item.brandId.charAt(0).toUpperCase() + item.brandId.slice(1),
                        logo: item.logo,
                        categories: ['smartphone'],
                        priority: 100
                    }
                });
            }

            // 1. Find existing model by exact name or matching canonical key
            const targetCanonicalKey = getCanonicalModelKey(item.name);
            const allBrandModels = await prisma.model.findMany({ where: { brandId: item.brandId } });
            let model = allBrandModels.find(m => getCanonicalModelKey(m.name) === targetCanonicalKey) || null;

            if (!model) {
                log += `Creating Model: ${item.name} (Priority: ${item.priority})\n`;
                model = await prisma.model.create({
                    data: {
                        id: randomUUID(),
                        brandId: item.brandId,
                        name: item.name,
                        category: 'smartphone',
                        img: item.logo,
                        priority: item.priority
                    }
                });
            } else {
                // Update model name, image, and priority to canonical 2026 definition
                await prisma.model.update({
                    where: { id: model.id },
                    data: {
                        name: item.name,
                        img: item.logo,
                        priority: item.priority
                    }
                });
                log += `Updated canonical model definition for ${item.name}\n`;
            }

            // 2. Find or Create Variants
            for (const v of item.variants) {
                const vName = v.name;
                let variant = await prisma.variant.findFirst({
                    where: {
                        modelId: model.id,
                        name: { equals: vName, mode: 'insensitive' }
                    }
                });

                if (variant) {
                    if (variant.basePrice !== v.price) {
                        await prisma.variant.update({
                            where: { id: variant.id },
                            data: { basePrice: v.price }
                        });
                        log += `Updated ${item.name} ${vName} price: ${variant.basePrice} -> ${v.price}\n`;
                    }
                } else {
                    await prisma.variant.create({
                        data: {
                            id: randomUUID(),
                            modelId: model.id,
                            name: vName,
                            basePrice: v.price
                        }
                    });
                    log += `Created ${item.name} ${vName} at ${v.price}\n`;
                }
            }
        }

        // 3. Database-wide Deduplication Cleanup
        log += `\n--- Cleaning Up Duplicate Models in Database ---\n`;
        const allDbModels = await prisma.model.findMany();
        const modelsByBrandAndKey = new Map<string, typeof allDbModels>();

        for (const m of allDbModels) {
            const compositeKey = `${m.brandId}:${getCanonicalModelKey(m.name)}`;
            if (!modelsByBrandAndKey.has(compositeKey)) {
                modelsByBrandAndKey.set(compositeKey, []);
            }
            modelsByBrandAndKey.get(compositeKey)!.push(m);
        }

        for (const [key, duplicateList] of modelsByBrandAndKey.entries()) {
            if (duplicateList.length > 1) {
                duplicateList.sort((a, b) => {
                    const pDiff = (a.priority ?? 100) - (b.priority ?? 100);
                    if (pDiff !== 0) return pDiff;
                    if (a.name.toLowerCase().includes('5g') && !b.name.toLowerCase().includes('5g')) return -1;
                    if (!a.name.toLowerCase().includes('5g') && b.name.toLowerCase().includes('5g')) return 1;
                    return 0;
                });

                const primary = duplicateList[0];
                const duplicatesToDelete = duplicateList.slice(1);

                for (const dup of duplicatesToDelete) {
                    log += `Deleting duplicate model: "${dup.name}" (ID: ${dup.id}) in favor of primary: "${primary.name}"\n`;
                    await prisma.variant.deleteMany({ where: { modelId: dup.id } }).catch(() => {});
                    await prisma.model.delete({ where: { id: dup.id } }).catch(() => {});
                }
            }
        }

        log += `--- Sync Complete ---\n`;
        revalidatePath('/');
        revalidatePath('/sell');

        return NextResponse.json({ success: true, log });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
