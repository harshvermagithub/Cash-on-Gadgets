
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Smartphone, Layers, Tag, ExternalLink, Users, ShoppingCart } from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';

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
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
