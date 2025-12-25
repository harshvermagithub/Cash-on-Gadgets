
import { getUserOrders } from '@/actions/orders';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Smartphone, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const orders = await getUserOrders();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-accent/20 rounded-2xl">
                    <Smartphone className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg font-medium">No orders yet</p>
                    <p className="text-muted-foreground mb-6">Start selling your old phones for cash!</p>
                    <Link href="/sell" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors">
                        Sell Now
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{order.device}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.date).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Offered Price</p>
                                    <p className="text-xl font-bold text-primary">₹{order.price.toLocaleString()}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'Pending Pickup' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
