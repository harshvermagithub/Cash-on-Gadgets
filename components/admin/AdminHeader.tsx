"use client";

import React from 'react';
import { NotificationBell } from './NotificationBell';
import { Search, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdminHeader() {
    return (
        <header className="h-16 border-b border-border dark:border-white/10 bg-card dark:bg-black/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <Input 
                        placeholder="Search orders, clients, or executives..." 
                        className="pl-10 h-10 bg-muted/50 border-transparent focus-visible:ring-emerald-500 transition-all rounded-xl"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                {/* Notification Bell */}
                <NotificationBell />
                
                <div className="h-8 w-px bg-border dark:bg-white/10 mx-1" />
                
                <button className="flex items-center gap-2 hover:bg-muted p-1 rounded-full transition-colors group">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold hidden lg:block tracking-tight">Account</span>
                </button>
            </div>
        </header>
    );
}
