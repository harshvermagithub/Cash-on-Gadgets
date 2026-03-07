
import { prisma } from '@/lib/db';
import RiderManager from "@/components/admin/RiderManager";

export const dynamic = 'force-dynamic';

export default async function RidersPage() {
    const riders = await prisma.rider.findMany({
        include: {
            orders: {
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Field Executives</h1>
            <p className="text-muted-foreground">Add logistics partners and field executives.</p>
            <RiderManager initialRiders={riders} />
        </div>
    );
}
