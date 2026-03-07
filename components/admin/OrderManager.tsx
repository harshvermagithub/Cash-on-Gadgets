
'use client';

import { useState } from 'react';
import { assignRider } from '@/actions/admin';
import { Rider, Order } from '@/lib/store'; // Need to export Order from store/lib
import { Calendar, MapPin, Smartphone, User, CheckCircle2, Eye, X, Download, Phone, Mail, AlertTriangle } from 'lucide-react';
import OrderDetails from '@/components/OrderDetails';
import { useRouter } from 'next/navigation';

import OrderStepper from '@/components/orders/OrderStepper';

export default function OrderManager({ initialOrders, riders }: { initialOrders: Order[], riders: Rider[] }) {
    const router = useRouter();
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState<'to_be_assigned' | 'pending_approval' | 'pending_pickup' | 'completed'>('to_be_assigned');

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

    const toBeAssignedOrders = sortedOrders.filter(o => !o.riderId && o.status !== 'completed');
    const pendingApprovalOrders = sortedOrders.filter(o => o.status === 'pending_verification');
    const pendingPickupOrders = sortedOrders.filter(o => o.riderId && o.status !== 'completed' && o.status !== 'pending_verification');
    const completedOrders = sortedOrders.filter(o => o.status === 'completed');

    const displayedOrders = activeTab === 'to_be_assigned'
        ? toBeAssignedOrders
        : activeTab === 'pending_approval'
            ? pendingApprovalOrders
            : activeTab === 'pending_pickup'
                ? pendingPickupOrders
                : completedOrders;

    const handleExport = () => {
        const headers = ["Order #", "Date", "Device", "Price", "Status", "Contact", "Address", "Rider Assigned"];
        const rows = displayedOrders.map(o => {
            const answers = (typeof o.answers === 'string') ? JSON.parse(o.answers) : (o.answers || {});
            const phone = answers.phone || "N/A";
            const isExpress = answers.isExpress ? "Express" : "Standard";
            const riderAssign = riders.find(r => r.id === o.riderId)?.name || "Unassigned";
            return [
                `FZK-${o.orderNumber || ''}`,
                new Date(o.date).toLocaleDateString(),
                `"${o.device.replace(/"/g, '""')}"`,
                o.price,
                o.status,
                phone,
                `"${o.address.replace(/"/g, '""')}"`,
                riderAssign
            ].join(",");
        });

        const csvString = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Fonzkart_Orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex flex-wrap bg-muted/50 p-1 rounded-lg border border-border/50 gap-1">
                    <button
                        onClick={() => setActiveTab('to_be_assigned')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'to_be_assigned' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        To Be Assigned <span className="ml-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{toBeAssignedOrders.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('pending_approval')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending_approval' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Pending Approval <span className="ml-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">{pendingApprovalOrders.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('pending_pickup')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending_pickup' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        In Transit <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">{pendingPickupOrders.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Completed <span className="ml-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{completedOrders.length}</span>
                    </button>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>
            {displayedOrders.length === 0 ? (
                <div className="text-center py-10 border rounded-xl bg-card text-muted-foreground">
                    No orders found in this category.
                </div>
            ) : (
                <div className="grid gap-4">
                    {displayedOrders.map((order) => {
                        const assignedRider = riders.find(r => r.id === order.riderId);
                        const answers = (typeof order.answers === 'string')
                            ? JSON.parse(order.answers)
                            : (order.answers as Record<string, any> || {});
                        const phone = answers.phone;

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
                                        <span suppressHydrationWarning className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold flex flex-col items-start gap-1">
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest block"># FZK-{order.orderNumber}</span>
                                        <span className="flex items-center gap-2">
                                            <Smartphone className="w-5 h-5 text-gray-500" />
                                            {order.device}
                                        </span>
                                    </h3>

                                    {/* Pickup Schedule Badge */}
                                    {(() => {
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
                                                    <span suppressHydrationWarning className="flex items-center gap-1 font-medium text-foreground">
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
                                    <div className="flex flex-col gap-2 mt-4">
                                        <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-2">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Customer Details</div>
                                            {order.user && (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-semibold">{order.user.name || "N/A"}</span>
                                                    </div>
                                                    {order.user.email && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Mail className="w-4 h-4 text-primary" />
                                                            <span>{order.user.email}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {phone && (
                                                <div className="flex items-center gap-2 text-sm text-foreground">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                    <span className="font-bold tracking-wide">+91 {phone}</span>
                                                </div>
                                            )}
                                            {(!order.user && !phone) && (
                                                <div className="text-sm text-muted-foreground italic">No details available</div>
                                            )}
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{order.address || "Location captured via GPS"}</span>
                                        </div>
                                        {order.pincode && (
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50 mt-2">
                                                <span className="font-bold">Pincode:</span>
                                                <span>{order.pincode}</span>
                                            </div>
                                        )}
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
                                        <label className="text-sm font-medium mb-1 block">Assign Field Executive</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 p-2 border rounded-lg bg-background text-sm"
                                                value={order.riderId || ""}
                                                onChange={(e) => handleAssign(order.id, e.target.value)}
                                                disabled={assigningId === order.id}
                                            >
                                                <option value="">Select Field Executive...</option>
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

                                    {order.status === 'pending_verification' && (
                                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mt-4 w-full text-sm">
                                            <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-4 h-4" /> Zonal Head Approval Required
                                            </h4>

                                            <div className="space-y-3 mt-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rider Notes</p>
                                                    <p className="font-medium text-amber-900 mt-1">
                                                        {order.riderAnswers ? JSON.parse(order.riderAnswers as string).notes || "No notes provided" : "None"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Device Photos</p>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {(order.verificationImages || []).map((img, i) => (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <a href={img} target="_blank" rel="noopener noreferrer" key={i}>
                                                                <img src={img} alt="Device Photo" className="w-16 h-16 object-cover rounded-lg border shadow-sm hover:scale-105 transition-transform" />
                                                            </a>
                                                        ))}
                                                        {(!order.verificationImages || order.verificationImages.length === 0) && (
                                                            <p className="text-xs italic text-muted-foreground">No photos uploaded.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-amber-200 text-sm">
                                                    <span className="font-medium text-muted-foreground">Original Offer: <span className="line-through">₹{order.price.toLocaleString()}</span></span>
                                                    <span className="font-bold text-amber-900">New Offer: ₹{order.offeredPrice?.toLocaleString() ?? "N/A"}</span>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("Reject verification and ask rider to inspect again?")) {
                                                                // Actually just send back to 'assigned'
                                                                await fetch('/api/admin/orders/' + order.id, { method: 'POST', body: JSON.stringify({ action: 'reject_verification' }) });
                                                                window.location.reload();
                                                            }
                                                        }}
                                                        className="px-4 py-2 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg font-semibold w-1/3"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const priceInput = window.prompt("Adjust the final approved price if needed:", order.offeredPrice?.toString() || order.price.toString());
                                                            if (priceInput === null) return; // cancelled
                                                            const overridePrice = parseInt(priceInput, 10);
                                                            if (isNaN(overridePrice) || overridePrice < 0) {
                                                                alert("Invalid price entered.");
                                                                return;
                                                            }
                                                            if (confirm(`Approve with final price of ₹${overridePrice}?`)) {
                                                                await fetch('/api/admin/orders/' + order.id, { method: 'POST', body: JSON.stringify({ action: 'approve_verification', overridePrice }) });
                                                                window.location.reload();
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white shadow-sm rounded-lg font-bold w-2/3"
                                                    >
                                                        Approve ₹{order.offeredPrice?.toLocaleString()}
                                                    </button>
                                                </div>
                                            </div>
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
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-20">
                            <h3 className="font-bold text-lg">Evaluation Details (FZK-{viewingOrder.orderNumber})</h3>
                            <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="sticky top-[64px] bg-background border-b z-10 w-full px-6 pt-2 pb-1">
                            <OrderStepper status={viewingOrder.status} />
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
