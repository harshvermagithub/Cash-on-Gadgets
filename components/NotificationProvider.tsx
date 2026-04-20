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

    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log("Audio play blocked", e));
        } catch (e) {
            console.error("Audio failed", e);
        }
    };

    useEffect(() => {
        if (!userId && !riderId && !userRole) return;

        fetchNotifications();

        // Browser Permission Check
        if (typeof window !== 'undefined' && typeof Notification !== 'undefined') {
            if (Notification.permission === 'default') {
                const timer = setTimeout(() => setShowPermissionPrompt(true), 2000);
                return () => clearTimeout(timer);
            }
        }

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
                    const isForMe = 
                        (newNotif.userId === userId) || 
                        (newNotif.riderId === riderId) ||
                        (newNotif.role === userRole) ||
                        (!newNotif.userId && !newNotif.role && !newNotif.riderId); 

                    if (isForMe) {
                        playNotificationSound();
                        setNotifications(prev => [
                            { ...newNotif, createdAt: new Date(newNotif.createdAt) },
                            ...prev
                        ]);

                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            new window.Notification(newNotif.title, {
                                body: newNotif.message,
                                icon: '/icon.png',
                                badge: '/icon.png',
                                tag: newNotif.id,
                                renotify: true
                            } as any);
                        }
                    }
                }
            )
            .subscribe();

        // Polling Fallback (Every 30 seconds)
        const pollTimer = setInterval(fetchNotifications, 30000);

        return () => {
            supabaseClient.removeChannel(channel);
            clearInterval(pollTimer);
        };
    }, [userId, userRole, riderId]);

    const requestBrowserPermission = async () => {
        if (typeof Notification !== 'undefined') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new window.Notification("Notifications Enabled!", {
                    body: "You will now receive alerts for new orders and assignments.",
                    icon: '/icon.png'
                });
            }
            setShowPermissionPrompt(false);
        }
    };

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

            {/* Permission Prompt Modal */}
            {showPermissionPrompt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-emerald-500/20 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-emerald-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Enable Alerts?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                            Stay updated with real-time notifications for new orders and assignments even when the app is in the background.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={requestBrowserPermission}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                            >
                                ALLOW NOTIFICATIONS
                            </button>
                            <button 
                                onClick={() => setShowPermissionPrompt(false)}
                                className="w-full py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
