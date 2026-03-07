import { prisma } from '@/lib/db';
import AdminManager from '@/components/admin/AdminManager';

export const dynamic = 'force-dynamic';

export default async function AdminsPage() {
    const allUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
    
    const riders = await prisma.rider.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const superAdmins = allUsers.filter(u => u.role === 'SUPER_ADMIN');
    const admins = allUsers.filter(u => u.role === 'ADMIN');
    const zonalHeads = allUsers.filter(u => u.role === 'ZONAL_HEAD');
    const partners = allUsers.filter(u => u.role === 'PARTNER');

    return (
        <div className="container mx-auto max-w-6xl h-[calc(100vh-theme(spacing.16))] overflow-y-auto w-full p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Role Management Directory</h1>
                <p className="text-muted-foreground">View system administrators, zonal heads, partners, and field executives.</p>
            </div>

            <AdminManager 
                superAdmins={superAdmins} 
                admins={admins} 
                zonalHeads={zonalHeads} 
                partners={partners} 
                riders={riders} 
            />
        </div>
    );
}
