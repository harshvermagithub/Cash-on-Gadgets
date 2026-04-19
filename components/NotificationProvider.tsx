"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { getNotifications, markAsRead } from '@/actions/notifications';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    orderId?: string | null;
    isRead: boolean;
    createdAt: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    refreshNotifications: () => Promise<void>;
    markRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ 
    children, 
    userId, 
    userRole,
    riderId
}: { 
    children: React.ReactNode; 
    userId?: string; 
    userRole?: string;
    riderId?: string;
}) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        if (!userId && !riderId && !userRole) return;
        const res = await getNotifications(userRole || '', userId || '');
        if (res.success && res.notifications) {
            setNotifications(res.notifications.map((n: any) => ({
                ...n,
                createdAt: new Date(n.createdAt)
            })));
        }
    };

    useEffect(() => {
        if (!userId && !riderId && !userRole) return;

        fetchNotifications();

        // Subscribe to real-time notifications
        const channel = supabaseClient
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Notification',
                },
                (payload) => {
                    const newNotif = payload.new as any;
                    
                    // Check if this notification belongs to the current user
                    const isForMe = 
                        (newNotif.userId === userId) || 
                        (newNotif.riderId === riderId) ||
                        (newNotif.role === userRole) ||
                        (!newNotif.userId && !newNotif.role && !newNotif.riderId); 

                    if (isForMe) {
                        setNotifications(prev => [
                            { ...newNotif, createdAt: new Date(newNotif.createdAt) },
                            ...prev
                        ]);

                        // Browser Notification
                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            new window.Notification(newNotif.title, {
                                body: newNotif.message,
                                icon: '/icon.png'
                            });
                        }
                    }
                }
            )
            .subscribe();

        // Request Browser Permission
        if (typeof window !== 'undefined' && typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [userId, userRole, riderId]);

    const markRead = async (id: string) => {
        const res = await markAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            refreshNotifications: fetchNotifications,
            markRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
