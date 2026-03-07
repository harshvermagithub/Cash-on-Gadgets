'use client';

import { useState } from 'react';
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
    Building2,
    ChevronRight,
    ChevronLeft
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
    const [isExpanded, setIsExpanded] = useState(false);

    const dashboardTitle = role === 'ZONAL_HEAD' ? 'Zonal Head' :
        ['SUPER_ADMIN', 'ADMIN'].includes(role) ? 'Admin' :
            'Partner';

    return (
        <>
            {/* Mobile Backdrop overlay */}
            {isExpanded && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <aside className={`bg-card dark:bg-black border-r border-border dark:border-white/10 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-30 ${isExpanded ? 'w-64 absolute lg:relative shadow-2xl lg:shadow-none' : 'w-[72px] lg:w-64'}`}>
                <div className="h-16 border-b border-border dark:border-white/10 shrink-0 flex items-center justify-center lg:justify-start lg:px-6 relative">
                    <Link href="/admin" className={`flex items-center gap-2 font-bold text-lg text-primary leading-tight overflow-hidden ${!isExpanded ? 'lg:mx-0' : ''}`} title={dashboardTitle}>
                        <LayoutDashboard className="shrink-0 w-6 h-6" />
                        <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>{dashboardTitle}</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-2 py-4 lg:p-4 space-y-1">
                    <Link
                        href="/admin"
                        title="Dashboard"
                        className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => setIsExpanded(false)}
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'}`}>Dashboard</span>
                    </Link>

                    <div className={`pt-4 pb-2 ${isExpanded ? 'text-left' : 'text-center lg:text-left'}`}>
                        <p className={`${isExpanded ? 'block' : 'hidden lg:block'} px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>Inventory</p>
                        <div className={`${isExpanded ? 'hidden' : 'lg:hidden'} h-px bg-border/50 mx-2 my-2`}></div>
                    </div>

                    {['SUPER_ADMIN', 'ADMIN'].includes(role) && CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = pathname === `/admin/category/${cat.id}`;
                        return (
                            <Link
                                key={cat.id}
                                href={`/admin/category/${cat.id}`}
                                title={cat.label}
                                className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                                onClick={() => setIsExpanded(false)}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>{cat.label}</span>
                            </Link>
                        );
                    })}

                    {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                        <>
                            <div className={`pt-4 pb-2 ${isExpanded ? 'text-left' : 'text-center lg:text-left'}`}>
                                <p className={`${isExpanded ? 'block' : 'hidden lg:block'} px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>System</p>
                                <div className={`${isExpanded ? 'hidden' : 'lg:hidden'} h-px bg-border/50 mx-2 my-2`}></div>
                            </div>
                            <Link
                                href="/admin/admins"
                                title="Users"
                                className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/admins') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                                onClick={() => setIsExpanded(false)}
                            >
                                <Users className="w-5 h-5 shrink-0" />
                                <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Users</span>
                            </Link>
                            <Link
                                href="/admin/inbox"
                                title="Mail Inbox"
                                className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/inbox') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                                onClick={() => setIsExpanded(false)}
                            >
                                <Mail className="w-5 h-5 shrink-0" />
                                <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Mail Inbox</span>
                            </Link>
                        </>
                    )}

                    {['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD'].includes(role) && (
                        <>
                            <div className={`pt-4 pb-2 ${isExpanded ? 'text-left' : 'text-center lg:text-left'}`}>
                                <p className={`${isExpanded ? 'block' : 'hidden lg:block'} px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>Hierarchy</p>
                                <div className={`${isExpanded ? 'hidden' : 'lg:hidden'} h-px bg-border/50 mx-2 my-2`}></div>
                            </div>
                            <Link
                                href="/admin/cities"
                                title="Cities Workspace"
                                className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/cities') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                                onClick={() => setIsExpanded(false)}
                            >
                                <MapPin className="w-5 h-5 shrink-0" />
                                <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Cities Workspace</span>
                            </Link>
                        </>
                    )}

                    {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                        <Link
                            href="/admin/zonal-heads"
                            title="Zonal Heads"
                            className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/zonal-heads') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                            onClick={() => setIsExpanded(false)}
                        >
                            <Briefcase className="w-5 h-5 shrink-0" />
                            <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Zonal Heads</span>
                        </Link>
                    )}

                    {['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD'].includes(role) && (
                        <Link
                            href="/admin/partners"
                            title="Partners"
                            className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('/admin/partners') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                            onClick={() => setIsExpanded(false)}
                        >
                            <Building2 className="w-5 h-5 shrink-0" />
                            <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Partners</span>
                        </Link>
                    )}

                    <div className={`pt-4 pb-2 ${isExpanded ? 'text-left' : 'text-center lg:text-left'}`}>
                        <p className={`${isExpanded ? 'block' : 'hidden lg:block'} px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>Logistics</p>
                        <div className={`${isExpanded ? 'hidden' : 'lg:hidden'} h-px bg-border/50 mx-2 my-2`}></div>
                    </div>
                    <Link href="/admin/riders"
                        title="Field Executives"
                        className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('riders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => setIsExpanded(false)}
                    >
                        <Users className="w-5 h-5 shrink-0" />
                        <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Field Executives</span>
                    </Link>
                    <Link href="/admin/orders"
                        title="Orders"
                        className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg transition-colors ${pathname.includes('orders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => setIsExpanded(false)}
                    >
                        <ShoppingCart className="w-5 h-5 shrink-0" />
                        <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>Orders</span>
                    </Link>

                </nav>

                <div className="p-2 lg:p-4 border-t border-border dark:border-white/10 mt-auto flex flex-col gap-2">
                    <Link href="/" title="View Website" className={`flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3 lg:justify-start lg:px-4 lg:py-3'} gap-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full`}>
                        <ExternalLink className="w-5 h-5 shrink-0" />
                        <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>View Website</span>
                    </Link>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`lg:hidden flex items-center ${isExpanded ? 'justify-start px-4 py-3' : 'justify-center p-3'} gap-3 text-sm font-medium rounded-lg text-muted-foreground bg-muted hover:bg-muted/80 transition-colors w-full mt-2`}
                        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isExpanded ? <ChevronLeft className="w-5 h-5 shrink-0" /> : <ChevronRight className="w-5 h-5 shrink-0" />}
                        <span className={`${isExpanded ? 'inline' : 'hidden'} whitespace-nowrap`}>Collapse</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
