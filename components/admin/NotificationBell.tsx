"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/components/NotificationProvider';
import { Bell, Package, Check, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import Link from 'next/link';

export function NotificationBell() {
    const { notifications, unreadCount, markRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (date: Date | string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return past.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-emerald-500/10 transition-colors outline-none group"
            >
                <Bell className={cn("h-5 w-5 transition-all", unreadCount > 0 ? "text-emerald-500" : "text-muted-foreground group-hover:text-emerald-500")} />
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center bg-emerald-500 text-[10px] font-bold text-white rounded-full border-2 border-background"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-emerald-500/20 shadow-2xl rounded-2xl overflow-hidden z-50 origin-top-right"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-emerald-500/10 bg-emerald-500/5">
                            <h3 className="font-bold text-sm tracking-tight text-white">Notifications</h3>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest">
                                        {unreadCount} New
                                    </span>
                                )}
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 space-y-3 opacity-50">
                                    <Bell className="h-12 w-12 text-muted-foreground/30" />
                                    <p className="text-xs font-medium italic text-muted-foreground">Your inbox is clear</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-emerald-500/10">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            className={cn(
                                                "p-4 transition-all hover:bg-emerald-500/5 cursor-default group relative",
                                                !notif.isRead && "bg-emerald-500/[0.03]"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                                    notif.type.startsWith('order') 
                                                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                                                        : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                                )}>
                                                    {notif.type.startsWith('order') ? <Package className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                </div>
                                                <div className="space-y-1 flex-1 pr-6">
                                                    <p className={cn("text-xs font-bold leading-none", !notif.isRead ? "text-white" : "text-slate-400")}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <span className="text-[10px] font-medium text-emerald-500/50">
                                                            {formatTime(notif.createdAt)}
                                                        </span>
                                                        {notif.orderId && (
                                                            <Link 
                                                                href={`/admin/orders?search=${notif.orderId}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="text-[10px] font-black text-emerald-500 hover:underline underline-offset-2"
                                                            >
                                                                VIEW ORDER
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {!notif.isRead && (
                                                <button 
                                                    onClick={() => markRead(notif.id)}
                                                    className="absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center bg-slate-800 border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-2 border-t border-emerald-500/10 bg-emerald-500/5 text-center">
                            <Link 
                                href="/admin/orders" 
                                onClick={() => setIsOpen(false)}
                                className="inline-block py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                                Manage All Activity
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
