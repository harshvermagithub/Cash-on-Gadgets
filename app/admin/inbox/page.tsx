
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Mail, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default async function InboxPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const userEmail = session.user.email || 'your-email@fonzkart.in';

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">
                    Your Official Inbox
                </h1>
                <p className="text-muted-foreground text-lg">
                    Access your official <span className="font-bold text-primary">@fonzkart.in</span> email communications.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none border-emerald-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Mail className="w-32 h-32" />
                    </div>
                    
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <Mail className="w-8 h-8 text-emerald-500" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black">Webmail Portal</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Log in to Roundcube to manage your direct communications, attachments, and official schedules.
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-dashed text-center">
                        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">{userEmail}</p>
                    </div>

                    <a 
                        href="https://mail.fonzkart.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        OPEN WEBMAIL <ExternalLink className="w-5 h-5" />
                    </a>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-10">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                           <Zap className="w-4 h-4 fill-emerald-400" /> Security Notice
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Your @fonzkart.in email is strictly for official use. Do not share your credentials with anyone. Use the Webmail Portal to reset your password if needed.
                        </p>
                    </div>

                    <div className="border bg-card rounded-3xl p-8 space-y-4">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Support & Help</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Forgot your email password?
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Reporting technical issues
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Email storage limits
                            </li>
                        </ul>
                        <button className="text-emerald-500 font-bold text-sm hover:underline">Contact System Admin →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
