
'use client';

import { useState } from 'react';
import { updateOrderStatus, logoutExecutive } from '@/actions/executive';
import { MapPin, Phone, Calendar, CheckCircle2, Navigation, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderList({ orders, executiveName }: { orders: any[], executiveName: string }) {
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [verifiedOrders, setVerifiedOrders] = useState<Set<string>>(new Set());

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
                                    <div className="pt-4 border-t space-y-4">
                                        <h4 className="font-semibold text-foreground">1. Review Reported Condition</h4>
                                        <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
                                            {order.answers ? (
                                                <>
                                                    <p><span className="font-medium">Accesories:</span> {order.answers.accessories?.join(', ') || 'None'}</p>
                                                    <p><span className="font-medium">Screen Defects:</span> {order.answers.screen_defects?.length > 0 ? order.answers.screen_defects.join(', ') : 'None'}</p>
                                                    <p><span className="font-medium">Functional Issues:</span> {order.answers.functional_problems?.length > 0 ? order.answers.functional_problems.join(', ') : 'None'}</p>
                                                    <p><span className="font-medium">Calls Working:</span> {order.answers.calls === false ? 'No' : 'Yes'}</p>
                                                    <p><span className="font-medium">Touch Working:</span> {order.answers.touch === false ? 'No' : 'Yes'}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted-foreground italic">No details available.</p>
                                            )}
                                        </div>

                                        <h4 className="font-semibold text-foreground">2. Physical Verification</h4>
                                        <VerificationChecklist
                                            isVerified={verifiedOrders.has(order.id)}
                                            onToggle={() => {
                                                const next = new Set(verifiedOrders);
                                                if (next.has(order.id)) next.delete(order.id);
                                                else next.add(order.id);
                                                setVerifiedOrders(next);
                                            }}
                                        />

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
                                            disabled={!!updatingId || !verifiedOrders.has(order.id)}
                                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

function VerificationChecklist({ isVerified, onToggle }: { isVerified: boolean; onToggle: () => void }) {
    const [checkedItems, setCheckedItems] = useState({
        physical: false,
        touch: false,
        camera: false,
        connectivity: false,
        battery: false
    });

    const allChecked = Object.values(checkedItems).every(Boolean);

    // This effect ensures the parent knows if all are checked
    // Wait, onToggle is simple toggle. Let's make it smarter.
    // Actually, simpler logic: Button in checklist "Confirm Verification" only enabled if all checked.
    // Once confirmed, parent state becomes true.

    const handleCheck = (key: keyof typeof checkedItems) => {
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isVerified) {
        return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verification Completed</span>
                <button onClick={onToggle} className="ml-auto text-xs underline">Undo</button>
            </div>
        );
    }

    return (
        <div className="space-y-2 bg-white dark:bg-card border p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="chk-physical" checked={checkedItems.physical} onChange={() => handleCheck('physical')} className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="chk-physical">Physical Condition (Scratches/Dents)</label>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="chk-touch" checked={checkedItems.touch} onChange={() => handleCheck('touch')} className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="chk-touch">Touch & Display Response</label>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="chk-camera" checked={checkedItems.camera} onChange={() => handleCheck('camera')} className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="chk-camera">Camera (Front & Back)</label>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="chk-connectivity" checked={checkedItems.connectivity} onChange={() => handleCheck('connectivity')} className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="chk-connectivity">WiFi & Bluetooth Connectivity</label>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="chk-battery" checked={checkedItems.battery} onChange={() => handleCheck('battery')} className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="chk-battery">Battery & Charging Port</label>
            </div>

            <button
                onClick={onToggle}
                disabled={!allChecked}
                className="w-full mt-2 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg disabled:opacity-50"
            >
                Confirm Verification
            </button>
        </div>
    );
}
