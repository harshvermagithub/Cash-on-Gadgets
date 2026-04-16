import { useState, useEffect } from 'react';

export default function EmailDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'inbox' | 'compose'>('inbox');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  
  // Create Account State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Inbox State
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  
  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (activeTab === 'inbox' && selectedAccount) {
      fetchInbox();
    }
  }, [activeTab, selectedAccount]);

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

  const fetchInbox = async () => {
    setIsLoadingInbox(true);
    try {
      const res = await fetch(`/api/email/inbox?account=${selectedAccount}`);
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInbox(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fromAccount: selectedAccount, 
          to: composeTo, 
          subject: composeSubject, 
          text: composeBody 
        }),
      });
      if (res.ok) {
        alert('Email sent successfully');
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Email Dashboard</h1>
      
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          className={`pb-2 px-4 ${activeTab === 'inbox' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('inbox')}
        >
          Inbox
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'compose' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('compose')}
        >
          Compose
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'create' ? 'border-b-2 border-emerald-500 text-emerald-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Manage Accounts
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        
        {/* Account Selector (Shared across Compose and Inbox) */}
        {(activeTab === 'inbox' || activeTab === 'compose') && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Account to Use:</label>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select an account</option>
              {accounts.map(acc => (
                <option key={acc.email} value={acc.email}>{acc.email}</option>
              ))}
            </select>
          </div>
        )}

        {/* INBOX TAB */}
        {activeTab === 'inbox' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Inbox {selectedAccount && `(${selectedAccount})`}</h2>
              <button 
                onClick={fetchInbox}
                disabled={isLoadingInbox || !selectedAccount}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isLoadingInbox ? 'Refreshing...' : 'Refresh Inbox'}
              </button>
            </div>
            
            {!selectedAccount ? (
              <p className="text-gray-500 text-center py-8">Please select an account above or create one.</p>
            ) : isLoadingInbox && emails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Loading emails...</p>
            ) : emails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Inbox is empty.</p>
            ) : (
              <div className="space-y-4">
                {emails.map((email: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">{email.from}</span>
                        <p className="text-gray-600 text-sm">{email.subject}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(email.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-3 line-clamp-3 bg-white p-3 rounded border border-gray-100">{email.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPOSE TAB */}
        {activeTab === 'compose' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send New Email</h2>
            <form onSubmit={handleSendEmail} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input 
                  type="email" 
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Hello there"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={8}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Write your email here..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSending || !selectedAccount}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        {/* CREATE ACCOUNT TAB */}
        {activeTab === 'create' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Email Account</h2>
            <p className="text-gray-500 mb-6 text-sm">This will create a new webmail account on mail.fonzkart.in.</p>
            
            <form onSubmit={handleCreateAccount} className="space-y-4 max-w-md bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex">
                  <input 
                    type="text" 
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="support"
                  />
                  <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-100 text-gray-500 rounded-r-md">
                    @fonzkart.in
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Strong password"
                  minLength={8}
                />
              </div>
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating Account...' : 'Create Email Account'}
              </button>
            </form>

            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Existing Accounts</h3>
              <div className="bg-white border text-gray-700 border-gray-200 rounded-md shadow-sm divide-y divide-gray-100">
                {accounts.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm text-center">No accounts found. Create one above!</div>
                ) : (
                  accounts.map(acc => (
                    <div key={acc.email} className="p-4 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{acc.email}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">Active</span>
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
