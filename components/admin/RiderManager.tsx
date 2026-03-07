
'use client';

import { useState } from 'react';
import { addRider, deleteRider } from '@/actions/admin';
import { Trash2, Plus, Loader2, User, Phone, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RiderManager({ initialRiders }: { initialRiders: any[] }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [expandedRider, setExpandedRider] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedRider(expandedRider === id ? null : id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        setIsLoading(true);
        try {
            await addRider(name, phone);
            setName('');
            setPhone('');
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
                    <button
                        disabled={isLoading || !name || !phone}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 h-[42px] min-w-[100px] flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add</div>}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialRiders.map((rider) => (
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
                                {expandedRider === rider.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                            </div>
                        </div>

                        {/* Expandable Orders Section */}
                        {expandedRider === rider.id && (
                            <div className="bg-muted/30 border-t p-4 space-y-3">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assigned Orders</h4>
                                {rider.orders && rider.orders.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                                                            {order.status}
                                                        </span>
                                                    </div>
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
