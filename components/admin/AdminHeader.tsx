"use client";

import React from 'react';
import { NotificationBell } from './NotificationBell';
import { Search, UserCircle } from 'lucide-react';
import { useNotifications } from '../NotificationProvider';
import { Volume2, VolumeX, Activity } from 'lucide-react';

function AudioAlertToggle() {
    const { audioEnabled, setAudioEnabled } = useNotifications();
    return (
        <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                audioEnabled 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                    : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
            }`}
        >
            <Activity className={`w-3 h-3 ${audioEnabled ? 'animate-pulse' : ''}`} />
            <span>{audioEnabled ? 'Buzzer Active' : 'Buzzer Muted'}</span>
            {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </button>
    );
}

export function AdminHeader() {
    return (
        <header className="h-16 border-b border-border dark:border-white/10 bg-card dark:bg-black/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search orders..." 
                        className="w-full pl-10 h-10 bg-muted/50 border border-transparent focus:border-emerald-500/50 focus:bg-background outline-none transition-all rounded-xl text-sm"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <AudioAlertToggle />
                {/* Debug: Test Notification Trigger */}
                <button 
                  onClick={async () => {
                    // Local Feedback FIRST
                    if (typeof Notification !== 'undefined') {
                      if (Notification.permission === 'granted') {
                        new window.Notification("Verification Signal Sent!", {
                          body: "If you see this, browser notifications are working. Checking DB sync...",
                          icon: '/icon.png'
                        });
                        // Play sound locally too
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(() => {});
                      } else {
                        alert('Please enable notifications first via the pop-up or browser settings (click the lock icon in address bar).');
                      }
                    }
                    
                    // DB Pulse SECOND
                    const { createNotification } = await import('@/actions/notifications');
                    await createNotification({
                        title: "Live Database Heartbeat",
                        message: "The real-time synchronization link is active and synchronized.",
                        type: "info"
                    });
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all"
                >
                  Test Alert
                </button>

                {/* Notification Bell */}
                <NotificationBell />
                
                <div className="h-8 w-px bg-border dark:bg-white/10 mx-1" />
                
                <button className="flex items-center gap-2 hover:bg-muted p-1 rounded-full transition-colors group outline-none">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold hidden lg:block tracking-tight text-white">Account</span>
                </button>
            </div>
        </header>
    );
}
