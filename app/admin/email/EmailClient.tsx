
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
    Plus,
    X,
    CheckCircle2,
    Loader2
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

  return (
    <div className="flex h-screen lg:h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden flex-col md:flex-row font-sans">
      
      {/* SIDEBAR - Adaptive width for tablet/desktop */}
      <div className="w-full md:w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300">
        <div className="p-4 lg:p-6 flex items-center justify-between md:justify-center lg:justify-start">
            <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-emerald-600 shrink-0" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden lg:block truncate">
                    FonzMail
                </h1>
            </div>
            <div className="md:hidden flex items-center gap-2">
                <button onClick={handleManualSync} className="p-2 text-slate-400 hover:text-emerald-600">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        <div className="px-3 lg:px-4 mb-4 lg:mb-6 hidden md:block">
            <button 
                onClick={() => { setActiveTab('compose'); setSelectedEmailId(null); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl lg:rounded-2xl py-3 px-2 lg:px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all font-semibold"
            >
                <Plus className="w-5 h-5 shrink-0" />
                <span className="hidden lg:inline">Compose</span>
            </button>
        </div>

        {/* Navigation - Adaptive Labels */}
        <nav className="hidden md:flex flex-1 flex-col px-2 space-y-1">
            {[ 
                { id: 'inbox', label: 'Inbox', icon: Mail },
                { id: 'sent', label: 'Sent', icon: Send },
                { id: 'manage', label: 'Identity Hub', icon: Settings, authReq: isElevatedRole }
            ].map((item) => {
                if (item.authReq === false) return null;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setSelectedEmailId(null); }}
                        className={`w-full flex items-center justify-center lg:justify-start px-3 lg:px-4 py-3.5 rounded-xl transition-all ${
                            activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                        title={item.label}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="font-semibold text-sm hidden lg:inline tracking-tight">{item.label}</span>
                        </div>
                    </button>
                );
            })}
        </nav>

        {/* Mobile Nav Bar - Only on small screens */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 p-2 bg-white sticky bottom-0 z-50">
             <button onClick={() => { setActiveTab('inbox'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'inbox' ? 'text-emerald-600' : 'text-slate-400'}`}><Mail className="w-6 h-6" /></button>
             <button onClick={() => { setActiveTab('sent'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'sent' ? 'text-emerald-600' : 'text-slate-400'}`}><Send className="w-6 h-6" /></button>
             <button onClick={() => { setActiveTab('compose'); setSelectedEmailId(null); }} className="p-3 bg-emerald-600 text-white rounded-full shadow-lg -mt-8 border-4 border-white"><Plus className="w-6 h-6" /></button>
             {isElevatedRole && <button onClick={() => { setActiveTab('manage'); setSelectedEmailId(null); }} className={`p-3 ${activeTab === 'manage' ? 'text-emerald-600' : 'text-slate-400'}`}><Settings className="w-6 h-6" /></button>}
        </div>

        {/* Scoped Selector - Adaptive */}
        {isElevatedRole && (
            <div className="hidden md:block p-3 lg:p-4 border-t border-slate-100">
                <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-2 hidden lg:block px-1">Scope</label>
                <select 
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] lg:text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                    <option value="">All</option>
                    {accounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email.split('@')[0]}</option>)}
                </select>
            </div>
        )}

        {/* Diagnostic Panel - Adaptive */}
        <div className="hidden md:block p-3 lg:p-4">
            <div className="p-3 rounded-xl bg-slate-900 shadow-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1 hidden lg:flex">
                    <span className="text-[10px] text-slate-500 font-black uppercase">Engine</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 hidden lg:inline">DB:</span>
                    <span className="text-emerald-400 font-bold ml-auto">{debugData.dbCount}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 hidden lg:inline">HIT:</span>
                    <span className="text-blue-400 font-bold ml-auto">{emails.length}</span>
                </div>
            </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4 flex-1">
                {selectedEmailId ? (
                    <button onClick={() => setSelectedEmailId(null)} className="md:hidden p-2 -ml-2 text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
                ) : null}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search fonzmail..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400 font-medium transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 ml-4">
                <button onClick={handleManualSync} disabled={isSyncing} className="hidden md:flex p-2.5 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200/50">
                    {initialUserEmail.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>

        <div className="flex-1 flex flex-row overflow-hidden relative">
            
            {/* EMAIL LIST - Responsive Width */}
            <div className={`transition-all duration-300 flex-1 overflow-y-auto ${selectedEmailId ? 'max-w-0 md:max-w-xs lg:max-w-sm xl:max-w-md border-r border-slate-50 hidden md:block' : 'w-full'}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>
                ) : emails.filter(e => activeTab === 'sent' ? e.isOutbound : !e.isOutbound).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Mail className="w-8 h-8 text-slate-200" /></div>
                        <h3 className="font-bold text-slate-800">No emails here</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-[200px]">Everything is up to date.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100/50">
                        {emails.filter(e => activeTab === 'sent' ? e.isOutbound : !e.isOutbound).map((email, i) => (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                key={email.id}
                                onClick={() => viewEmailDetail(email.id)}
                                className={`cursor-pointer px-4 lg:px-6 py-5 flex flex-col gap-1.5 transition-all ${selectedEmailId === email.id ? 'bg-emerald-50/70 border-l-4 border-emerald-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start text-[11px] lg:text-xs">
                                    <span className="font-bold text-slate-900 truncate pr-4">{email.isOutbound ? `To: ${email.toEmail}` : email.fromEmail}</span>
                                    <span className="text-slate-400 font-semibold whitespace-nowrap">{new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <h4 className={`text-xs font-bold truncate ${selectedEmailId === email.id ? 'text-emerald-700' : 'text-slate-700'}`}>{email.subject}</h4>
                                <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">{email.snippet || (email.text && email.text.substring(0, 80)) || 'No content'}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* EMAIL DETAIL - Responsive Viewport */}
            <AnimatePresence>
                {(selectedEmailId && fullEmail) && (
                    <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 30, opacity: 0 }}
                        className="flex-1 bg-white flex flex-col z-40 absolute inset-0 md:relative overflow-hidden"
                    >
                        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white">
                            <button onClick={() => setSelectedEmailId(null)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all"><ChevronLeft className="w-5 h-5" /></button>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setSelectedEmailId(null)} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 lg:p-12 xl:p-16 max-w-5xl mx-auto w-full">
                            <h1 className="text-2xl lg:text-4xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">{fullEmail.subject}</h1>
                            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 font-black text-xl border border-emerald-100">{(fullEmail.fromEmail || '?').charAt(0).toUpperCase()}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                                        <span className="font-bold text-slate-900 truncate text-sm lg:text-base">{fullEmail.fromEmail || fullEmail.from}</span>
                                        <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full w-fit border border-emerald-100/50">Verified Sender</span>
                                    </div>
                                    <p className="text-[11px] lg:text-xs text-slate-400 mt-1 font-semibold truncate">To: {fullEmail.toEmail || fullEmail.to}</p>
                                </div>
                                <div className="hidden sm:block text-right shrink-0">
                                    <span className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Sent on</span>
                                    <span className="text-xs text-slate-600 font-bold">{new Date(fullEmail.receivedAt || fullEmail.date).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-slate-700 text-sm lg:text-lg leading-relaxed lg:leading-[1.8] font-medium break-words">
                                {fullEmail.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: fullEmail.bodyHtml }} className="email-content-wrapper" /> : <p className="whitespace-pre-wrap">{fullEmail.bodyText || fullEmail.text}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COMPOSE VIEW */}
            {!selectedEmailId && activeTab === 'compose' && (
                <div className="flex-1 flex flex-col items-center bg-[#f8fafc] overflow-y-auto p-4 lg:p-12">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100/50 transition-all flex flex-col h-fit">
                        <header className="px-6 lg:px-8 py-5 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="font-black text-slate-900 text-lg tracking-tight">New Message</h2>
                            <button onClick={() => setActiveTab('inbox')} className="text-slate-300 hover:text-slate-600 p-2"><X className="w-5 h-5" /></button>
                        </header>
                        <form onSubmit={handleSendEmail} className="p-6 lg:p-10 space-y-5 lg:space-y-8">
                            {isElevatedRole && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Account</label>
                                    <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className="w-full p-3.5 lg:p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-sm transition-all appearance-none cursor-pointer">
                                        <option value="">Default (support@fonzkart.in)</option>
                                        {accounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Recipient</label><input type="email" required value={composeTo} onChange={(e) => setComposeTo(e.target.value)} className="w-full p-3.5 lg:p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-sm transition-all shadow-inner" placeholder="user@domain.com" /></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Topic</label><input type="text" required value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="w-full p-3.5 lg:p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-sm transition-all" placeholder="Subject line" /></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message</label><textarea required rows={8} value={composeBody} onChange={(e) => setComposeBody(e.target.value)} className="w-full p-3.5 lg:p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-medium text-sm lg:text-base resize-none transition-all shadow-inner"></textarea></div>
                            <button type="submit" disabled={isSending} className="w-full bg-slate-900 hover:bg-black text-white p-4 lg:p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all group">
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />} {isSending ? 'SENDING...' : 'DISPATCH EMAIL'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* IDENTITY HUB - Advanced Responsive Grid */}
            {!selectedEmailId && activeTab === 'manage' && isElevatedRole && (
                <div className="flex-1 overflow-y-auto p-4 lg:p-12 xl:p-16 bg-[#f8fafc]">
                    <div className="max-w-6xl mx-auto space-y-10 lg:space-y-16 pb-24 lg:pb-0">
                        <header className="space-y-2">
                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                <Settings className="w-6 h-6 lg:w-8 lg:h-8" />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Module Identity</span>
                            </div>
                            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">Identity Hub</h2>
                            <p className="text-slate-400 text-sm lg:text-xl font-medium max-w-2xl">Provision and manage secure communication endpoints for your zonal infrastructure.</p>
                        </header>

                        <div className="grid xl:grid-cols-5 gap-8 lg:gap-12">
                            {/* Provision Form */}
                            <section className="xl:col-span-2 bg-white p-7 lg:p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 h-fit">
                                <h3 className="font-black text-slate-900 text-xl mb-8 flex items-center gap-3"><Plus className="w-6 h-6 text-emerald-500" /> New Account</h3>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                    <div className="space-y-2.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Alias</label><div className="flex items-center group transition-all"><input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1 p-4 bg-slate-50 border-none rounded-l-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-sm transition-all" placeholder="partner_name" /><span className="inline-flex items-center px-5 h-[52px] bg-slate-100 text-slate-500 rounded-r-2xl font-black text-xs border-l border-slate-200">@fonzkart.in</span></div></div>
                                    <div className="space-y-2.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Keyphrase</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-sm" placeholder="Secure Password" /></div>
                                    <button type="button" onClick={handleCreateAccount} disabled={isCreating} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4.5 rounded-2xl font-black shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.97] uppercase tracking-widest text-xs py-5">
                                        {isCreating ? 'Provisioning...' : 'Deploy Mailbox'}
                                    </button>
                                </form>
                            </section>

                            {/* Live Accounts List */}
                            <section className="xl:col-span-3 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-black text-slate-800 text-xl flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Active Mailboxes</h3>
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{accounts.length} Total</span>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                                    {accounts.map((acc) => (
                                        <div key={acc.email} className="bg-white p-5 lg:p-6 rounded-[24px] border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors shrink-0"><User className="w-6 h-6" /></div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-800 text-sm truncate">{acc.email}</p>
                                                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[.15em] bg-emerald-50/50 w-fit px-2 py-0.5 rounded-full mt-1.5 border border-emerald-100/30">Active & Routing</p>
                                                </div>
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
    if (!newEmail || !newPassword) return alert('Email and Password are required');
    setIsCreating(true);
    try {
      const res = await fetch('/api/email/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      if (res.ok) {
        setNewEmail(''); setNewPassword(''); fetchAccounts();
      } else {
        const error = await res.json(); alert('Error: ' + (error.message || error.error));
      }
    } catch (e: any) { alert('Error: ' + e.message); } finally { setIsCreating(false); }
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
      const res = await fetch('/api/email/send', { method: 'POST', body: formData });
      if (res.ok) {
        setComposeTo(''); setComposeSubject(''); setComposeBody(''); setAttachments([]);
        setActiveTab('sent'); loadEmails(true);
      } else {
        const error = await res.json(); alert('Error: ' + error.message);
      }
    } catch (e: any) { alert('Error: ' + e.message); } finally { setIsSending(false); }
  }
}
