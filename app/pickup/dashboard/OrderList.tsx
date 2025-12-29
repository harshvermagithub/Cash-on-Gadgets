
'use client';

import { useState } from 'react';
import { updateOrderStatus, logoutExecutive } from '@/actions/executive';
import { MapPin, Phone, Calendar, CheckCircle2, Navigation, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderList({ orders, executiveName }: { orders: any[], executiveName: string }) {
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!confirm(`Mark order as ${newStatus}?`)) return;
        setUpdatingId(id);
        try {
            await updateOrderStatus(id, newStatus);
            router.refresh();
        } catch (e) {
            alert('Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Pickups</h1>
                    <p className="text-muted-foreground">Welcome, {executiveName}</p>
                </div>
                <button
                    onClick={() => logoutExecutive()}
                    className="p-2 hover:bg-muted rounded-full"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-card rounded-2xl border">
                    <p className="text-muted-foreground">No assigned orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold">{order.device}</h3>
                                    <p className="text-green-600 font-bold font-mono text-xl">₹{order.price.toLocaleString()}</p>
                                </div>
                                {order.location && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${order.location.lat},${order.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                    >
                                        <Navigation className="w-6 h-6" />
                                    </a>
                                )}
                            </div>

                            <div className="p-4 bg-muted/30 rounded-xl space-y-4 text-sm">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-foreground">Pickup Location</h4>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                        <p>{order.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <a href="#" className="hover:underline">Contact Customer</a>
                                    </div>
                                </div>

                                {order.status === 'assigned' && (
                                    <div className="pt-4 border-t space-y-3">
                                        <h4 className="font-semibold text-foreground">Quality Check & Pickup</h4>
                                        <p className="text-muted-foreground text-xs">
                                            Verify device condition matches the app details.
                                        </p>
                                        <div className="bg-white dark:bg-card border p-3 rounded-lg flex justify-between items-center">
                                            <span>System Offered Price</span>
                                            <span className="font-bold text-green-600">₹{order.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Confirm you have verified device and user accepted ₹${order.price}?`)) {
                                                    handleStatusUpdate(order.id, 'picked_up');
                                                }
                                            }}
                                            disabled={!!updatingId}
                                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Verify & Pay User
                                        </button>
                                    </div>
                                )}

                                {order.status === 'picked_up' && (
                                    <div className="pt-4 border-t space-y-3">
                                        <div className="bg-purple-100 text-purple-700 p-3 rounded-lg text-sm text-center font-medium">
                                            Device verified & payment done. <br /> Please deliver to hub.
                                        </div>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            disabled={!!updatingId}
                                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Delivered to Hub (Complete)
                                        </button>
                                    </div>
                                )}

                                {order.status === 'completed' && (
                                    <div className="text-center text-green-600 font-medium py-2 bg-green-50 rounded-lg">
                                        Order Completed Successfully
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
