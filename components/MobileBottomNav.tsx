'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, ShoppingBag, Briefcase, User } from 'lucide-react';

interface MobileBottomNavProps {
    session?: {
        user?: {
            id?: string | null;
            name?: string | null;
            role?: string | null;
        };
    } | null;
}

export function MobileBottomNav({ session }: MobileBottomNavProps) {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: Home,
            isActive: pathname === '/'
        },
        {
            href: '/sell',
            label: 'Sell',
            icon: Smartphone,
            isActive: pathname?.startsWith('/sell'),
            isSpecial: true
        },
        {
            href: '/orders',
            label: 'Orders',
            icon: ShoppingBag,
            isActive: pathname?.startsWith('/orders')
        },
        {
            href: '/careers',
            label: 'Careers',
            icon: Briefcase,
            isActive: pathname?.startsWith('/careers'),
            badgePulse: true
        },
        {
            href: session ? '/profile' : '/login',
            label: 'Account',
            icon: User,
            isActive: pathname?.startsWith('/profile') || pathname === '/login'
        }
    ];

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-2xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 px-3"
        >
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    if (item.isSpecial) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-label="Sell Gadget - Get Instant Quote"
                                aria-current={item.isActive ? 'page' : undefined}
                                className="group -mt-4 flex flex-col items-center focus:outline-none"
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
                                        item.isActive
                                            ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white ring-4 ring-emerald-500/20'
                                            : 'bg-gradient-to-tr from-emerald-600 to-green-600 text-white shadow-emerald-600/30'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold text-foreground mt-1 tracking-tight">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.label}
                            aria-current={item.isActive ? 'page' : undefined}
                            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 focus:outline-none ${
                                item.isActive
                                    ? 'text-primary font-bold'
                                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                            }`}
                        >
                            <div className="relative">
                                <Icon className={`h-5 w-5 transition-transform ${item.isActive ? 'scale-110' : ''}`} />
                                {item.badgePulse && (
                                    <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                                {item.label}
                            </span>
                            {item.isActive && (
                                <span className="absolute -bottom-0.5 h-1 w-4 bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary),0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default MobileBottomNav;
