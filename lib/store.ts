
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
}


export interface Rider {
    id: string;
    name: string;
    phone: string;
    status: 'available' | 'busy' | 'offline';
    password?: string | null;
}

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
    riderId?: string; // Assigned rider
    answers?: any; // Questionnaire answers
}

export interface Brand {
    id: string;
    name: string;
    logo: string;
}

export interface Model {
    id: string;
    brandId: string;
    name: string;
    img: string;
}

export interface Variant {
    id: string;
    modelId: string;
    name: string;
    basePrice: number;
}

interface DB {
    users: User[];
    orders: Order[];
    brands: Brand[];
    models: Model[];
    variants: Variant[];
    riders: Rider[];
}

function readDB(): DB {
    if (!fs.existsSync(DB_PATH)) {
        return { users: [], orders: [], brands: [], models: [], variants: [], riders: [] };
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            users: parsed.users || [],
            orders: parsed.orders || [],
            brands: parsed.brands || [],
            models: parsed.models || [],
            variants: parsed.variants || [],
            riders: parsed.riders || []
        };
    } catch (error) {
        return { users: [], orders: [], brands: [], models: [], variants: [], riders: [] };
    }
}

function writeDB(data: DB) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
    getUsers: () => readDB().users,
    addUser: (user: User) => {
        const data = readDB();
        data.users.push(user);
        writeDB(data);
    },
    findUserByEmail: (email: string) => {
        const data = readDB();
        return data.users.find(u => u.email === email);
    },
    getOrders: (userId: string) => {
        const data = readDB();
        return data.orders.filter(o => o.userId === userId);
    },
    getAllOrders: () => {
        const data = readDB();
        return data.orders; // For admin
    },
    addOrder: (order: Order) => {
        const data = readDB();
        data.orders.push(order);
        writeDB(data);
    },
    updateOrderRider: (orderId: string, riderId: string) => {
        const data = readDB();
        const order = data.orders.find(o => o.id === orderId);
        if (order) {
            order.riderId = riderId;
            order.status = 'assigned'; // Auto-update status when rider assigned
            writeDB(data);
            return true;
        }
        return false;
    },
    updateOrderStatus: (orderId: string, status: string) => {
        const data = readDB();
        const order = data.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            writeDB(data);
            return true;
        }
        return false;
    },
    // Rider Methods
    getRiders: () => readDB().riders,
    addRider: (rider: Rider) => {
        const data = readDB();
        data.riders.push(rider);
        writeDB(data);
    },
    updateRiderPassword: (id: string, password: string) => {
        const data = readDB();
        const rider = data.riders.find(r => r.id === id);
        if (rider) {
            rider.password = password;
            writeDB(data);
        }
    },
    deleteRider: (id: string) => {
        const data = readDB();
        data.riders = data.riders.filter(r => r.id !== id);
        writeDB(data);
    },
    // Catalog Methods
    getBrands: () => readDB().brands,
    addBrand: (brand: Brand) => {
        const data = readDB();
        data.brands.push(brand);
        writeDB(data);
    },
    deleteBrand: (id: string) => {
        const data = readDB();
        data.brands = data.brands.filter(b => b.id !== id);
        writeDB(data);
    },
    getModels: (brandId?: string) => {
        const data = readDB();
        if (brandId) return data.models.filter(m => m.brandId === brandId);
        return data.models;
    },
    addModel: (model: Model) => {
        const data = readDB();
        data.models.push(model);
        writeDB(data);
    },
    deleteModel: (id: string) => {
        const data = readDB();
        data.models = data.models.filter(m => m.id !== id);
        writeDB(data);
    },
    getVariants: (modelId?: string) => {
        const data = readDB();
        if (modelId) return data.variants.filter(v => v.modelId === modelId);
        return data.variants;
    },
    addVariant: (variant: Variant) => {
        const data = readDB();
        data.variants.push(variant);
        writeDB(data);
    },
    deleteVariant: (id: string) => {
        const data = readDB();
        data.variants = data.variants.filter(v => v.id !== id);
        writeDB(data);
    }
};
