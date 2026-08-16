const { PrismaClient } = require('@prisma/client');
const { crypto, randomUUID } = require('crypto');

const prisma = new PrismaClient();

const NEW_2026_MODELS = [
    // Samsung (9 models)
    { brandId: 'samsung', name: "Galaxy S26 Ultra 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "12GB + 256GB", price: 78540 }, { name: "16GB + 512GB", price: 82500 }] },
    { brandId: 'samsung', name: "Galaxy S26+ 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "12GB + 512GB", price: 59000 }] },
    { brandId: 'samsung', name: "Galaxy S26 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "12GB + 128GB", price: 44880 }, { name: "12GB + 256GB", price: 47000 }] },
    { brandId: 'samsung', name: "Galaxy Z Fold 8 Ultra", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "16GB + 512GB", price: 100980 }, { name: "16GB + 1TB", price: 108000 }] },
    { brandId: 'samsung', name: "Galaxy Z Fold 8", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "12GB + 256GB", price: 89760 }, { name: "12GB + 512GB", price: 94000 }] },
    { brandId: 'samsung', name: "Galaxy Z Flip 8", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "12GB + 512GB", price: 59000 }] },
    { brandId: 'samsung', name: "Galaxy F70 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "8GB + 128GB", price: 14025 }, { name: "8GB + 256GB", price: 15500 }] },
    { brandId: 'samsung', name: "Galaxy M47 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'samsung', name: "Galaxy A86 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', variants: [{ name: "8GB + 128GB", price: 22440 }, { name: "8GB + 256GB", price: 24000 }] },

    // Redmi (8 models)
    { brandId: 'xiaomi', name: "Redmi Turbo 5", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "8GB + 256GB", price: 23562 }, { name: "12GB + 256GB", price: 25000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 Pro+ 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "8GB + 256GB", price: 22440 }, { name: "12GB + 512GB", price: 24000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "8GB + 128GB", price: 19635 }, { name: "8GB + 256GB", price: 21000 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "6GB + 128GB", price: 15147 }, { name: "8GB + 256GB", price: 16500 }] },
    { brandId: 'xiaomi', name: "Redmi Note 15 SE 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "6GB + 128GB", price: 14586 }, { name: "8GB + 128GB", price: 15500 }] },
    { brandId: 'xiaomi', name: "Redmi Note 17 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "8GB + 128GB", price: 17391 }, { name: "8GB + 256GB", price: 18500 }] },
    { brandId: 'xiaomi', name: "Redmi 15C 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "6GB + 128GB", price: 10378 }, { name: "8GB + 128GB", price: 11000 }] },
    { brandId: 'xiaomi', name: "Redmi 15A 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', variants: [{ name: "4GB + 128GB", price: 8592 }, { name: "6GB + 128GB", price: 9200 }] },

    // Realme (9 models)
    { brandId: 'realme', name: "Realme GT6 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "12GB + 256GB", price: 33660 }, { name: "16GB + 512GB", price: 36000 }] },
    { brandId: 'realme', name: "Realme GT6 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "8GB + 256GB", price: 23001 }, { name: "12GB + 256GB", price: 25000 }] },
    { brandId: 'realme', name: "Realme GT Neo 8 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "8GB + 256GB", price: 20196 }, { name: "12GB + 256GB", price: 21500 }] },
    { brandId: 'realme', name: "Realme 14 Pro+ 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "8GB + 256GB", price: 18513 }, { name: "12GB + 256GB", price: 19500 }] },
    { brandId: 'realme', name: "Realme 14 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "8GB + 128GB", price: 15708 }, { name: "8GB + 256GB", price: 16800 }] },
    { brandId: 'realme', name: "Realme 14 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'realme', name: "Realme Narzo 80 Pro", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "8GB + 128GB", price: 12903 }, { name: "8GB + 256GB", price: 14000 }] },
    { brandId: 'realme', name: "Realme Narzo 80x 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "6GB + 128GB", price: 8976 }, { name: "8GB + 128GB", price: 9500 }] },
    { brandId: 'realme', name: "Realme C75 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', variants: [{ name: "4GB + 128GB", price: 7293 }, { name: "6GB + 128GB", price: 7900 }] },

    // POCO (10 models)
    { brandId: 'poco', name: "POCO F8 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "12GB + 256GB", price: 25245 }, { name: "16GB + 512GB", price: 27500 }] },
    { brandId: 'poco', name: "POCO F8 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "8GB + 256GB", price: 19635 }, { name: "12GB + 256GB", price: 21000 }] },
    { brandId: 'poco', name: "POCO F8 GT 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "8GB + 256GB", price: 22440 }, { name: "12GB + 256GB", price: 24000 }] },
    { brandId: 'poco', name: "POCO X8 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "8GB + 256GB", price: 16269 }, { name: "12GB + 256GB", price: 17500 }] },
    { brandId: 'poco', name: "POCO X8 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "8GB + 128GB", price: 12342 }, { name: "8GB + 256GB", price: 13500 }] },
    { brandId: 'poco', name: "POCO X8 Neo 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "6GB + 128GB", price: 10098 }, { name: "8GB + 256GB", price: 11000 }] },
    { brandId: 'poco', name: "POCO M8 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "6GB + 128GB", price: 8415 }, { name: "8GB + 128GB", price: 9000 }] },
    { brandId: 'poco', name: "POCO M8 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "4GB + 128GB", price: 6732 }, { name: "6GB + 128GB", price: 7200 }] },
    { brandId: 'poco', name: "POCO C8 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "4GB + 128GB", price: 5610 }, { name: "6GB + 128GB", price: 6000 }] },
    { brandId: 'poco', name: "POCO C8 Plus", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', variants: [{ name: "4GB + 64GB", price: 5049 }, { name: "4GB + 128GB", price: 5500 }] },

    // Vivo (20 models)
    { brandId: 'vivo', name: "Vivo X300 Ultra", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "12GB + 256GB", price: 56100 }, { name: "16GB + 512GB", price: 60000 }] },
    { brandId: 'vivo', name: "Vivo X300 Pro 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "12GB + 256GB", price: 44880 }, { name: "12GB + 512GB", price: 48000 }] },
    { brandId: 'vivo', name: "Vivo X300 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 256GB", price: 36465 }, { name: "12GB + 256GB", price: 39000 }] },
    { brandId: 'vivo', name: "Vivo X300 FE 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 256GB", price: 28050 }, { name: "12GB + 256GB", price: 30000 }] },
    { brandId: 'vivo', name: "Vivo X200T", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 25245 }, { name: "8GB + 256GB", price: 27000 }] },
    { brandId: 'vivo', name: "Vivo X200 Pro", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "12GB + 256GB", price: 39270 }, { name: "12GB + 512GB", price: 42000 }] },
    { brandId: 'vivo', name: "Vivo V70 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 21879 }, { name: "8GB + 256GB", price: 23500 }] },
    { brandId: 'vivo', name: "Vivo V70 Elite", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 19635 }, { name: "8GB + 256GB", price: 21000 }] },
    { brandId: 'vivo', name: "Vivo V70 FE", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 16830 }, { name: "8GB + 256GB", price: 18000 }] },
    { brandId: 'vivo', name: "Vivo V60 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 17952 }, { name: "8GB + 256GB", price: 19000 }] },
    { brandId: 'vivo', name: "Vivo V60e 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 14586 }, { name: "8GB + 256GB", price: 15500 }] },
    { brandId: 'vivo', name: "Vivo T5 Pro", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 14025 }, { name: "8GB + 256GB", price: 15000 }] },
    { brandId: 'vivo', name: "Vivo T5x 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "6GB + 128GB", price: 9537 }, { name: "8GB + 128GB", price: 10000 }] },
    { brandId: 'vivo', name: "Vivo T5 Lite 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "4GB + 128GB", price: 7854 }, { name: "6GB + 128GB", price: 8500 }] },
    { brandId: 'vivo', name: "Vivo T4 5G / Ultra", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "6GB + 128GB", price: 11220 }, { name: "8GB + 128GB", price: 12000 }] },
    { brandId: 'vivo', name: "Vivo S2 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 256GB", price: 18513 }, { name: "12GB + 256GB", price: 19800 }] },
    { brandId: 'vivo', name: "Vivo S50 / Mini", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 15708 }, { name: "8GB + 256GB", price: 16800 }] },
    { brandId: 'vivo', name: "Vivo Y600 Pro", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "8GB + 128GB", price: 12342 }, { name: "8GB + 256GB", price: 13500 }] },
    { brandId: 'vivo', name: "Vivo Y500 Pro", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "6GB + 128GB", price: 10098 }, { name: "8GB + 128GB", price: 11000 }] },
    { brandId: 'vivo', name: "Vivo Y500 5G", priority: 10, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', variants: [{ name: "6GB + 128GB", price: 8415 }, { name: "8GB + 128GB", price: 9000 }] }
];

async function seed() {
    console.log("Starting 2026 models database seeding...");
    
    for (const item of NEW_2026_MODELS) {
        // Ensure brand exists
        let brand = await prisma.brand.findUnique({ where: { id: item.brandId } });
        if (!brand) {
            console.log(`Creating Brand: ${item.brandId}`);
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

        // Find or Create Model
        let model = await prisma.model.findFirst({
            where: {
                brandId: item.brandId,
                name: { equals: item.name, mode: 'insensitive' }
            }
        });

        if (!model) {
            console.log(`Creating Model: ${item.name} (Priority: ${item.priority})`);
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
            // Update priority to make sure it stays on top
            if (model.priority !== item.priority) {
                await prisma.model.update({
                    where: { id: model.id },
                    data: { priority: item.priority }
                });
                console.log(`Updated priority for ${item.name} to ${item.priority}`);
            }
        }

        // Find or Create Variants
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
                    console.log(`Updated ${item.name} ${vName} price: ${variant.basePrice} -> ${v.price}`);
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
                console.log(`Created ${item.name} ${vName} at ${v.price}`);
            }
        }
    }
    
    console.log("Seeding complete!");
}

seed()
    .catch(err => {
        console.error("Seeding failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
