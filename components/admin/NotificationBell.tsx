"use client";

import React, { useState } from 'react';
import { useNotifications } from '@/components/NotificationProvider';
import { Bell, Package, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export function NotificationBell() {
    const { notifications, unreadCount, markRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-emerald-500/10 transition-colors">
                    <Bell className={cn("h-5 w-5", unreadCount > 0 ? "text-emerald-500 animate-pulse" : "text-muted-foreground")} />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-500 text-white border-2 border-background animate-in zoom-in">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4 mt-2 border-emerald-500/20 shadow-2xl overflow-hidden rounded-2xl" align="end">
                <div className="flex items-center justify-between p-4 border-b bg-emerald-500/5">
                    <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 space-y-3 opacity-50">
                            <Bell className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-xs font-medium italic">Your inbox is clear</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-emerald-500/5">
                            {notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={cn(
                                        "p-4 transition-all hover:bg-emerald-500/[0.03] cursor-default group relative",
                                        !notif.isRead && "bg-emerald-500/[0.02]"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                            notif.type.startsWith('order') ? "bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800" : "bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800"
                                        )}>
                                            {notif.type.startsWith('order') ? <Package className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="space-y-1 pr-6">
                                            <p className={cn("text-xs font-bold leading-none", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>
                                                {notif.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="text-[10px] font-medium text-emerald-600/50">
                                                    {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
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
                                            className="absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white"
                                        >
                                            <Check className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                
                <div className="p-2 border-t bg-muted/20">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-emerald-500" asChild>
                        <Link href="/admin/orders" onClick={() => setIsOpen(false)}>Manage All Activity</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
