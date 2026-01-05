import { prisma } from '@/lib/db';
import { Rider as PrismaRider, Brand as PrismaBrand, Model as PrismaModel, Variant as PrismaVariant, Order as PrismaOrder } from '@prisma/client';

// Re-export interfaces for app compatibility, though Prisma types are preferred
export interface User {
    id: string;
    email: string;
    phone?: string | null;
    passwordHash: string;
    name: string;
    role: string;
}

export type Rider = PrismaRider;

export interface Order {
    id: string;
    userId: string;
    device: string;
    price: number;
    date: string;
    status: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    } | null;
    riderId?: string | null;
    answers?: unknown;
}

export type Brand = PrismaBrand;
export type Model = PrismaModel;
export type Variant = PrismaVariant;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EvaluationRule = any;

export const db = {
    getUsers: async () => {
        return await prisma.user.findMany();
    },
    addUser: async (user: User) => {
        await prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                passwordHash: user.passwordHash,
                role: user.role
            }
        });
    },
    findUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({ where: { email } });
    },
    getOrders: async (userId: string) => {
        const orders = await prisma.order.findMany({ where: { userId } });
        return orders.map(mapPrismaOrderToAppOrder);
    },
    getAllOrders: async () => {
        const orders = await prisma.order.findMany();
        return orders.map(mapPrismaOrderToAppOrder);
    },
    addOrder: async (order: Order) => {
        await prisma.order.create({
            data: {
                id: order.id,
                userId: order.userId,
                device: order.device,
                price: order.price,
                status: order.status,
                address: order.address,
                locationLat: order.location?.lat,
                locationLng: order.location?.lng,
                answers: order.answers ? JSON.stringify(order.answers) : null,
                createdAt: new Date(order.date), // Assuming ISO string is passed
            }
        });
    },
    updateOrderRider: async (orderId: string, riderId: string) => {
        try {
            await prisma.order.update({
                where: { id: orderId },
                data: { riderId, status: 'assigned' }
            });
            return true;
        } catch {
            return false;
        }
    },
    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            await prisma.order.update({
                where: { id: orderId },
                data: { status }
            });
            return true;
        } catch {
            return false;
        }
    },

    // Rider Methods
    getRiders: async () => {
        return await prisma.rider.findMany();
    },
    addRider: async (rider: { id: string, name: string, phone: string, status?: string, password?: string | null }) => {
        await prisma.rider.create({
            data: {
                id: rider.id,
                name: rider.name,
                phone: rider.phone,
                status: rider.status || 'available',
                password: rider.password
            }
        });
    },
    updateRiderPassword: async (id: string, password: string) => {
        await prisma.rider.update({
            where: { id },
            data: { password }
        });
    },
    deleteRider: async (id: string) => {
        await prisma.rider.delete({ where: { id } });
    },

    // Brand Methods
    getBrands: async (category?: string) => {
        if (category) {
            const where: any = {
                OR: [
                    { categories: { has: category } }
                ]
            };

            // Legacy fallback: untagged brands appear in smartphone section
            if (category === 'smartphone') {
                where.OR.push({ categories: { equals: [] } });
            }

            return await prisma.brand.findMany({
                where,
                orderBy: [{ priority: 'asc' }, { name: 'asc' }]
            });
        }
        return await prisma.brand.findMany({
            orderBy: [{ priority: 'asc' }, { name: 'asc' }]
        });
    },
    addBrand: async (brand: Brand) => {
        // If categories passed in brand object, they are saved.
        // We generally use higher level logic to handle upserts now.
        await prisma.brand.create({ data: brand });
    },
    addCategoryToBrand: async (id: string, category: string) => {
        const brand = await prisma.brand.findUnique({ where: { id } }) as any;
        if (brand && !brand.categories.includes(category)) {
            await prisma.brand.update({
                where: { id },
                data: { categories: { push: category } } as any
            });
        }
    },
    getBrand: async (id: string) => {
        return await prisma.brand.findUnique({ where: { id } });
    },
    removeCategoryFromBrand: async (id: string, category: string) => {
        const brand = await prisma.brand.findUnique({ where: { id } }) as any;
        if (!brand) return;
        const newCats = brand.categories.filter((c: string) => c !== category);
        if (newCats.length !== brand.categories.length) {
            if (newCats.length === 0) {
                // No categories left, delete brand
                await prisma.brand.delete({ where: { id } });
            } else {
                await prisma.brand.update({
                    where: { id },
                    data: { categories: newCats } as any
                });
            }
        }
    },
    updateBrand: async (id: string, name: string, logo: string, priority?: number) => {
        await prisma.brand.update({
            where: { id },
            data: { name, logo, priority }
        });
    },
    deleteBrand: async (id: string) => {
        await prisma.brand.delete({ where: { id } });
    },

    // Model Methods
    getModels: async (brandId?: string, category?: string) => {
        const where: any = {};
        if (brandId) where.brandId = brandId;

        if (category) {
            if (category === 'smartphone') {
                // Use 'in' filter for better compatibility and performance
                where.category = { in: ['smartphone', ''] };
            } else {
                where.category = category;
            }
        }

        return await prisma.model.findMany({
            where,
            orderBy: [{ priority: 'asc' }, { name: 'asc' }]
        });
    },
    addModel: async (model: Model) => {
        await prisma.model.create({ data: model });
    },
    updateModel: async (id: string, brandId: string, name: string, img: string, category: string = 'smartphone', priority: number = 100) => {
        await prisma.model.update({
            where: { id },
            data: { brandId, name, img, category, priority } as any
        });
    },
    updateModelPriorities: async (items: { id: string, priority: number }[]) => {
        // Use a transaction for atomic updates
        await prisma.$transaction(
            items.map(item =>
                prisma.model.update({
                    where: { id: item.id },
                    data: { priority: item.priority }
                })
            )
        );
    },
    deleteModel: async (id: string) => {
        await prisma.model.delete({ where: { id } });
    },

    // Variant Methods
    getVariants: async (modelId?: string) => {
        if (modelId) return await prisma.variant.findMany({
            where: { modelId },
            orderBy: { basePrice: 'asc' }
        });
        return await prisma.variant.findMany({
            orderBy: { basePrice: 'asc' }
        });
    },
    addVariant: async (variant: Variant) => {
        await prisma.variant.create({ data: variant });
    },
    updateVariant: async (id: string, modelId: string, name: string, basePrice: number) => {
        await prisma.variant.update({
            where: { id },
            data: { modelId, name, basePrice }
        });
    },
    deleteVariant: async (id: string) => {
        await prisma.variant.delete({ where: { id } });
    },

    // Evaluation Rule Methods
    getEvaluationRules: async (category: string) => {
        // Defensive check for case where Prisma client might not be refreshed in build env
        const client = prisma as any;
        if (!client.evaluationRule) {
            console.warn("EvaluationRule model not found in Prisma client. Falling back to empty rules.");
            return [];
        }

        return await client.evaluationRule.findMany({
            where: { category }
        });
    },
    upsertEvaluationRule: async (data: { category: string, questionKey: string, answerKey: string, label: string, deductionAmount: number, deductionPercent: number }) => {
        const client = prisma as any;
        await client.evaluationRule.upsert({
            where: {
                category_questionKey_answerKey: {
                    category: data.category,
                    questionKey: data.questionKey,
                    answerKey: data.answerKey
                }
            } as any,
            create: data as any,
            update: {
                deductionAmount: data.deductionAmount,
                deductionPercent: data.deductionPercent,
                label: data.label
            } as any
        });
    }
};

function mapPrismaOrderToAppOrder(o: PrismaOrder): Order {
    return {
        id: o.id,
        userId: o.userId,
        device: o.device,
        price: o.price,
        date: o.createdAt.toISOString(),
        status: o.status,
        address: o.address,
        location: (o.locationLat && o.locationLng) ? { lat: o.locationLat, lng: o.locationLng } : null,
        riderId: o.riderId,
        answers: o.answers ? JSON.parse(o.answers) : null
    };
}
