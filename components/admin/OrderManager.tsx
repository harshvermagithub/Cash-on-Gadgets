
'use client';

import { useState } from 'react';
import { assignRider } from '@/actions/admin';
import { Rider, Order } from '@/lib/store'; // Need to export Order from store/lib
import { Calendar, MapPin, Smartphone, User, CheckCircle2, Eye, X } from 'lucide-react';
import OrderDetails from '@/components/OrderDetails';
import { useRouter } from 'next/navigation';

// Quick fix if Order isn't exported from store (it wasn't in my previous view)
// I better assume I need to define it here or update store to export it. 
// I updated store earlier but might have missed "export" keyword on Order interface?
// Let's redefine locally just in case to be safe, or check store file again.
// Looking at previous turn, "interface Order" was NOT exported. "export interface Brand" was.
// So I should redefine it here matching the store structure.



export default function OrderManager({ initialOrders, riders }: { initialOrders: Order[], riders: Rider[] }) {
    const router = useRouter();
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const handleAssign = async (orderId: string, riderId: string) => {
        if (!riderId) return;
        setAssigningId(orderId);
        try {
            await assignRider(orderId, riderId);
            router.refresh();
        } catch {
            alert('Failed to assign rider');
        } finally {
            setAssigningId(null);
        }
    };

    // Sort by date desc
    const sortedOrders = [...initialOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4">
            {sortedOrders.length === 0 ? (
                <div className="text-center py-10 border rounded-xl bg-card text-muted-foreground">
                    No orders found.
                </div>
            ) : (
                <div className="grid gap-4">
                    {sortedOrders.map((order) => {
                        const assignedRider = riders.find(r => r.id === order.riderId);

                        return (
                            <div key={order.id} className="bg-card border rounded-xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                        {order.device}
                                    </h3>

                                    {/* Pickup Schedule Badge */}
                                    {(() => {
                                        const answers = (typeof order.answers === 'string')
                                            ? JSON.parse(order.answers)
                                            : (order.answers as Record<string, any> || {});

                                        const isExpress = !!answers.isExpress;
                                        const scheduledDate = answers.scheduledDate ? new Date(answers.scheduledDate) : null;
                                        const scheduledSlot = answers.scheduledSlot;

                                        if (isExpress) {
                                            return (
                                                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 w-fit">
                                                    ⚡ Express Pickup (3H)
                                                </div>
                                            );
                                        }

                                        if (scheduledDate && scheduledSlot) {
                                            return (
                                                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3 bg-muted/50 w-fit px-2 py-1 rounded">
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                        {scheduledSlot}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                    <div className="text-lg font-mono font-bold text-green-600">
                                        ₹{order.price.toLocaleString()}
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                                        <MapPin className="w-4 h-4 mt-0.5" />
                                        <span>{order.address || "Location captured via GPS"}</span>
                                    </div>

                                    <button
                                        onClick={() => setViewingOrder(order)}
                                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <Eye className="w-4 h-4" /> View Evaluation Details
                                    </button>
                                </div>

                                <div className="w-full lg:w-auto min-w-[300px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Assign Pickup Executive</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 p-2 border rounded-lg bg-background text-sm"
                                                value={order.riderId || ""}
                                                onChange={(e) => handleAssign(order.id, e.target.value)}
                                                disabled={assigningId === order.id}
                                            >
                                                <option value="">Select Executive...</option>
                                                {riders.map(r => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.name} ({r.status})
                                                    </option>
                                                ))}
                                            </select>
                                            {assigningId === order.id && (
                                                <div className="flex items-center justify-center p-2">
                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {assignedRider && (
                                        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center gap-3">
                                            <div className="bg-white p-1 rounded-full">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{assignedRider.name}</p>
                                                <p className="text-xs">{assignedRider.phone}</p>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 ml-auto opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {viewingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
                            <h3 className="font-bold text-lg">Evaluation Details</h3>
                            <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <OrderDetails order={viewingOrder} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
