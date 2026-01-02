
'use client';

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
    ExternalLink
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

    return (
        <aside className="w-64 bg-card border-r hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b shrink-0">
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
        </aside>
    );
}
