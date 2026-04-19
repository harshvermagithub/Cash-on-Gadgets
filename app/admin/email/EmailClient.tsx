
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
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailClient({ role, userEmail }: { role: string, userEmail: string }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose' | 'manage'>('inbox');
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [fullEmail, setFullEmail] = useState<any | null>(null);
  
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

  useEffect(() => {
    loadEmails(true); // Skip sync on mount for speed
    if (role === 'SUPER_ADMIN') {
        fetchAccounts();
    }
  }, [selectedAccount, role]);

  const loadEmails = async (skipSync: boolean = false) => {
    setIsLoading(true);
    try {
      const data = await fetchRoleBasedEmails(selectedAccount || undefined, skipSync);
      setEmails(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
        await syncImapEmails(selectedAccount || undefined);
        await loadEmails(true); // Fetch updated DB records
    } catch (e) {
        alert('Sync failed');
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
        // Also fetch from server to get full body if snippet was used
        try {
            const detailed = await fetchEmailById(id);
            if (detailed) setFullEmail(detailed);
        } catch (e) {}
    }
  };

  const closeEmailDetail = () => {
    setSelectedEmailId(null);
    setFullEmail(null);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('fromAccount', selectedAccount || 'support@fonzkart.in');
      formData.append('to', composeTo);
      formData.append('subject', composeSubject);
      formData.append('text', composeBody);

      attachments.forEach(file => {
          formData.append('attachments', file);
      });

      const res = await fetch('/api/email/send', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Email sent successfully');
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        setAttachments([]);
        setActiveTab('sent');
        loadEmails();
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (e) {
      alert('Error sending email');
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter(e => {
      const isTypeMatch = activeTab === 'sent' ? e.isOutbound : !e.isOutbound;
      const isSearchMatch = (e.subject + e.fromEmail + e.text).toLowerCase().includes(searchQuery.toLowerCase());
      return isTypeMatch && isSearchMatch;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                FonzMail Hub
            </h1>
        </div>

        <div className="px-4 mb-6">
            <button 
                onClick={() => setActiveTab('compose')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all font-semibold active:scale-95"
            >
                <Plus className="w-5 h-5" />
                Compose
            </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
            {[ 
                { id: 'inbox', label: 'Inbox', icon: Mail },
                { id: 'sent', label: 'Sent', icon: Send },
                { id: 'manage', label: 'Accounts', icon: Settings, adminOnly: true }
            ].map((item) => {
                if (item.adminOnly && role !== 'SUPER_ADMIN') return null;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id as any);
                            closeEmailDetail();
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            activeTab === item.id 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        {item.id === 'inbox' && emails.filter(e => !e.isOutbound).length > 0 && (
                             <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {emails.filter(e => !e.isOutbound).length}
                             </span>
                        )}
                    </button>
                );
            })}
        </nav>

        {role === 'SUPER_ADMIN' && (
            <div className="p-4 border-t border-slate-100">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 block">Viewing Account</label>
                <select 
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="">All Accounts</option>
                    {accounts.map(acc => (
                        <option key={acc.email} value={acc.email}>{acc.email}</option>
                    ))}
                </select>
            </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
                <div className="h-8 w-px bg-slate-100 mx-2"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                        {userEmail.charAt(0)}
                    </div>
                </div>
            </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex flex-row overflow-hidden">
            
            {/* EMAIL LIST */}
            <div className={`transition-all duration-500 flex-1 overflow-y-auto ${selectedEmailId ? 'max-w-[400px] border-r border-slate-100 hidden md:block' : 'w-full'}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-slate-400 text-sm animate-pulse">Syncing your mailbox...</p>
                    </div>
                ) : filteredEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-800">No emails found</h3>
                        <p className="text-slate-400 text-sm max-w-[240px] mt-1">Try syncing manually or check your active account filter.</p>
                        <button 
                            onClick={handleManualSync}
                            className="mt-6 text-emerald-600 font-semibold flex items-center gap-2 hover:underline"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Sync Now
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredEmails.map((email, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                key={email.id}
                                onClick={() => viewEmailDetail(email.id)}
                                className={`group cursor-pointer px-6 py-4 flex flex-col gap-1 transition-all ${
                                    selectedEmailId === email.id 
                                    ? 'bg-emerald-50' 
                                    : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-bold truncate pr-4 ${selectedEmailId === email.id ? 'text-emerald-900' : 'text-slate-900'}`}>
                                        {email.isOutbound ? `To: ${email.toEmail}` : email.fromEmail}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap pt-1">
                                        {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <h4 className={`text-xs font-semibold truncate ${selectedEmailId === email.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                                    {email.subject}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                    {email.snippet || email.text.substring(0, 100)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* EMAIL DETAIL (Gmail Expansion Style) */}
            <AnimatePresence>
                {(selectedEmailId && fullEmail) && (
                    <motion.div 
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="flex-1 bg-white flex flex-col z-20 absolute inset-0 md:relative"
                    >
                        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6">
                            <button onClick={closeEmailDetail} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ChevronLeft className="w-5 h-5 text-slate-500" />
                            </button>
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button onClick={closeEmailDetail} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                            <h1 className="text-2xl font-bold text-slate-800 mb-8">{fullEmail.subject}</h1>

                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                        {(fullEmail.fromEmail || fullEmail.from).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{fullEmail.fromEmail || fullEmail.from}</span>
                                            <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full border border-slate-100">Sender</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">To: {fullEmail.toEmail || fullEmail.to}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-medium">{new Date(fullEmail.receivedAt || fullEmail.date).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-none">
                                {fullEmail.bodyHtml ? (
                                    <div dangerouslySetInnerHTML={{ __html: fullEmail.bodyHtml }} className="text-slate-600 text-[15px] leading-relaxed email-content-wrapper" />
                                ) : (
                                    <p className="whitespace-pre-wrap text-slate-600 text-[15px] leading-relaxed">
                                        {fullEmail.bodyText || fullEmail.text}
                                    </p>
                                )}
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-slate-50">
                                <button 
                                    onClick={() => {
                                        setComposeTo(fullEmail.fromEmail || fullEmail.from);
                                        setComposeSubject(`Re: ${fullEmail.subject}`);
                                        setActiveTab('compose');
                                        closeEmailDetail();
                                    }}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COMPOSE LAYOUT OVERLAY */}
            {!selectedEmailId && activeTab === 'compose' && (
                <div className="flex-1 flex flex-col p-8 items-center bg-[#f8fafc] overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                        <header className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">New Message</h2>
                            <button onClick={() => setActiveTab('inbox')} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleSendEmail} className="p-8 space-y-6">
                            <div className="grid gap-6">
                                {role === 'SUPER_ADMIN' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">From Account</label>
                                        <select 
                                            value={selectedAccount} 
                                            onChange={(e) => setSelectedAccount(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                                        >
                                            <option value="">Default (support@fonzkart.in)</option>
                                            {accounts.map(acc => (
                                            <option key={acc.email} value={acc.email}>{acc.email}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Recipient</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={composeTo}
                                        onChange={(e) => setComposeTo(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={composeSubject}
                                        onChange={(e) => setComposeSubject(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Message Content</label>
                                    <textarea 
                                        required
                                        rows={10}
                                        value={composeBody}
                                        onChange={(e) => setComposeBody(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                                        placeholder="Write your email here..."
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Attachments</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const files = Array.from(e.target.files);
                                                setAttachments(prev => [...prev, ...files]);
                                            }
                                        }}
                                        className="hidden" 
                                        id="attachment-input"
                                    />
                                    <label 
                                        htmlFor="attachment-input"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 cursor-pointer hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors border border-emerald-100"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Files
                                    </label>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSending}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:grayscale"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isSending ? 'Sending...' : 'Dispatch Message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MANAGE ACCOUNTS (SUPER ADMIN) */}
            {!selectedEmailId && activeTab === 'manage' && role === 'SUPER_ADMIN' && (
                <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Accounts</h2>
                            <p className="text-slate-500">Manage system-wide webmail identities and provisioning.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-emerald-500" />
                                    Provision New Identity
                                </h3>
                                <form onSubmit={handleSendEmail} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase pl-1">Email Alias</label>
                                        <div className="flex">
                                            <input 
                                                type="text" 
                                                required
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="flex-1 p-3 bg-slate-50 border-none rounded-l-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                                                placeholder="e.g. partner"
                                            />
                                            <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 rounded-r-2xl font-bold text-sm">
                                                @fonzkart.in
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase pl-1">Access Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                                            placeholder="Secure key"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleCreateAccount}
                                        disabled={isCreating}
                                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {isCreating ? 'Deploying...' : 'Initialize Mailbox'}
                                    </button>
                                </form>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    Active Mailboxes
                                </h3>
                                <div className="space-y-3">
                                    {accounts.length === 0 ? (
                                        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                                            <p className="text-slate-400 text-sm">No accounts found.</p>
                                        </div>
                                    ) : (
                                        accounts.map((acc) => (
                                            <div key={acc.email} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                                        <User className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{acc.email}</p>
                                                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active & Routed</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
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

  async function handleCreateAccount(e: any) {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/email/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      if (res.ok) {
        alert('Account created successfully');
        setNewEmail('');
        setNewPassword('');
        fetchAccounts();
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (e) {
      alert('Error creating account');
    } finally {
      setIsCreating(false);
    }
  }
}
