"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type NotificationType = "info" | "order_new" | "order_assigned";

export async function createNotification({
    userId,
    role,
    title,
    message,
    type = "info",
    orderId
}: {
    userId?: string;
    role?: string;
    title: string;
    message: string;
    type?: NotificationType;
    orderId?: string;
}) {
    try {
        const notif = await prisma.notification.create({
            data: {
                userId,
                role,
                title,
                message,
                type,
                orderId
            }
        });
        return { success: true, notification: notif };
    } catch (error) {
        console.error("Failed to create notification:", error);
        return { success: false, error };
    }
}

export async function getNotifications(userRole: string, userId: string) {
    try {
        // Fetch notifications targeting the user's role or their specific ID
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { role: userRole },
                    { userId: userId },
                    { role: null, userId: null } // System-wide for all admins
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return { success: true, notifications };
    } catch (error) {
        return { success: false, error };
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function markAllAsRead(userRole: string, userId: string) {
    try {
        await prisma.notification.updateMany({
            where: {
                OR: [
                    { role: userRole },
                    { userId: userId }
                ],
                isRead: false
            },
            data: { isRead: true }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}
