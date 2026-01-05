'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Smartphone,
    Tablet,
    Watch,
    Laptop,
    Gamepad2,
    Tv,
    Wrench,
    Users,
    ShoppingCart,
    ExternalLink,
    Menu,
    X,
    ShieldCheck
} from 'lucide-react';

const CATEGORIES = [
    { id: 'smartphone', label: 'Smartphones', icon: Smartphone },
    { id: 'tablet', label: 'Tablets', icon: Tablet },
    { id: 'smartwatch', label: 'Smartwatches', icon: Watch },
    { id: 'laptop', label: 'Laptops', icon: Laptop },
    { id: 'console', label: 'Consoles', icon: Gamepad2 },
    { id: 'tv', label: 'Smart TV', icon: Tv },
    { id: 'repair-device', label: 'Repair', icon: Wrench },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close mobile menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const SidebarNav = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b shrink-0 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <LayoutDashboard className="w-6 h-6" />
                    <span>Admin Panel</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <Link
                    href="/admin"
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                        }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inventory</p>
                </div>

                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = pathname === `/admin/category/${cat.id}`;

                    return (
                        <Link
                            key={cat.id}
                            href={`/admin/category/${cat.id}`}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {cat.label}
                        </Link>
                    );
                })}

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</p>
                </div>
                <Link
                    href="/admin/admins"
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/admins') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                        }`}
                >
                    <ShieldCheck className="w-5 h-5" />
                    Admins
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logistics</p>
                </div>
                <Link href="/admin/riders"
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('riders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                        }`}
                >
                    <Users className="w-5 h-5" />
                    Executives
                </Link>
                <Link href="/admin/orders"
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('orders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    Orders
                </Link>

            </nav>

            <div className="p-4 border-t mt-auto">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <ExternalLink className="w-5 h-5" />
                    View Website
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Left side, fixed on desktop) */}
            <aside className="w-64 bg-card border-r hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
                <SidebarNav />
            </aside>

            {/* Mobile/Tablet Header (Top, visible on small screens) */}
            <div className="lg:hidden p-4 bg-card border-b flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <Link href="/admin" className="font-bold flex items-center gap-2 text-primary text-lg">
                    <LayoutDashboard className="w-5 h-5" /> Admin Panel
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 border rounded-lg hover:bg-muted transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Overlay Menu */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />
                    <aside className="relative w-64 h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-6 z-10 p-1 hover:bg-muted rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarNav />
                    </aside>
                </div>
            )}
        </>
    );
}
