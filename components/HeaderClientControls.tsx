'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Menu, Sparkles } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { SidebarDrawer } from './SidebarDrawer';
import { logout } from '@/lib/session';

interface HeaderSessionUser {
    id?: string | null;
    name?: string | null;
    role?: string | null;
}

interface HeaderClientControlsProps {
    session: { user?: HeaderSessionUser } | null;
    isAdminUser: boolean;
}

export function HeaderClientControls({ session, isAdminUser }: HeaderClientControlsProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center">
                <NavLinks session={session} isAdminUser={isAdminUser} />
            </div>

            <div className="hidden lg:block h-5 w-px bg-border/60 mx-1" />

            {/* Quick Action: Check Price / Sell Button (Visible on sm & up) */}
            <Link
                href="/sell"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white shadow-xs hover:shadow-md hover:shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sell Gadget</span>
            </Link>

            {/* User Profile / Auth State */}
            {session ? (
                <div className="hidden md:flex items-center gap-2">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/60 hover:bg-accent text-xs font-semibold text-foreground transition-colors"
                    >
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px]">
                            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <span className="max-w-[100px] truncate">{session.user?.name}</span>
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            aria-label="Logout"
                            className="p-2 rounded-full border border-border/60 bg-card/60 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ) : (
                <Link
                    href="/login"
                    className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-accent px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors shadow-2xs"
                >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Login</span>
                </Link>
            )}

            {/* Futuristic Hamburger / Menu Drawer Trigger */}
            <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open navigation sidebar"
                aria-expanded={isDrawerOpen}
                aria-controls="sidebar-drawer"
                className="group relative inline-flex items-center justify-center rounded-full p-2 text-foreground/80 hover:text-foreground hover:bg-accent/80 border border-border/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200"
            >
                <Menu className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="sr-only">Toggle menu</span>
                {/* Visual pulse indicator alerting to new hiring openings */}
                <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </button>

            {/* Accessible Slide-out Navigation Drawer */}
            <SidebarDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                session={session}
                isAdminUser={isAdminUser}
            />
        </div>
    );
}

export default HeaderClientControls;
