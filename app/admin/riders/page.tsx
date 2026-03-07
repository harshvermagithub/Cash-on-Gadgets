
import { prisma } from '@/lib/db';
import RiderManager from "@/components/admin/RiderManager";
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RidersPage() {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD', 'PARTNER'].includes(session.user?.role || '')) {
        redirect('/admin');
    }

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentUser) redirect('/admin');

    let riders = await prisma.rider.findMany({
        include: {
            orders: {
                orderBy: { createdAt: 'desc' }
            },
            // @ts-ignore
            partner: true // Fetch the assigned partner details
        },
        orderBy: { createdAt: 'desc' }
    });

    let partners: any[] = [];

    if (currentUser.role === 'PARTNER') {
        // @ts-ignore
        riders = riders.filter(r => r.partnerId === currentUser.id);
        partners = [currentUser];
    } else if (currentUser.role === 'ZONAL_HEAD') {
        partners = await prisma.user.findMany({
            // @ts-ignore
            where: { role: 'PARTNER', cityId: currentUser.cityId }
        });
        const partnerIds = partners.map(p => p.id);
        // @ts-ignore
        riders = riders.filter(r => r.partnerId && partnerIds.includes(r.partnerId));
    } else {
        partners = await prisma.user.findMany({
            where: { role: 'PARTNER' }
        });
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Field Executives</h1>
            <p className="text-muted-foreground">Add logistics partners and field executives.</p>
            <RiderManager initialRiders={riders} partners={partners} currentUserRole={currentUser.role} currentUserId={currentUser.id} />
        </div>
    );
}
