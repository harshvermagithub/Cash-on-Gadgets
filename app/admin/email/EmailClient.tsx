"use client";
import { useState, useEffect } from 'react';
import { fetchRoleBasedEmails } from '@/actions/email-hub';

export default function EmailClient({ role, userEmail }: { role: string, userEmail: string }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose' | 'manage'>('inbox');
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Compose State
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Manage Accounts State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEmails();
    if (role === 'SUPER_ADMIN') {
        fetchAccounts();
    }
  }, []);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoleBasedEmails();
      setEmails(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/email/account');
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
        if (data.accounts.length > 0 && !selectedAccount) {
          setSelectedAccount(data.accounts[0].email);
        }
      }
    } catch (e) {
      console.error(e);
    }
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

      const res = await fetch('/api/email/send', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Email sent successfully');
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        fetchEmails(); // Refresh outbox
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

  const handleCreateAccount = async (e: React.FormEvent) => {
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
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Type', 'Date', 'From', 'To', 'Subject', 'Content'];
    csvRows.push(headers.join(','));

    emails.forEach(email => {
      const type = email.isOutbound ? 'Sent' : 'Received';
      const values = [
        type,
        new Date(email.date).toISOString(),
        email.fromEmail,
        email.toEmail,
        `"${(email.subject || '').replace(/"/g, '""')}"`,
        `"${(email.text || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ];
      csvRows.push(values.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'fonzkart_emails_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const inboxEmails = emails.filter(e => !e.isOutbound);
  const sentEmails = emails.filter(e => e.isOutbound);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mailbox Core</h1>
        <button 
            onClick={exportToCSV}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
        >
            Export All to CSV
        </button>
      </div>
      
      <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button 
          className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'inbox' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inbox')}
        >
          Received Inbox ({inboxEmails.length})
        </button>
        <button 
          className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'sent' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Emails ({sentEmails.length})
        </button>
        <button 
          className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'compose' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('compose')}
        >
          Compose Message
        </button>
        {role === 'SUPER_ADMIN' && (
          <button 
            className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'manage' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Accounts (Super Admin)
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
        
        {/* INBOX TAB */}
        {activeTab === 'inbox' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Incoming Emails</h2>
              <button 
                onClick={fetchEmails}
                disabled={isLoading}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                {isLoading ? 'Syncing...' : 'Force Sync IMAP'}
              </button>
            </div>
            
            {isLoading && inboxEmails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Syncing with Mail Server...</p>
            ) : inboxEmails.length === 0 ? (
              <p className="text-gray-400 text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">No incoming emails found for your access level.</p>
            ) : (
              <div className="space-y-4">
                {inboxEmails.map((email: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-5 hover:border-emerald-200 hover:shadow-sm transition-all bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-bold text-gray-900">{email.fromEmail}</span>
                        <p className="text-gray-600 font-medium mt-1">{email.subject}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {new Date(email.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">{email.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SENT TAB */}
        {activeTab === 'sent' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Outbound Emails</h2>
            </div>
            
            {isLoading && sentEmails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Loading sent items...</p>
            ) : sentEmails.length === 0 ? (
              <p className="text-gray-400 text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">No outbound emails recorded in ledger.</p>
            ) : (
              <div className="space-y-4">
                {sentEmails.map((email: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-5 hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">To: <span className="font-bold text-gray-800 lowercase">{email.toEmail}</span></p>
                        <p className="text-gray-700 font-medium">{email.subject}</p>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        {new Date(email.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">{email.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPOSE TAB */}
        {activeTab === 'compose' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Dispatch New Message</h2>
            <form onSubmit={handleSendEmail} className="space-y-5 max-w-2xl bg-gray-50 p-6 rounded-xl border border-gray-100">
              
              {role === 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Send As Account:</label>
                  <select 
                    value={selectedAccount} 
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  >
                    <option value="">Default (support@fonzkart.in)</option>
                    {accounts.map(acc => (
                      <option key={acc.email} value={acc.email}>{acc.email}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Recipient To:</label>
                <input 
                  type="email" 
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  placeholder="Drop email address here..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject Heading:</label>
                <input 
                  type="text" 
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  placeholder="System Notification"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Body Message:</label>
                <textarea 
                  required
                  rows={8}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  placeholder="Start typing your email..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSending ? 'Sending Payload...' : 'Send Message Now'}
              </button>
            </form>
          </div>
        )}

        {/* CREATE ACCOUNT TAB (SUPER ADMIN ONLY) */}
        {activeTab === 'manage' && role === 'SUPER_ADMIN' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Provision Webmail Account</h2>
            <p className="text-gray-500 mb-6 text-sm">This instantly sets up a physical inbox inside the Mailserver container.</p>
            
            <form onSubmit={handleCreateAccount} className="space-y-4 max-w-md bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Alias</label>
                <div className="flex">
                  <input 
                    type="text" 
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-l-md focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="partner"
                  />
                  <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-200 text-gray-600 rounded-r-md font-medium">
                    @fonzkart.in
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Encryption key"
                  minLength={8}
                />
              </div>
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-md font-bold transition-colors shadow-md disabled:opacity-50"
              >
                {isCreating ? 'Provisioning...' : 'Deploy Mailbox'}
              </button>
            </form>

            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Active Deployments</h3>
              <div className="bg-white border text-gray-700 border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {accounts.length === 0 ? (
                  <div className="p-6 text-gray-500 text-sm text-center">No system accounts detected.</div>
                ) : (
                  accounts.map((acc, index) => (
                    <div key={acc.email} className={`p-4 flex justify-between items-center ${index !== accounts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <span className="font-semibold text-gray-800">{acc.email}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
