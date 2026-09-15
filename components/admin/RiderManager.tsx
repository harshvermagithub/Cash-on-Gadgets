
'use client';

import { useState, useEffect } from 'react';
import { addRider, deleteRider, updateRiderPartner, addFieldExecutive } from '@/actions/admin';
import { Trash2, Plus, Loader2, User, Phone, ChevronDown, ChevronUp, Package, AlertTriangle, Building2, ExternalLink, Mail, Table, LayoutGrid, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RiderManager({ initialRiders, partners = [], currentUserRole, currentUserId }: { initialRiders: any[], partners?: any[], currentUserRole?: string, currentUserId?: string }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [partnerId, setPartnerId] = useState(currentUserRole === 'PARTNER' ? currentUserId : '');
    const [filterPartner, setFilterPartner] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [grantEmail, setGrantEmail] = useState('');
    const [isGranting, setIsGranting] = useState(false);
    const [expandedRider, setExpandedRider] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [orderFilterTab, setOrderFilterTab] = useState<Record<string, 'all' | 'pending' | 'handed_over'>>({});

    const [riders, setRiders] = useState(initialRiders);
    useEffect(() => {
        setRiders(initialRiders);
    }, [initialRiders]);

    const getRiderMetrics = (rider: any) => {
        const orders = rider.orders || [];
        const inProgress = orders.filter((o: any) => o.status !== 'completed' && o.status !== 'failed');
        
        const handoverPending = orders.filter((o: any) => {
            if (o.status !== 'completed' && o.status !== 'picked_up') return false;
            let ans: any = {};
            if (o.answers && typeof o.answers === 'string') {
                try { ans = JSON.parse(o.answers); } catch { }
            } else if (typeof o.answers === 'object') {
                ans = o.answers || {};
            }
            return ans.hubStatus !== 'handed_over';
        });

        const handedOver = orders.filter((o: any) => {
            let ans: any = {};
            if (o.answers && typeof o.answers === 'string') {
                try { ans = JSON.parse(o.answers); } catch { }
            } else if (typeof o.answers === 'object') {
                ans = o.answers || {};
            }
            return ans.hubStatus === 'handed_over';
        });

        return {
            total: orders.length,
            inProgress: inProgress.length,
            handoverPending,
            handedOver
        };
    };

    const handleConfirmHubHandover = async (orderId: string, riderId: string) => {
        if (!confirm("Confirm that this device has been received at the central hub?")) return;
        try {
            const res = await fetch('/api/admin/orders/' + orderId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_hub_status', hubStatus: 'handed_over' })
            });
            if (res.ok) {
                // Optimistically update riders state
                setRiders(prev => prev.map((r: any) => {
                    if (r.id !== riderId) return r;
                    const updatedOrders = (r.orders || []).map((o: any) => {
                        if (o.id !== orderId) return o;
                        let ans: any = {};
                        if (o.answers && typeof o.answers === 'string') {
                            try { ans = JSON.parse(o.answers); } catch { }
                        } else if (typeof o.answers === 'object') {
                            ans = o.answers || {};
                        }
                        ans.hubStatus = 'handed_over';
                        ans.hubHandoverAt = new Date().toISOString();
                        return { ...o, answers: JSON.stringify(ans) };
                    });
                    return { ...r, orders: updatedOrders };
                }));
                router.refresh();
            } else {
                alert("Failed to update hub status");
            }
        } catch {
            alert("Error updating hub status");
        }
    };

    const filteredRiders = riders.filter((r: any) => {
        if (filterPartner === 'all') return true;
        if (filterPartner === 'unassigned') return !r.partnerId;
        return r.partnerId === filterPartner;
    });

    const toggleExpand = (id: string) => {
        setExpandedRider(expandedRider === id ? null : id);
    };

    const handleGrantExecutive = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!grantEmail) return;
        setIsGranting(true);
        try {
            const res = await addFieldExecutive(grantEmail);
            if (res.success) {
                setGrantEmail('');
                router.refresh();
            } else {
                alert(res.error || "Failed to grant role");
            }
        } catch {
            alert("Failed to grant role");
        } finally {
            setIsGranting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        setIsLoading(true);
        try {
            await addRider(name, phone, email || undefined, partnerId || undefined);
            setName('');
            setPhone('');
            setEmail('');
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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to remove this executive?')) return;
        try {
            setRiders(prev => prev.filter((r: any) => r.id !== id));
            await deleteRider(id);
            router.refresh();
        } catch {
            alert('Failed to delete executive');
            setRiders(initialRiders); // Revert on failure
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Register New Field Executive</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-10 px-3 border rounded-lg bg-background outline-none focus:border-primary transition-all text-sm"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <div className="flex items-center w-full h-10 border rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                                <span className="pl-3 pr-2 py-2 border-r border-border/50 text-muted-foreground font-medium text-xs bg-muted/20">+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setPhone(val);
                                    }}
                                    className="w-full h-full px-3 text-sm outline-none bg-transparent"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address (Optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 px-3 border rounded-lg bg-background outline-none focus:border-primary transition-all text-sm"
                                placeholder="rider@fonzkart.in"
                            />
                        </div>
                        {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assign to Partner</label>
                                <select
                                    value={partnerId || ''}
                                    onChange={(e) => setPartnerId(e.target.value)}
                                    className="w-full h-10 px-3 border rounded-lg bg-background outline-none focus:border-primary transition-all text-sm"
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
                            className="w-full h-10 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-bold transition-all flex justify-center items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus className="w-4 h-4" /> Register Logistics Staff</>}
                        </button>
                    </form>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm border-dashed">
                    <h3 className="text-lg font-bold mb-4">Grant Login Access</h3>
                    <p className="text-sm text-muted-foreground mb-6">Upgrade an existing registered user to Field Executive role so they can access the admin dashboard.</p>
                    
                    <form onSubmit={handleGrantExecutive} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">User Email Address</label>
                            <input
                                type="email"
                                value={grantEmail}
                                onChange={(e) => setGrantEmail(e.target.value)}
                                className="w-full h-10 px-3 border rounded-lg bg-background outline-none focus:border-primary transition-all text-sm"
                                placeholder="rider@fonzkart.in"
                                required
                            />
                        </div>
                        <button
                            disabled={isGranting || !grantEmail}
                            className="w-full h-10 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 font-bold transition-all flex justify-center items-center gap-2"
                        >
                            {isGranting ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus className="w-4 h-4" /> Grant Dashboard Access</>}
                        </button>
                    </form>
                </div>
            </div>

            {/* Hub Handover & Logistics Executive Metrics Bar */}
            {(() => {
                const totalExecutives = filteredRiders.length;
                let totalInProgress = 0;
                let totalHandoverPending = 0;
                let totalHandedOver = 0;

                filteredRiders.forEach(r => {
                    const m = getRiderMetrics(r);
                    totalInProgress += m.inProgress;
                    totalHandoverPending += m.handoverPending.length;
                    totalHandedOver += m.handedOver.length;
                });

                return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-card border rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between text-muted-foreground mb-1">
                                <span className="text-xs font-semibold uppercase tracking-wider">Field Executives</span>
                                <User className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="text-2xl font-black text-foreground">{totalExecutives}</div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Registered delivery personnel</p>
                        </div>

                        <div className="bg-card border rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between text-muted-foreground mb-1">
                                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                                <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-black text-blue-600">{totalInProgress}</div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Assigned & active doorstep pickups</p>
                        </div>

                        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider">Handover Pending</span>
                                <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="text-2xl font-black text-amber-800 dark:text-amber-200">{totalHandoverPending}</div>
                            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">With executives awaiting hub drop-off</p>
                        </div>

                        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider">Handed Over to Hub</span>
                                <Building2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{totalHandedOver}</div>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Safely deposited at central facility</p>
                        </div>
                    </div>
                );
            })()}

            {/* Filter and View Mode Toolbar */}
            <div className="flex flex-col md:flex-row justify-between md:items-center bg-card border rounded-xl p-4 gap-4 shadow-xs">
                <div className="flex items-center gap-4 flex-wrap">
                    {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Partner:</span>
                            <select
                                value={filterPartner}
                                onChange={(e) => setFilterPartner(e.target.value)}
                                className="p-2 border rounded-lg bg-background text-sm font-medium"
                            >
                                <option value="all">All Field Executives</option>
                                <option value="unassigned">Available Executives</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase mr-1">View:</span>
                    <div className="bg-muted p-1 rounded-lg border flex gap-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Table className="w-3.5 h-3.5" /> Columns View
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" /> Cards View
                        </button>
                    </div>
                </div>
            </div>

            {/* Columns Table View */}
            {viewMode === 'table' ? (
                <div className="bg-card border rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <th className="p-4">Delivery Executive</th>
                                    <th className="p-4">Partner</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">In Progress</th>
                                    <th className="p-4 text-center bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">Handover Pending</th>
                                    <th className="p-4 text-center bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">Handed Over to Hub</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredRiders.map((rider) => {
                                    const metrics = getRiderMetrics(rider);
                                    const isExpanded = expandedRider === rider.id;
                                    const activeSubTab = orderFilterTab[rider.id] || 'all';

                                    const displayedOrders = activeSubTab === 'pending'
                                        ? metrics.handoverPending
                                        : activeSubTab === 'handed_over'
                                            ? metrics.handedOver
                                            : (rider.orders || []);

                                    return (
                                        <tr key={rider.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {rider.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground flex items-center gap-1.5">
                                                            {rider.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Phone className="w-3 h-3" /> +91 {rider.phone}
                                                        </div>
                                                        {rider.email && (
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                <Mail className="w-3 h-3" /> {rider.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-xs font-medium text-muted-foreground">
                                                {rider.partner ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground font-semibold">
                                                        <Building2 className="w-3 h-3 text-primary" /> {rider.partner.name}
                                                    </span>
                                                ) : (
                                                    <span className="italic">Unassigned</span>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase ${rider.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                                                    rider.status === 'busy' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {rider.status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className="font-bold text-blue-600 text-sm">
                                                    {metrics.inProgress}
                                                </span>
                                            </td>

                                            {/* Column: Handover Pending */}
                                            <td className="p-4 text-center bg-amber-50/30 dark:bg-amber-950/10">
                                                {metrics.handoverPending.length > 0 ? (
                                                    <button
                                                        onClick={() => {
                                                            toggleExpand(rider.id);
                                                            setOrderFilterTab(prev => ({ ...prev, [rider.id]: 'pending' }));
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 hover:scale-105 transition-all"
                                                        title="Click to view devices pending handover"
                                                    >
                                                        <Clock className="w-3 h-3 text-amber-600" />
                                                        {metrics.handoverPending.length} Pending
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground font-medium">0</span>
                                                )}
                                            </td>

                                            {/* Column: Handed Over to Hub */}
                                            <td className="p-4 text-center bg-emerald-50/30 dark:bg-emerald-950/10">
                                                {metrics.handedOver.length > 0 ? (
                                                    <button
                                                        onClick={() => {
                                                            toggleExpand(rider.id);
                                                            setOrderFilterTab(prev => ({ ...prev, [rider.id]: 'handed_over' }));
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/50 hover:scale-105 transition-all"
                                                        title="Click to view devices handed over to hub"
                                                    >
                                                        <Building2 className="w-3 h-3 text-emerald-600" />
                                                        {metrics.handedOver.length} Received
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground font-medium">0</span>
                                                )}
                                            </td>

                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={`/admin/orders?riderId=${rider.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Open in Orders view"
                                                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => toggleExpand(rider.id)}
                                                        className="px-2.5 py-1 text-xs font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        {isExpanded ? 'Hide' : 'Orders'}
                                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(e, rider.id)}
                                                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Remove Field Executive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            {/* Cards View */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start ${viewMode === 'table' ? 'hidden' : ''}`}>
                {filteredRiders.map((rider) => {
                    const metrics = getRiderMetrics(rider);
                    return (
                        <div key={rider.id} className={`border rounded-xl bg-card overflow-hidden transition-all ${expandedRider === rider.id ? 'col-span-full shadow-md border-primary/30' : ''}`}>
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleExpand(rider.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 rounded-full">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold flex items-center gap-2">
                                            {rider.name}
                                            {rider.orders && rider.orders.length > 0 && (
                                                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                                                    {rider.orders.length} Total
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Phone className="w-3 h-3" />
                                            +91 {rider.phone}
                                        </div>
                                        {rider.email && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <Mail className="w-3 h-3" />
                                                {rider.email}
                                            </div>
                                        )}
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
                                            handleDelete(e, rider.id);
                                        }}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <a
                                        href={`/admin/orders?riderId=${rider.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Open assignments in new tab"
                                        className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center font-bold"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
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

                            {/* Two Dedicated Hub Status Columns on Card */}
                            <div className="grid grid-cols-2 border-t border-border/50 bg-muted/20 text-xs text-center">
                                <div className="p-2.5 border-r border-border/50">
                                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5">Handover Pending</span>
                                    <span className={`font-black text-sm ${metrics.handoverPending.length > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                                        {metrics.handoverPending.length} Devices
                                    </span>
                                </div>
                                <div className="p-2.5">
                                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Handed Over to Hub</span>
                                    <span className={`font-black text-sm ${metrics.handedOver.length > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                                        {metrics.handedOver.length} Devices
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Expanded Rider Section (Rendered below table or within card) */}
            {expandedRider && (() => {
                const rider = riders.find((r: any) => r.id === expandedRider);
                if (!rider) return null;
                const metrics = getRiderMetrics(rider);
                const activeSubTab = orderFilterTab[rider.id] || 'all';

                const displayedOrders = activeSubTab === 'pending'
                    ? metrics.handoverPending
                    : activeSubTab === 'handed_over'
                        ? metrics.handedOver
                        : (rider.orders || []);

                return (
                    <div className="bg-card border-2 border-primary/20 rounded-xl p-5 space-y-4 shadow-sm animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                            <div>
                                <h3 className="font-bold text-base flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    {rider.name}'s Assigned Pickups & Hub Ledger
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    +91 {rider.phone} • {rider.partner ? `Partner: ${rider.partner.name}` : 'Unassigned Partner'}
                                </p>
                            </div>

                            <button
                                onClick={() => toggleExpand(rider.id)}
                                className="self-end sm:self-auto px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md text-xs font-semibold"
                            >
                                Close Details
                            </button>
                        </div>

                        {/* Partner Assignment Selector */}
                        {currentUserRole !== 'PARTNER' && partners.length > 0 && (
                            <div className="bg-muted/30 border p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 font-semibold">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    Reassign Delivery Executive to Partner:
                                </div>
                                <select
                                    value={rider.partnerId || ''}
                                    onChange={async (e) => {
                                        const newPartnerId = e.target.value || null;
                                        if (confirm(`Are you sure you want to reassign this executive?`)) {
                                            try {
                                                setRiders(prev => prev.map((r: any) => r.id === rider.id ? { ...r, partnerId: newPartnerId } : r));
                                                await updateRiderPartner(rider.id, newPartnerId);
                                                router.refresh();
                                            } catch {
                                                alert("Failed to assign partner.");
                                            }
                                        }
                                    }}
                                    className="p-1.5 text-xs border rounded-md bg-background"
                                >
                                    <option value="">None (Unassigned)</option>
                                    {partners.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Order Category Tabs */}
                        <div className="flex flex-wrap items-center gap-2 border-b pb-2 text-xs">
                            <button
                                onClick={() => setOrderFilterTab(prev => ({ ...prev, [rider.id]: 'all' }))}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeSubTab === 'all' ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                            >
                                All Assigned ({rider.orders?.length || 0})
                            </button>
                            <button
                                onClick={() => setOrderFilterTab(prev => ({ ...prev, [rider.id]: 'pending' }))}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 hover:opacity-90'}`}
                            >
                                <Clock className="w-3.5 h-3.5" />
                                Handover Pending ({metrics.handoverPending.length})
                            </button>
                            <button
                                onClick={() => setOrderFilterTab(prev => ({ ...prev, [rider.id]: 'handed_over' }))}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'handed_over' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 hover:opacity-90'}`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                Handed Over to Hub ({metrics.handedOver.length})
                            </button>
                        </div>

                        {/* Orders List */}
                        {displayedOrders && displayedOrders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                                {displayedOrders.map((order: any) => {
                                    let answersObj: any = {};
                                    if (order.answers && typeof order.answers === 'string') {
                                        try { answersObj = JSON.parse(order.answers); } catch { }
                                    } else if (typeof order.answers === 'object') {
                                        answersObj = order.answers || {};
                                    }
                                    const isHandedOver = answersObj.hubStatus === 'handed_over';

                                    return (
                                        <div key={order.id} className="bg-background border rounded-xl p-3.5 text-sm space-y-2.5 shadow-xs">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">
                                                        # FZK-{order.orderNumber || ''}
                                                    </span>
                                                    <p className="font-bold text-foreground mt-1 line-clamp-1">{order.device}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-foreground text-sm">₹{order.price.toLocaleString('en-IN')}</span>
                                                    <span className={`block text-[10px] font-bold uppercase mt-0.5 ${order.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground line-clamp-1">{order.address}</p>

                                            {/* Hub Handover Status & Action */}
                                            <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                {isHandedOver ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over to Hub
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center justify-between w-full gap-2">
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                                                            <Clock className="w-3.5 h-3.5" /> Handover Pending
                                                        </span>
                                                        <button
                                                            onClick={() => handleConfirmHubHandover(order.id, rider.id)}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                                                        >
                                                            <Building2 className="w-3.5 h-3.5" /> Confirm Hub Handover
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic text-center py-6 bg-muted/20 border rounded-lg border-dashed">
                                No orders found in this category.
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}
