
'use client';

import { useState } from 'react';
import { addRider, deleteRider, updateRiderPartner } from '@/actions/admin';
import { Trash2, Plus, Loader2, User, Phone, ChevronDown, ChevronUp, Package, AlertTriangle, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RiderManager({ initialRiders, partners = [], currentUserRole, currentUserId }: { initialRiders: any[], partners?: any[], currentUserRole?: string, currentUserId?: string }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [partnerId, setPartnerId] = useState(currentUserRole === 'PARTNER' ? currentUserId : '');
    const [filterPartner, setFilterPartner] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [expandedRider, setExpandedRider] = useState<string | null>(null);

    const filteredRiders = initialRiders.filter(r => {
        if (filterPartner === 'all') return true;
        if (filterPartner === 'unassigned') return !r.partnerId;
        return r.partnerId === filterPartner;
    });

    const toggleExpand = (id: string) => {
        setExpandedRider(expandedRider === id ? null : id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        setIsLoading(true);
        try {
            await addRider(name, phone, partnerId || undefined);
            setName('');
            setPhone('');
            if (currentUserRole !== 'PARTNER') {
                setPartnerId('');
            }
            router.refresh();
        } catch {
            alert('Failed to add rider');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteRider(id);
            router.refresh();
        } catch {
            alert('Failed to delete rider');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Add New Field Executive</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium">Field Executive Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="+91 9876543210"
                        />
                    </div>
                    {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-sm font-medium">Assign to Partner</label>
                            <select
                                value={partnerId || ''}
                                onChange={(e) => setPartnerId(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-background"
                            >
                                <option value="">None (Unassigned)</option>
                                {partners.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        disabled={isLoading || !name || !phone}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 h-[42px] min-w-[100px] flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add</div>}
                    </button>
                </form>
            </div>

            {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between md:items-center bg-card border rounded-xl p-6 gap-4">
                    <div>
                        <h3 className="text-sm font-bold">Filter By Partner</h3>
                        <p className="text-xs text-muted-foreground">View field executives assigned to specific partners.</p>
                    </div>
                    <select
                        value={filterPartner}
                        onChange={(e) => setFilterPartner(e.target.value)}
                        className="p-2 border rounded-lg bg-background w-full md:w-64 text-sm"
                    >
                        <option value="all">All Field Executives</option>
                        <option value="unassigned">Unassigned List</option>
                        {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRiders.map((rider) => (
                    <div key={rider.id} className="border rounded-xl bg-card overflow-hidden">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleExpand(rider.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold flex items-center gap-2">
                                        {rider.name}
                                        {rider.orders && rider.orders.length > 0 && (
                                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                                                {rider.orders.length} Orders
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="w-3 h-3" />
                                        {rider.phone}
                                    </div>
                                    {rider.partner && (
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                            Partner: <span className="font-semibold">{rider.partner.name}</span>
                                        </div>
                                    )}
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${rider.status === 'available' ? 'bg-green-100 text-green-700' :
                                        rider.status === 'busy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {rider.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(rider.id);
                                    }}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(rider.id);
                                    }}
                                    className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-xs font-bold flex items-center"
                                >
                                    {expandedRider === rider.id ? 'Collapse' : 'Expand'}
                                    {expandedRider === rider.id ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                                </button>
                            </div>
                        </div>

                        {/* Expandable Orders Section */}
                        {expandedRider === rider.id && (
                            <div className="bg-muted/30 border-t p-4 space-y-3">
                                {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                                    <div className="mb-4 bg-background border p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold">Assigned Partner:</span>
                                        </div>
                                        <select
                                            value={rider.partnerId || ''}
                                            onChange={async (e) => {
                                                const newPartnerId = e.target.value || null;
                                                // Handle API call directly using imported server action
                                                if (confirm(`Are you sure you want to reassign this executive?`)) {
                                                    try {
                                                        await updateRiderPartner(rider.id, newPartnerId);
                                                        router.refresh();
                                                    } catch (error) {
                                                        alert("Failed to assign partner. They might have been removed from the system.");
                                                    }
                                                }
                                            }}
                                            className="p-1.5 text-sm border rounded-md bg-background w-full sm:w-auto min-w-[150px]"
                                        >
                                            <option value="">None (Unassigned)</option>
                                            {partners.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assigned Orders</h4>
                                {rider.orders && rider.orders.length > 0 ? (
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                        {rider.orders.map((order: any) => (
                                            <div key={order.id} className="bg-background border rounded-lg p-3 text-sm flex gap-3">
                                                <div className="mt-0.5 mt-1 shrink-0 text-primary">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium line-clamp-1">{order.device}</p>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 truncate">{order.address}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="font-semibold text-primary">₹{order.price.toLocaleString('en-IN')}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'pending_verification' ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-secondary-foreground'}`}>
                                                            {order.status === 'pending_verification' ? 'Awaiting Approval' : order.status}
                                                        </span>
                                                    </div>

                                                    {order.status === 'pending_verification' && (
                                                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-3 w-full text-sm">
                                                            <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                                                <AlertTriangle className="w-4 h-4" /> Action Required
                                                            </h4>

                                                            <div className="space-y-3 mt-2">
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Rider Notes</p>
                                                                    <p className="font-medium text-amber-900 mt-0.5 text-xs">
                                                                        {order.riderAnswers ? JSON.parse(order.riderAnswers as string).notes || "No notes provided" : "None"}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Device Photos</p>
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        {(order.verificationImages || []).map((img: string, i: number) => (
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            <a href={img} target="_blank" rel="noopener noreferrer" key={i}>
                                                                                <img src={img} alt="Device Photo" className="w-12 h-12 object-cover rounded-md border shadow-sm hover:scale-105 transition-transform" />
                                                                            </a>
                                                                        ))}
                                                                        {(!order.verificationImages || order.verificationImages.length === 0) && (
                                                                            <p className="text-xs italic text-muted-foreground">No photos uploaded.</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-amber-200 text-xs">
                                                                    <span className="font-medium text-muted-foreground">Old: <span className="line-through">₹{order.price.toLocaleString()}</span></span>
                                                                    <span className="font-bold text-amber-900 text-sm">New: ₹{order.offeredPrice?.toLocaleString() ?? "N/A"}</span>
                                                                </div>

                                                                <div className="flex gap-2 pt-1">
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            if (confirm("Reject verification and ask rider to inspect again?")) {
                                                                                await fetch('/api/admin/orders/' + order.id, { method: 'POST', body: JSON.stringify({ action: 'reject_verification' }) });
                                                                                window.location.reload();
                                                                            }
                                                                        }}
                                                                        className="px-3 py-1.5 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-md font-semibold w-1/3 text-xs"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
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
                                                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm rounded-md font-bold w-2/3 text-xs"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic text-center py-4 bg-background border rounded-lg border-dashed">
                                        No active orders assigned
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
