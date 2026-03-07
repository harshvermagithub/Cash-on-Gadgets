import { db } from "@/lib/store";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import OrderManager from "@/components/admin/OrderManager";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { city: true }
    });

    if (!currentUser) redirect('/login');

    let orders = await db.getAllOrders();
    const riders = await db.getRiders();

    if (currentUser.role === 'PARTNER') {
        const allowedPincodes = currentUser.pincodes || [];
        orders = orders.filter(o => o.pincode && allowedPincodes.includes(o.pincode));
    } else if (currentUser.role === 'ZONAL_HEAD') {
        if (currentUser.cityId) {
            // Find all Pincodes managed by Partners in this Zonal Head's city
            const cityPartners = await prisma.user.findMany({
                where: { role: 'PARTNER', cityId: currentUser.cityId }
            });
            const allowedPincodes = cityPartners.flatMap(p => p.pincodes);
            orders = orders.filter(o => o.pincode && allowedPincodes.includes(o.pincode));
        } else {
            // If they are not assigned to a city, they see no orders
            orders = [];
        }
    }
    // SUPER_ADMIN and ADMIN see all orders

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            {currentUser.role === 'ZONAL_HEAD' && <p className="text-muted-foreground text-sm font-medium text-primary">Territory Overview: {currentUser.city?.name || 'Unassigned'}</p>}
            {currentUser.role === 'PARTNER' && <p className="text-muted-foreground text-sm font-medium text-emerald-600">Assigned Pincodes: {currentUser.pincodes?.join(', ') || 'None'}</p>}
            <p className="text-muted-foreground">View incoming sell requests and assign field executives for pickup.</p>
            <OrderManager initialOrders={orders} riders={riders} />
        </div>
    );
}
