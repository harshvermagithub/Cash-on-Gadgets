'use client';

import { useState } from 'react';
import { addAdmin, removeAdmin } from '@/actions/admin';
import { Trash2, Plus, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/store';

export default function AdminManager({ admins }: { admins: User[] }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const result = await addAdmin(email);
            if (result.success) {
                setEmail('');
                router.refresh();
            } else {
                alert(result.error || 'Failed to add admin');
            }
        } catch {
            alert('Failed to add admin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (email: string) => {
        if (!confirm(`Remove admin privileges from ${email}?`)) return;
        try {
            const result = await removeAdmin(email);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || 'Failed to remove admin');
            }
        } catch {
            alert('Failed to remove admin');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Add New Admin
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Enter the email of a registered user to grant them admin access.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium">User Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="user@example.com"
                        />
                    </div>
                    <button
                        disabled={isLoading || !email}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 h-[42px] min-w-[120px] flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Plus className="w-4 h-4" /> Grant Admin</div>}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg">Current Admins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {admins.map((admin) => (
                        <div key={admin.id} className="p-4 border rounded-xl bg-card flex items-center justify-between group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold truncate">{admin.name}</p>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                                        <Mail className="w-3 h-3" />
                                        {admin.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(admin.email)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Remove Admin Access"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
