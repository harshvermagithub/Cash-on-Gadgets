
"use client";
import { useState, useEffect } from 'react';
import { fetchRoleBasedEmails, fetchEmailById, syncImapEmails } from '@/actions/email-hub';
import { 
    Mail, 
    Send, 
    Settings, 
    Search, 
    RefreshCw, 
    ChevronLeft, 
    User, 
    Clock, 
    Filter,
    ArrowRight,
    Download,
    Plus,
    X,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailClient({ role: initialRole, userEmail: initialUserEmail }: { role: string, userEmail: string }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose' | 'manage'>('inbox');
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [fullEmail, setFullEmail] = useState<any | null>(null);
  
  // Diagnostic State
  const [debugData, setDebugData] = useState({
      role: initialRole,
      dbCount: 0,
      accountCount: 0,
      error: null as string | null
  });

  // Filtering
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Manage Accounts State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isElevatedRole = initialRole === 'SUPER_ADMIN' || initialRole === 'ADMIN' || initialRole === 'ZONAL_HEAD';

  useEffect(() => {
    loadEmails(true); 
    if (isElevatedRole) {
        fetchAccounts();
    }
  }, [selectedAccount, initialRole]);

  const loadEmails = async (skipSync: boolean = false) => {
    setIsLoading(true);
    try {
      const result: any = await fetchRoleBasedEmails(selectedAccount || undefined, skipSync);
      if (result.error) {
          setDebugData(prev => ({ ...prev, error: result.error }));
      } else {
          setEmails(result.emails);
          setDebugData(prev => ({ 
              ...prev, 
              dbCount: result.totalInDb, 
              accountCount: result.totalAccounts,
              role: result.userRole,
              error: null
          }));
      }
    } catch (e: any) {
      console.error(e);
      setDebugData(prev => ({ ...prev, error: e.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
        await syncImapEmails(selectedAccount || undefined);
        await loadEmails(true); 
    } catch (e: any) {
        alert('Sync failed: ' + e.message);
    } finally {
        setIsSyncing(false);
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/email/account');
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const viewEmailDetail = async (id: string) => {
    setSelectedEmailId(id);
    const email = emails.find(e => e.id === id);
    if (email) {
        setFullEmail(email);
        try {
            const detailed = await fetchEmailById(id);
            if (detailed) setFullEmail(detailed);
        } catch (e) {}
    }
  };

  const activeInboxCount = emails.filter(e => !e.isOutbound).length;

  return (
    <div className="flex h-screen md:h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden flex-col md:flex-row">
      
      {/* SIDEBAR - Responsive */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 md:p-6 flex items-center justify-between md:block">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                FonzMail
            </h1>
            <div className="md:hidden flex items-center gap-2">
                <button onClick={handleManualSync} className="p-2 text-slate-400 hover:text-emerald-600">
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        <div className="px-4 mb-4 md:mb-6 hidden md:block">
            <button 
                onClick={() => { setActiveTab('compose'); setSelectedEmailId(null); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all font-semibold"
            >
                <Plus className="w-5 h-5" />
                Compose
            </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 px-2 space-y-1">
            {[ 
                { id: 'inbox', label: 'Inbox', icon: Mail },
                { id: 'sent', label: 'Sent', icon: Send },
                { id: 'manage', label: 'Accounts', icon: Settings, authReq: isElevatedRole }
            ].map((item) => {
                if (item.authReq === false) return null;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setSelectedEmailId(null); }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                    </button>
                );
            })}
        </nav>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 p-2 bg-white sticky bottom-0">
             <button onClick={() => { setActiveTab('inbox'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'inbox' ? 'text-emerald-600' : 'text-slate-400'}`}><Mail className="w-6 h-6" /></button>
             <button onClick={() => { setActiveTab('sent'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'sent' ? 'text-emerald-600' : 'text-slate-400'}`}><Send className="w-6 h-6" /></button>
             <button onClick={() => { setActiveTab('compose'); setSelectedEmailId(null); }} className="p-3 bg-emerald-600 text-white rounded-full shadow-lg -mt-8 border-4 border-white"><Plus className="w-6 h-6" /></button>
             {isElevatedRole && <button onClick={() => { setActiveTab('manage'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'manage' ? 'text-emerald-600' : 'text-slate-400'}`}><Settings className="w-6 h-6" /></button>}
        </div>

        {/* Diagnostic Panel - Improved positioning */}
        <div className="hidden md:block p-4 mt-auto">
            <div className="p-3 rounded-xl bg-slate-900 text-[10px] text-slate-400 font-mono space-y-1 shadow-2xl border border-white/5">
                <div className="flex justify-between border-b border-white/5 pb-1 mb-1">
                    <span className="text-slate-500">SYSTEM STATUS</span>
                </div>
                <div className="flex justify-between">
                    <span>ROLE:</span>
                    <span className="text-emerald-400 font-bold uppercase">{debugData.role}</span>
                </div>
                <div className="flex justify-between">
                    <span>DB CACHE:</span>
                    <span className="text-white font-bold">{debugData.dbCount}</span>
                </div>
                <div className="flex justify-between">
                    <span>MATCHED:</span>
                    <span className="text-blue-400 font-bold">{emails.length}</span>
                </div>
                {debugData.error && <div className="mt-2 text-red-400 text-[9px] leading-tight break-words">! {debugData.error}</div>}
            </div>
        </div>

        {isElevatedRole && (
            <div className="hidden md:block p-4 border-t border-slate-100 pb-8">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 block">Scoped View</label>
                <select 
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="">All Accounts</option>
                    {accounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email}</option>)}
                </select>
            </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <header className="h-16 border-b border-slate-50 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white z-30">
            <div className="flex items-center gap-4 flex-1">
                {selectedEmailId ? (
                    <button onClick={() => setSelectedEmailId(null)} className="md:hidden p-2 -ml-2 text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
                ) : null}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search mail..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 ml-2">
                <button onClick={handleManualSync} disabled={isSyncing} className="hidden md:flex p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {initialUserEmail.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>

        <div className="flex-1 flex flex-row overflow-hidden relative">
            
            {/* EMAIL LIST */}
            <div className={`transition-all duration-300 flex-1 overflow-y-auto ${selectedEmailId ? 'max-w-[400px] border-r border-slate-50 hidden md:block' : 'w-full'}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>
                ) : emails.filter(e => activeTab === 'sent' ? e.isOutbound : !e.isOutbound).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Mail className="w-8 h-8 text-slate-200" /></div>
                        <h3 className="font-bold text-slate-800">Inbox is empty</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-[200px]">No messages matched your role or account filter.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {emails.filter(e => activeTab === 'sent' ? e.isOutbound : !e.isOutbound).map((email, i) => (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                key={email.id}
                                onClick={() => viewEmailDetail(email.id)}
                                className={`cursor-pointer px-4 md:px-6 py-4 flex flex-col gap-1 ${selectedEmailId === email.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex justify-between items-start text-xs">
                                    <span className="font-bold text-slate-900 truncate pr-4">{email.isOutbound ? `To: ${email.toEmail}` : email.fromEmail}</span>
                                    <span className="text-slate-400 font-medium whitespace-nowrap">{new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <h4 className={`text-[11px] md:text-xs font-semibold truncate ${selectedEmailId === email.id ? 'text-emerald-700' : 'text-slate-700'}`}>{email.subject}</h4>
                                <p className="text-[10px] md:text-[11px] text-slate-400 line-clamp-1 mt-0.5">{email.snippet || (email.text && email.text.substring(0, 80)) || 'Empty content'}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* EMAIL DETAIL */}
            <AnimatePresence>
                {(selectedEmailId && fullEmail) && (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}
                        className="flex-1 bg-white flex flex-col z-40 absolute inset-0 md:relative"
                    >
                        <div className="h-14 border-b border-slate-50 flex items-center justify-between px-4 md:px-6 shrink-0">
                            <button onClick={() => setSelectedEmailId(null)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={() => setSelectedEmailId(null)} className="p-2 text-slate-400 transition-all"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-10 max-w-4xl mx-auto w-full">
                            <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-6 leading-tight">{fullEmail.subject}</h1>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">{(fullEmail.fromEmail || '?').charAt(0).toUpperCase()}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                        <span className="font-bold text-slate-900 truncate">{fullEmail.fromEmail || fullEmail.from}</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter border border-slate-100 px-1.5 py-0.5 rounded-full w-fit">Verified Contact</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">To: {fullEmail.toEmail || fullEmail.to}</p>
                                </div>
                                <div className="hidden sm:block text-right shrink-0"><span className="text-[10px] md:text-xs text-slate-400 font-medium">{new Date(fullEmail.receivedAt || fullEmail.date).toLocaleString()}</span></div>
                            </div>
                            <div className="text-slate-600 text-sm md:text-base leading-relaxed break-words">
                                {fullEmail.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: fullEmail.bodyHtml }} className="email-content-wrapper" /> : <p className="whitespace-pre-wrap">{fullEmail.bodyText || fullEmail.text}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COMPOSE VIEW */}
            {!selectedEmailId && activeTab === 'compose' && (
                <div className="flex-1 flex flex-col items-center bg-[#f8fafc] overflow-y-auto p-4 md:p-8">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 transition-all flex flex-col h-fit">
                        <header className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800">New Message</h2>
                            <button onClick={() => setActiveTab('inbox')} className="text-slate-300 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
                        </header>
                        <form onSubmit={handleSendEmail} className="p-6 space-y-4 md:space-y-6">
                            {isElevatedRole && (
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">From Account</label>
                                    <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-semibold text-sm">
                                        <option value="">Default (support@fonzkart.in)</option>
                                        {accounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Recipient</label><input type="email" required value={composeTo} onChange={(e) => setComposeTo(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. user@example.com" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Subject</label><input type="text" required value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Subject" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Message</label><textarea required rows={6} value={composeBody} onChange={(e) => setComposeBody(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm resize-none"></textarea></div>
                            <button type="submit" disabled={isSending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} {isSending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ACCOUNTS VIEW */}
            {!selectedEmailId && activeTab === 'manage' && isElevatedRole && (
                <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-[#f8fafc]">
                    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-20 md:pb-0">
                        <div><h2 className="text-xl md:text-4xl font-bold text-slate-800 tracking-tight">Identity Hub</h2><p className="text-slate-400 mt-1 md:mt-2 text-sm md:text-lg">Manage and provision shared email accounts for your zone.</p></div>
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                            <section className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-500" /> New Account</h3>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase pl-1">Email Alias</label><div className="flex"><input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1 p-3 md:p-4 bg-slate-50 border-none rounded-l-2xl focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="partner" /><span className="inline-flex items-center px-4 bg-slate-100 text-slate-400 rounded-r-2xl font-bold text-[10px] md:text-xs">@fonzkart.in</span></div></div>
                                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase pl-1">Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Secure Key" /></div>
                                    <button type="button" onClick={handleCreateAccount} disabled={isCreating} className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">{isCreating ? 'Provisioning...' : 'Deploy Mailbox'}</button>
                                </form>
                            </section>
                            <section className="space-y-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live accounts</h3>
                                <div className="grid sm:grid-cols-1 gap-3 shrink-0 overflow-visible">
                                    {accounts.map((acc) => (
                                        <div key={acc.email} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 flex items-center justify-between min-w-0 group hover:shadow-lg transition-all">
                                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><User className="w-5 h-5" /></div>
                                                <div className="min-w-0"><p className="font-bold text-slate-800 text-sm md:text-base truncate">{acc.email}</p><p className="text-[9px] md:text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-50/50 w-fit px-2 py-0.5 rounded-full mt-0.5">Routed</p></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );

  async function handleCreateAccount() {
    setIsCreating(true);
    try {
      const res = await fetch('/api/email/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      if (res.ok) {
        alert('Account created successfully');
        setNewEmail(''); setNewPassword(''); fetchAccounts();
      } else {
        const error = await res.json(); alert('Error: ' + (error.message || error.error));
      }
    } catch (e: any) { alert('Error creating account: ' + e.message); } finally { setIsCreating(false); }
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('fromAccount', selectedAccount || 'support@fonzkart.in');
      formData.append('to', composeTo);
      formData.append('subject', composeSubject);
      formData.append('text', composeBody);
      attachments.forEach(file => formData.append('attachments', file));
      const res = await fetch('/api/email/send', { method: 'POST', body: formData });
      if (res.ok) {
        alert('Email sent successfully');
        setComposeTo(''); setComposeSubject(''); setComposeBody(''); setAttachments([]);
        setActiveTab('sent'); loadEmails(true);
      } else {
        const error = await res.json(); alert('Error: ' + error.message);
      }
    } catch (e: any) { alert('Error sending email: ' + e.message); } finally { setIsSending(false); }
  }
}
