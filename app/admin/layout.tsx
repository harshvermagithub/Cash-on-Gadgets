
import Link from 'next/link';
import { getSession, isAdmin } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Smartphone, Layers, Tag, ExternalLink, Users, ShoppingCart } from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session || !session.user || !isAdmin(session.user)) {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-muted/20 dark:bg-black flex-col lg:flex-row">
            {/* Sidebar */}
            <AdminSidebar role={session.user.role} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 w-full min-w-0">
                {children}
            </main>
        </div>
    );
}
