import { prisma } from '@/lib/db';
import { Rider as PrismaRider, Brand as PrismaBrand, Model as PrismaModel, Variant as PrismaVariant, Order as PrismaOrder } from '@prisma/client';

// Re-export interfaces for app compatibility, though Prisma types are preferred
export interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
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
                passwordHash: user.passwordHash
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
    getBrands: async () => {
        return await prisma.brand.findMany();
    },
    addBrand: async (brand: Brand) => {
        await prisma.brand.create({ data: brand });
    },
    updateBrand: async (id: string, name: string, logo: string) => {
        await prisma.brand.update({
            where: { id },
            data: { name, logo }
        });
    },
    deleteBrand: async (id: string) => {
        await prisma.brand.delete({ where: { id } });
    },

    // Model Methods
    getModels: async (brandId?: string) => {
        if (brandId) return await prisma.model.findMany({ where: { brandId } });
        return await prisma.model.findMany();
    },
    addModel: async (model: Model) => {
        await prisma.model.create({ data: model });
    },
    updateModel: async (id: string, brandId: string, name: string, img: string) => {
        await prisma.model.update({
            where: { id },
            data: { brandId, name, img }
        });
    },
    deleteModel: async (id: string) => {
        await prisma.model.delete({ where: { id } });
    },

    // Variant Methods
    getVariants: async (modelId?: string) => {
        if (modelId) return await prisma.variant.findMany({ where: { modelId } });
        return await prisma.variant.findMany();
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
