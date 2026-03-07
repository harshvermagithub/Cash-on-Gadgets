'use client';

import { useState } from 'react';
import { updateOrderStatus, submitVerification, logoutExecutive } from '@/actions/executive';
import { MapPin, Phone, Calendar, CheckCircle2, Navigation, LogOut, Zap, Eye, X, Camera, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/store';
import OrderDetails from '@/components/OrderDetails';
import VerificationModal from '@/components/admin/VerificationModal';

interface OrderAnswers {
    accessories?: string[];
    screen_defects?: string[];
    functional_problems?: string[];
    calls?: boolean;
    touch?: boolean;
    isExpress?: boolean;
    scheduledDate?: string;
    scheduledSlot?: string;
}

export default function OrderList({ orders, executiveName }: { orders: Order[], executiveName: string }) {
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!confirm(`Mark order as ${newStatus}?`)) return;
        setUpdatingId(id);
        try {
            await updateOrderStatus(id, newStatus);
            router.refresh();
        } catch {
            alert('Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleVerificationSubmit = async (data: any) => {
        if (!verifyingOrder) return;
        setUpdatingId(verifyingOrder.id);
        try {
            await submitVerification(verifyingOrder.id, {
                riderAnswers: { notes: data.notes },
                verificationImages: data.images,
                offeredPrice: data.finalOffer
            });
            alert('Verification submitted for admin approval.');
            setVerifyingOrder(null);
            router.refresh();
        } catch {
            alert('Failed to submit verification');
        } finally {
            setUpdatingId(null);
        }
    };

    const pendingOrders = orders.filter(o => o.status !== 'completed');
    const completedOrders = orders.filter(o => o.status === 'completed');
    const displayedOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Pickups</h1>
                    <p className="text-muted-foreground">Welcome, {executiveName}</p>
                </div>
                <button
                    onClick={() => logoutExecutive()}
                    className="self-end sm:self-auto p-2 hover:bg-muted rounded-full bg-muted/50 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            <div className="flex bg-muted/50 p-1 rounded-xl w-full sm:w-fit">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Pending <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{pendingOrders.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Completed <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{completedOrders.length}</span>
                </button>
            </div>

            {displayedOrders.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border">
                    <p className="text-muted-foreground">No orders in this tab.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedOrders.map((order) => (
                        <div key={order.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'assigned' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                order.status === 'pending_verification' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                    order.status === 'picked_up' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                                        order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {order.status === 'pending_verification' ? 'Awaiting Approval' : order.status}
                                        </span>
                                        {!!order.answers && (order.answers as OrderAnswers).isExpress && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                                                <Zap className="w-3 h-3 fill-current" /> Express
                                            </span>
                                        )}
                                        <span suppressHydrationWarning className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold">{order.device}</h3>
                                    <p className="text-green-600 dark:text-green-400 font-bold font-mono text-xl">
                                        ₹{order.status === 'pending_verification' && order.offeredPrice ? order.offeredPrice.toLocaleString() : order.price.toLocaleString()}
                                    </p>
                                </div>
                                {order.location && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${order.location.lat},${order.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    >
                                        <Navigation className="w-6 h-6" />
                                    </a>
                                )}
                            </div>

                            <div className="p-4 bg-muted/30 rounded-xl space-y-4 text-sm border">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-foreground uppercase tracking-wide text-xs text-muted-foreground">Pickup Location</h4>
                                    <div className="flex items-start gap-2 bg-background p-3 rounded-lg border">
                                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <p>{order.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <a href="#" className="w-full flex items-center justify-center gap-2 py-2.5 bg-background border rounded-lg hover:bg-accent font-medium transition-colors">
                                            <Phone className="w-4 h-4" /> Contact Customer
                                        </a>
                                    </div>
                                </div>

                                {order.status === 'assigned' && (
                                    <div className="pt-4 space-y-4">
                                        <div className="bg-background border p-4 rounded-xl">
                                            <h4 className="font-semibold text-foreground flex items-center justify-between mb-4">
                                                <span>1. Review Customer Order</span>
                                                <button onClick={() => setViewingOrder(order)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                    <Eye className="w-3 h-3" /> Full Details
                                                </button>
                                            </h4>

                                            <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-2 border">
                                                {order.answers ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="col-span-2 sm:col-span-1">
                                                            <span className="text-muted-foreground block mb-0.5">Physical Condition</span>
                                                            <span className="font-bold capitalize">{((order.answers as any).physical_condition || 'N/A').replace(/_/g, ' ')}</span>
                                                        </div>
                                                        <div className="col-span-2 sm:col-span-1">
                                                            <span className="text-muted-foreground block mb-0.5">Body Condition</span>
                                                            <span className="font-bold capitalize">{((order.answers as any).body_condition || 'N/A').replace(/_/g, ' ')}</span>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-muted-foreground block mb-0.5">Reported Issues</span>
                                                            <span className="font-bold capitalize text-red-500">
                                                                {((order.answers as any).functional_issues && (order.answers as any).functional_issues.length > 0)
                                                                    ? (order.answers as any).functional_issues.join(', ').replace(/_/g, ' ')
                                                                    : 'None reported'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground italic">No details available.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-background border p-4 rounded-xl space-y-4">
                                            <h4 className="font-semibold text-foreground">2. Physical Verification</h4>
                                            <p className="text-xs text-muted-foreground">Verify the actual condition matches the customer's report. Take photos and recalculate price if defects are found.</p>

                                            <button
                                                onClick={() => setVerifyingOrder(order)}
                                                disabled={!!updatingId}
                                                className="w-full py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Camera className="w-5 h-5" />
                                                Start Verification
                                            </button>
                                            <div className="text-center">
                                                <span className="text-xs text-muted-foreground mx-2 uppercase tracking-widest font-bold">OR</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Confirm you have verified device perfectly matches the report and user accepted ₹${order.price}?`)) {
                                                        handleStatusUpdate(order.id, 'picked_up');
                                                    }
                                                }}
                                                disabled={!!updatingId}
                                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                Condition Matches Perfectly
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'pending_verification' && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-center space-y-2">
                                        <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
                                        <h4 className="font-bold text-amber-700 dark:text-amber-400">Awaiting Admin Approval</h4>
                                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                                            You've submitted new photos and a revised price of ₹{order.offeredPrice}. Please ask the customer to wait while the Zonal Head approves it.
                                        </p>
                                    </div>
                                )}

                                {order.status === 'picked_up' && (
                                    <div className="pt-2 space-y-3">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-3 rounded-lg text-sm text-center font-bold">
                                            Device Verified & Payment Accepted! <br /> <span className="font-medium">Please proceed to deliver to the Hub.</span>
                                        </div>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            disabled={!!updatingId}
                                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Mark Delivered to Hub
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
                            <h3 className="font-bold text-lg">Evaluation Report</h3>
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

            {verifyingOrder && (
                <VerificationModal
                    order={verifyingOrder}
                    onClose={() => setVerifyingOrder(null)}
                    onSubmit={handleVerificationSubmit}
                />
            )}
        </div>
    );
}
