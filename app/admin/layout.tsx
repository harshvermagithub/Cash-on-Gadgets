
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Smartphone, Layers, Tag, LogOut, ExternalLink, Users, ShoppingCart } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session || !session.user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:block">
                <div className="p-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <LayoutDashboard className="w-6 h-6" />
                        <span>Admin Panel</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/brands" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <Smartphone className="w-5 h-5" />
                        Brands
                    </Link>
                    <Link href="/admin/models" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <Layers className="w-5 h-5" />
                        Models
                    </Link>
                    <Link href="/admin/variants" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <Tag className="w-5 h-5" />
                        Pricing
                    </Link>
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logistics</p>
                    </div>
                    <Link href="/admin/riders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <Users className="w-5 h-5" />
                        Executives
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                        <ExternalLink className="w-5 h-5" />
                        View Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
