import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

export interface BannerPriceItem {
    id: string;
    categoryKey: string;
    categoryName: string;
    displayPrice: string;
}

export const DEFAULT_HERO_PRICES: BannerPriceItem[] = [
    {
        id: 'price-phones',
        categoryKey: 'phones',
        categoryName: 'Smartphones',
        displayPrice: '₹1,29,000+'
    },
    {
        id: 'price-laptops',
        categoryKey: 'laptops',
        categoryName: 'Laptops',
        displayPrice: '₹1,49,000+'
    },
    {
        id: 'price-tablets',
        categoryKey: 'tablets',
        categoryName: 'Tablets',
        displayPrice: '₹1,20,000+'
    },
    {
        id: 'price-watches',
        categoryKey: 'watches',
        categoryName: 'Smartwatches',
        displayPrice: '₹65,000+'
    },
    {
        id: 'price-cameras',
        categoryKey: 'cameras',
        categoryName: 'Cameras',
        displayPrice: '₹1,85,000+'
    }
];

const BACKUP_FILE_PATH = path.join(process.cwd(), 'lib', 'banner-prices.json');

function readBackupPrices(): BannerPriceItem[] {
    try {
        if (fs.existsSync(BACKUP_FILE_PATH)) {
            const raw = fs.readFileSync(BACKUP_FILE_PATH, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('[BannerPrices] Failed to read backup file:', e);
    }
    return DEFAULT_HERO_PRICES;
}

function writeBackupPrices(prices: BannerPriceItem[]) {
    try {
        fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(prices, null, 2), 'utf8');
    } catch (e) {
        console.warn('[BannerPrices] Failed to write backup file:', e);
    }
}

/**
 * Fetch all banner display prices with automatic fallback and seed guarantees.
 */
export async function fetchAllBannerPrices(): Promise<BannerPriceItem[]> {
    const backup = readBackupPrices();
    
    try {
        const dbPrices = await prisma.deviceDisplayPrice.findMany({
            orderBy: { categoryName: 'asc' }
        });

        if (dbPrices && dbPrices.length > 0) {
            // Check if any default categories are missing, add them if so
            const existingKeys = new Set(dbPrices.map(p => p.categoryKey));
            const missing = DEFAULT_HERO_PRICES.filter(d => !existingKeys.has(d.categoryKey));

            if (missing.length > 0) {
                for (const m of missing) {
                    try {
                        const created = await prisma.deviceDisplayPrice.create({
                            data: {
                                categoryKey: m.categoryKey,
                                categoryName: m.categoryName,
                                displayPrice: m.displayPrice
                            }
                        });
                        dbPrices.push(created);
                    } catch {
                        // ignore unique collision if concurrent
                    }
                }
            }

            const formatted = dbPrices.map(p => ({
                id: p.id,
                categoryKey: p.categoryKey,
                categoryName: p.categoryName,
                displayPrice: p.displayPrice
            }));

            // Sync with local backup
            writeBackupPrices(formatted);
            return formatted;
        }

        // Database is empty, attempt to seed
        try {
            for (const d of backup) {
                await prisma.deviceDisplayPrice.upsert({
                    where: { categoryKey: d.categoryKey },
                    update: { displayPrice: d.displayPrice },
                    create: {
                        categoryKey: d.categoryKey,
                        categoryName: d.categoryName,
                        displayPrice: d.displayPrice
                    }
                });
            }
            const seeded = await prisma.deviceDisplayPrice.findMany({
                orderBy: { categoryName: 'asc' }
            });
            if (seeded && seeded.length > 0) {
                const formatted = seeded.map(p => ({
                    id: p.id,
                    categoryKey: p.categoryKey,
                    categoryName: p.categoryName,
                    displayPrice: p.displayPrice
                }));
                writeBackupPrices(formatted);
                return formatted;
            }
        } catch (seedErr) {
            console.warn('[BannerPrices] Seed attempt failed, returning backup:', seedErr);
        }
    } catch (dbErr) {
        console.warn('[BannerPrices] DB query failed, using persistent backup:', dbErr);
    }

    return backup;
}

/**
 * Update a banner display price by id or categoryKey with dual persistence (DB + backup file).
 */
export async function saveBannerPriceItem(
    identifier: string,
    displayPrice: string,
    categoryKey?: string,
    categoryName?: string
): Promise<{ success: boolean; item?: BannerPriceItem }> {
    const backup = readBackupPrices();
    const formattedPrice = displayPrice.trim();

    // 1. Update in backup store first for instant reliability
    let updatedItem: BannerPriceItem | undefined;
    const itemIndex = backup.findIndex(
        b => b.id === identifier || b.categoryKey === identifier || (categoryKey && b.categoryKey === categoryKey)
    );

    if (itemIndex >= 0) {
        backup[itemIndex].displayPrice = formattedPrice;
        updatedItem = backup[itemIndex];
    } else if (categoryKey) {
        updatedItem = {
            id: identifier || `price-${categoryKey}`,
            categoryKey,
            categoryName: categoryName || categoryKey,
            displayPrice: formattedPrice
        };
        backup.push(updatedItem);
    }

    writeBackupPrices(backup);

    // 2. Persist to Prisma Database
    try {
        const key = categoryKey || updatedItem?.categoryKey;
        if (identifier && identifier.length > 10) {
            await prisma.deviceDisplayPrice.update({
                where: { id: identifier },
                data: { displayPrice: formattedPrice }
            });
        } else if (key) {
            await prisma.deviceDisplayPrice.upsert({
                where: { categoryKey: key },
                update: { displayPrice: formattedPrice },
                create: {
                    categoryKey: key,
                    categoryName: categoryName || updatedItem?.categoryName || key,
                    displayPrice: formattedPrice
                }
            });
        }
    } catch (dbErr) {
        console.warn('[BannerPrices] DB update failed, but backup file updated successfully:', dbErr);
    }

    return { success: true, item: updatedItem };
}
