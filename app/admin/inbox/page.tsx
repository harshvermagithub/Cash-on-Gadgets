
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Mail, ExternalLink, ShieldCheck, Zap, Users, Building2, User as UserIcon } from 'lucide-react';
import { prisma } from "@/lib/db";

export default async function InboxPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const role = session.user.role;
    const userEmail = session.user.email;

    // Fetch managed accounts based on role
    let managedLogins: any[] = [];
    
    if (role === 'ZONAL_HEAD') {
        const currentUser: any = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCities: { include: { users: { where: { role: 'PARTNER' } } } } }
        });

        if (currentUser) {
            const partnerIds = currentUser.managedCities.flatMap((c: any) => c.users.map((u: any) => u.id));
            const partners = await prisma.user.findMany({
                where: { id: { in: partnerIds } },
                select: { email: true, name: true, role: true }
            });
            const riders = await prisma.rider.findMany({
                where: { partnerId: { in: partnerIds } },
                select: { name: true, phone: true }
            });

            managedLogins = [
                ...partners.map(p => ({ email: p.email, name: p.name, type: 'PARTNER' })),
                ...riders.map(r => ({ email: `${r.phone}@fonzkart.in`, name: r.name, type: 'FIELD EXECUTIVE' }))
            ];
        }
    } else if (role === 'PARTNER') {
        const riders = await prisma.rider.findMany({
            where: { partnerId: session.user.id },
            select: { name: true, phone: true }
        });
        managedLogins = riders.map(r => ({ email: `${r.phone}@fonzkart.in`, name: r.name, type: 'FIELD EXECUTIVE' }));
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">
                        Communication Hub
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Access official <span className="font-bold text-primary">@fonzkart.in</span> communications.
                    </p>
                </div>
                
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-4 shadow-xl border border-white/10 shrink-0">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">My Account</p>
                        <p className="text-sm font-mono text-slate-300">{userEmail}</p>
                    </div>
                    <a 
                        href="https://mail.fonzkart.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                        title="Open My Mail"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-8">
                    {managedLogins.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" /> Managed Mailboxes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {managedLogins.map((acc, idx) => (
                                    <div key={idx} className="bg-card border rounded-2xl p-5 hover:border-primary/50 transition-all group relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${acc.type === 'PARTNER' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                                {acc.type}
                                            </div>
                                            <a 
                                                href={`https://mail.fonzkart.in/?_user=${encodeURIComponent(acc.email)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="opacity-0 group-hover:opacity-100 p-2 bg-muted text-foreground rounded-lg transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{acc.name}</h4>
                                        <p className="text-xs font-mono text-muted-foreground mt-1 truncate">{acc.email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Mail className="w-32 h-32" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black">Official Webmail Access</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                                Use the official login portal for end-to-end encrypted communication. Managed accounts require their specific generated passwords.
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <a 
                                href="https://mail.fonzkart.in" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-3 active:scale-[0.98]"
                            >
                                WEBMAIL PORTAL <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Area */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-10">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                           <Zap className="w-4 h-4 fill-emerald-400" /> Security
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                            "Every email sent from a @fonzkart.in domain represents our brand integrity. Maintain professional standards in all communications."
                        </p>
                    </div>

                    <div className="border bg-card rounded-3xl p-8 space-y-4">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Instructions</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground leading-snug">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Credentials for field executives are linked to their portal passwords.
                            </li>
                            <li className="flex items-start gap-3 text-sm text-muted-foreground leading-snug">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Zonal heads can monitor threads to ensure pickup TAT is maintained.
                            </li>
                            <li className="flex items-start gap-3 text-sm text-muted-foreground leading-snug">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Report any unauthorized access attempts immediately.
                            </li>
                        </ul>
                        <hr className="border-border/50" />
                        <p className="text-xs text-muted-foreground italic">Need help? contact: tech@fonzkart.in</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
