
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
}

interface Order {
    id: string;
    userId: string;
    device: string;
    price: number;
    date: string;
    status: string;
}

interface DB {
    users: User[];
    orders: Order[];
}

function readDB(): DB {
    if (!fs.existsSync(DB_PATH)) {
        return { users: [], orders: [] };
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], orders: [] };
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
    addOrder: (order: Order) => {
        const data = readDB();
        data.orders.push(order);
        writeDB(data);
    }
};
