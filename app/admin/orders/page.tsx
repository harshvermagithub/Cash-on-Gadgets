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
    let riders = await prisma.rider.findMany({
        include: {
            partner: {
                select: { pincodes: true }
            }
        }
    });

    if (currentUser.role === 'PARTNER') {
        const allowedPincodes = currentUser.pincodes || [];
        orders = orders.filter(o => o.pincode && allowedPincodes.includes(o.pincode));
        riders = riders.filter(r => r.partnerId === currentUser.id);
    } else if (currentUser.role === 'ZONAL_HEAD') {
        if (currentUser.cityId && currentUser.city) {
            const cityName = currentUser.city.name.toLowerCase();
            // Find all Pincodes managed by Partners in this Zonal Head's city
            const cityPartners = await prisma.user.findMany({
                where: { role: 'PARTNER', cityId: currentUser.cityId }
            });
            const allowedPincodes = cityPartners.flatMap(p => p.pincodes);
            const partnerIds = cityPartners.map(p => p.id);

            orders = orders.filter(o =>
                (o.pincode && allowedPincodes.includes(o.pincode)) ||
                (o.address && o.address.toLowerCase().includes(cityName))
            );
            riders = riders.filter(r => r.partnerId && partnerIds.includes(r.partnerId));
        } else {
            // If they are not assigned to a city, they see no orders
            orders = [];
            riders = [];
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
