
import { db } from "@/lib/store";
import OrderManager from "@/components/admin/OrderManager";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const orders = db.getAllOrders();
    const riders = db.getRiders();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <p className="text-muted-foreground">View incoming sell requests and assign riders for pickup.</p>
            <OrderManager initialOrders={orders} riders={riders} />
        </div>
    );
}
