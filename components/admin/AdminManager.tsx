'use client';

import { useState } from 'react';
import { addAdmin, removeAdmin } from '@/actions/admin';
import { Trash2, Plus, Loader2, ShieldCheck, Mail, Briefcase, Building2, Users, Crown, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminManager({
    superAdmins,
    admins,
    zonalHeads,
    partners,
    riders
}: {
    superAdmins: any[],
    admins: any[],
    zonalHeads: any[],
    partners: any[],
    riders: any[]
}) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'superAdmins' | 'admins' | 'zonalHeads' | 'partners' | 'riders'>('superAdmins');

    const handleAddAdmin = async (e: React.FormEvent) => {
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

    const handleRemoveAdmin = async (adminEmail: string) => {
        if (!confirm(`Remove admin privileges from ${adminEmail}?`)) return;
        try {
            const result = await removeAdmin(adminEmail);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || 'Failed to remove admin');
            }
        } catch {
            alert('Failed to remove admin');
        }
    };

    const tabs = [
        { id: 'superAdmins', label: 'Super Admins', icon: Crown, count: superAdmins.length },
        { id: 'admins', label: 'Admins', icon: ShieldCheck, count: admins.length },
        { id: 'zonalHeads', label: 'Zonal Heads', icon: Briefcase, count: zonalHeads.length },
        { id: 'partners', label: 'Partners', icon: Building2, count: partners.length },
        { id: 'riders', label: 'Field Executives', icon: Users, count: riders.length },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex overflow-x-auto border-b border-border/50 pb-px gap-6 hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="pt-4 pb-12">
                {activeTab === 'superAdmins' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {superAdmins.map((admin) => (
                                <div key={admin.id} className="p-4 border border-primary/20 rounded-xl bg-primary/5 flex items-center justify-between group shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/20 text-primary rounded-xl">
                                            <Crown className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 mt-0.5">
                                            <p className="font-bold truncate text-foreground">{admin.name}</p>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                                                <Mail className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{admin.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] tracking-wider font-bold px-2 py-1 bg-primary text-primary-foreground rounded-full shrink-0">
                                        SUPER ADMIN
                                    </span>
                                </div>
                            ))}
                            {superAdmins.length === 0 && <p className="text-muted-foreground text-sm col-span-3 p-4 bg-muted/20 border-dashed border rounded-xl text-center">No Super Admins found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'admins' && (
                    <div className="space-y-8">
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Grant User Admin Privilege
                            </h3>
                            <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-sm font-medium text-muted-foreground">User Email Address</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="w-full h-10 px-3 border rounded-lg bg-background outline-none focus:border-primary transition-colors"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <button
                                    disabled={isLoading || !email}
                                    className="px-4 h-10 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 min-w-[120px] flex justify-center items-center text-sm font-medium transition-colors"
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <div className="flex items-center gap-2"><Plus className="w-4 h-4" /> Grant Admin</div>}
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {admins.map((admin) => (
                                <div key={admin.id} className="p-4 border rounded-xl bg-card shadow-sm flex items-center justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-xl">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 mt-0.5">
                                            <p className="font-bold truncate text-foreground">{admin.name}</p>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                                                <Mail className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{admin.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAdmin(admin.email)}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                                        title="Revoke Admin Access"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {admins.length === 0 && <p className="text-muted-foreground text-sm col-span-3 p-4 bg-muted/20 border-dashed border rounded-xl text-center">No standard Admins found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'zonalHeads' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {zonalHeads.map((zh) => (
                            <div key={zh.id} className="p-4 border rounded-xl bg-card shadow-sm flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 mt-0.5">
                                        <p className="font-bold truncate text-foreground">{zh.name}</p>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                                            <Mail className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{zh.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {zonalHeads.length === 0 && <p className="text-muted-foreground text-sm col-span-3 p-4 bg-muted/20 border-dashed border rounded-xl text-center">No Zonal Heads found.</p>}
                    </div>
                )}

                {activeTab === 'partners' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partners.map((partner) => (
                            <div key={partner.id} className="p-4 border rounded-xl bg-card shadow-sm flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500 rounded-xl">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 mt-0.5">
                                        <p className="font-bold truncate text-foreground">{partner.name}</p>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                                            <Mail className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{partner.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {partners.length === 0 && <p className="text-muted-foreground text-sm col-span-3 p-4 bg-muted/20 border-dashed border rounded-xl text-center">No Partners found.</p>}
                    </div>
                )}

                {activeTab === 'riders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {riders.map((rider) => (
                            <div key={rider.id} className="p-4 border rounded-xl bg-card shadow-sm flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-xl">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 mt-0.5">
                                        <p className="font-bold truncate text-foreground">{rider.name}</p>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                                            <Phone className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{rider.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] tracking-wider font-bold px-2.5 py-1 rounded-full shrink-0 ${rider.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' :
                                    rider.status === 'busy' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white'
                                    }`}>
                                    {rider.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                        {riders.length === 0 && <p className="text-muted-foreground text-sm col-span-3 p-4 bg-muted/20 border-dashed border rounded-xl text-center">No Field Executives found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
