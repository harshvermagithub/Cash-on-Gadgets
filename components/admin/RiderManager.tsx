
'use client';

import { useState } from 'react';
import { addRider, deleteRider } from '@/actions/admin';
import { Trash2, Plus, Loader2, User, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Rider } from '@/lib/store';

export default function RiderManager({ initialRiders }: { initialRiders: Rider[] }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                <h3 className="text-lg font-bold mb-4">Add New Executive</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium">Executive Name</label>
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
                    <div key={rider.id} className="p-4 border rounded-xl bg-card flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold">{rider.name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    {rider.phone}
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${rider.status === 'available' ? 'bg-green-100 text-green-700' :
                                    rider.status === 'busy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {rider.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(rider.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
