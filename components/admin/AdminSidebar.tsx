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
    ExternalLink,
    Mail,
    MapPin,
    Briefcase,
    Building2
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

export default function AdminSidebar({ role = 'SUPER_ADMIN' }: { role?: string }) {
    const pathname = usePathname();

    const dashboardTitle = role === 'ZONAL_HEAD' ? 'Zonal Head' :
        ['SUPER_ADMIN', 'ADMIN'].includes(role) ? 'Admin' :
            'Partner';

    return (
        <aside className="w-[72px] lg:w-64 bg-card dark:bg-black border-r border-border dark:border-white/10 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-30">
            <div className="h-16 border-b border-border dark:border-white/10 shrink-0 flex items-center justify-center lg:justify-start lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-primary leading-tight overflow-hidden" title={dashboardTitle}>
                    <LayoutDashboard className="shrink-0 w-6 h-6" />
                    <span className="hidden lg:inline whitespace-nowrap">{dashboardTitle}</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-4 lg:p-4 space-y-1">
                <Link
                    href="/admin"
                    title="Dashboard"
                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline">Dashboard</span>
                </Link>

                <div className="pt-4 pb-2 text-center lg:text-left">
                    <p className="hidden lg:block px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inventory</p>
                    <div className="lg:hidden h-px bg-border/50 mx-2 my-2"></div>
                </div>

                {['SUPER_ADMIN', 'ADMIN'].includes(role) && CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = pathname === `/admin/category/${cat.id}`;
                    return (
                        <Link
                            key={cat.id}
                            href={`/admin/category/${cat.id}`}
                            title={cat.label}
                            className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="hidden lg:inline whitespace-nowrap">{cat.label}</span>
                        </Link>
                    );
                })}

                {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                    <>
                        <div className="pt-4 pb-2 text-center lg:text-left">
                            <p className="hidden lg:block px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</p>
                            <div className="lg:hidden h-px bg-border/50 mx-2 my-2"></div>
                        </div>
                        <Link
                            href="/admin/admins"
                            title="Users"
                            className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/admins') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Users className="w-5 h-5 shrink-0" />
                            <span className="hidden lg:inline whitespace-nowrap">Users</span>
                        </Link>
                        <Link
                            href="/admin/inbox"
                            title="Mail Inbox"
                            className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/inbox') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Mail className="w-5 h-5 shrink-0" />
                            <span className="hidden lg:inline whitespace-nowrap">Mail Inbox</span>
                        </Link>
                    </>
                )}

                {['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD'].includes(role) && (
                    <>
                        <div className="pt-4 pb-2 text-center lg:text-left">
                            <p className="hidden lg:block px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hierarchy</p>
                            <div className="lg:hidden h-px bg-border/50 mx-2 my-2"></div>
                        </div>
                        <Link
                            href="/admin/cities"
                            title="Cities Workspace"
                            className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/cities') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <MapPin className="w-5 h-5 shrink-0" />
                            <span className="hidden lg:inline whitespace-nowrap">Cities Workspace</span>
                        </Link>
                    </>
                )}

                {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                    <Link
                        href="/admin/zonal-heads"
                        title="Zonal Heads"
                        className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/zonal-heads') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                        <Briefcase className="w-5 h-5 shrink-0" />
                        <span className="hidden lg:inline whitespace-nowrap">Zonal Heads</span>
                    </Link>
                )}

                {['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD'].includes(role) && (
                    <Link
                        href="/admin/partners"
                        title="Partners"
                        className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/partners') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                        <Building2 className="w-5 h-5 shrink-0" />
                        <span className="hidden lg:inline whitespace-nowrap">Partners</span>
                    </Link>
                )}

                <div className="pt-4 pb-2 text-center lg:text-left">
                    <p className="hidden lg:block px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logistics</p>
                    <div className="lg:hidden h-px bg-border/50 mx-2 my-2"></div>
                </div>
                <Link href="/admin/riders"
                    title="Field Executives"
                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('riders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                    <Users className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline whitespace-nowrap">Field Executives</span>
                </Link>
                <Link href="/admin/orders"
                    title="Orders"
                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('orders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                    <ShoppingCart className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline whitespace-nowrap">Orders</span>
                </Link>

            </nav>

            <div className="p-2 lg:p-4 border-t border-border dark:border-white/10 mt-auto flex justify-center lg:justify-start">
                <Link href="/" title="View Website" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full">
                    <ExternalLink className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline whitespace-nowrap">View Website</span>
                </Link>
            </div>
        </aside>
    );
}
