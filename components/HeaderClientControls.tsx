'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { User, LogOut, Menu, Sparkles, Smartphone, Briefcase, ShoppingBag } from 'lucide-react';
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
    const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), []);

    return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* ----------------- MOBILE VIEW ICONS (lg:hidden) ----------------- */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-1.5">
                {/* 1. Direct Sell / Check Price Quick Action */}
                <Link
                    href="/sell"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95"
                    aria-label="Sell Gadget / Check Price"
                >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Sell</span>
                </Link>

                {/* 2. Direct Careers Icon Button with Hiring Pulse */}
                <Link
                    href="/careers"
                    className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Careers - We're Hiring"
                >
                    <Briefcase className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </Link>

                {/* 3. Direct Orders Icon Button */}
                <Link
                    href="/orders"
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="My Orders"
                >
                    <ShoppingBag className="h-4 w-4" />
                </Link>

                {/* 4. Direct Profile / Login Icon Button */}
                <Link
                    href={session ? '/profile' : '/login'}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={session ? 'Profile' : 'Login'}
                >
                    <User className="h-4 w-4" />
                </Link>

                {/* 5. Mobile Menu Toggle for Full Navigation */}
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    aria-label="Open navigation sidebar"
                    aria-expanded={isDrawerOpen}
                    className="p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* ----------------- DESKTOP VIEW CONTROLS (hidden lg:flex) ----------------- */}
            <div className="hidden lg:flex items-center gap-3">
                <NavLinks session={session} isAdminUser={isAdminUser} />

                <div className="h-5 w-px bg-border/60 mx-1" />

                {/* Sell Gadget CTA Button */}
                <Link
                    href="/sell"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white shadow-xs hover:shadow-md hover:shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Sell Gadget</span>
                </Link>

                {/* User Profile / Auth State */}
                {session ? (
                    <div className="flex items-center gap-2">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-accent px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors shadow-2xs"
                    >
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Login</span>
                    </Link>
                )}

                {/* Desktop Menu Trigger */}
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    aria-label="Open navigation sidebar"
                    aria-expanded={isDrawerOpen}
                    className="p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-accent/80 border border-border/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Slide-out Navigation Drawer */}
            <SidebarDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                session={session}
                isAdminUser={isAdminUser}
            />
        </div>
    );
}

export default HeaderClientControls;
