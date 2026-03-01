'use client';

import { useState } from 'react';
import { Mail, Send, Reply, X, Loader2 } from 'lucide-react';
import { sendEmail } from '@/actions/email';

export type EmailMessageType = {
    id: string;
    from: string;
    to: string;
    subject: string | null;
    bodyText: string | null;
    bodyHtml: string | null;
    receivedAt: Date | string;
    isOutbound: boolean;
};

export default function InboxClient({ initialEmails }: { initialEmails: EmailMessageType[] }) {
    const [selectedEmail, setSelectedEmail] = useState<EmailMessageType | null>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [replyTo, setReplyTo] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompose = (to: string = '') => {
        setReplyTo(to);
        setIsComposing(true);
        setSelectedEmail(null);
    };

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await sendEmail(null, formData);

        if (result.error) {
            setError(result.error);
        } else {
            setIsComposing(false);
            window.location.reload(); // Refresh the list from server safely
        }
        setSending(false);
    };

    return (
        <div className="flex w-full h-full">
            {/* List Sidebar */}
            <div className="w-1/3 border-r flex flex-col h-full bg-card">
                <div className="p-4 border-b shrink-0 flex items-center justify-between">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" /> Inbox
                    </h2>
                    <button
                        onClick={() => handleCompose()}
                        className="bg-primary text-primary-foreground p-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-1"
                    >
                        <Send className="w-4 h-4" /> Compose
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {initialEmails.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No emails found.
                        </div>
                    ) : (
                        initialEmails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => { setSelectedEmail(email); setIsComposing(false); }}
                                className={`p-4 rounded-lg cursor-pointer transition-colors border ${selectedEmail?.id === email.id ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm truncate pr-2">
                                        {email.isOutbound ? 'To: ' + email.to : email.from}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(email.receivedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-sm font-medium mb-1 truncate">{email.subject || 'No Subject'}</div>
                                <div className="text-xs text-muted-foreground truncate line-clamp-2">
                                    {email.bodyText || 'No Preview'}
                                </div>
                                {email.isOutbound && (
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground uppercase tracking-wider">
                                        Outbound
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="w-2/3 flex flex-col h-full bg-background relative">
                {isComposing ? (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b flex justify-between items-center bg-card shrink-0">
                            <h3 className="font-semibold text-lg">New Message</h3>
                            <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-muted rounded-md text-muted-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSend} className="p-6 flex-1 flex flex-col overflow-y-auto space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">To:</label>
                                <input
                                    name="to"
                                    type="email"
                                    required
                                    defaultValue={replyTo}
                                    className="w-full p-2 border rounded-md outline-none focus:border-primary"
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Subject:</label>
                                <input
                                    name="subject"
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-md outline-none focus:border-primary"
                                    placeholder="Order Update"
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Message:</label>
                                <textarea
                                    name="bodyText"
                                    required
                                    className="flex-1 w-full p-4 border rounded-md outline-none focus:border-primary resize-none font-sans"
                                    placeholder="Write your email here..."
                                />
                            </div>
                            <div className="flex justify-end pt-4 shrink-0 border-t">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-opacity"
                                >
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Email
                                </button>
                            </div>
                        </form>
                    </div>
                ) : selectedEmail ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b shrink-0 bg-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">{selectedEmail.subject || 'No Subject'}</h3>
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <div><span className="font-medium text-foreground">From:</span> {selectedEmail.from}</div>
                                        <div><span className="font-medium text-foreground">To:</span> {selectedEmail.to}</div>
                                        <div className="text-xs mt-2">{new Date(selectedEmail.receivedAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                {!selectedEmail.isOutbound && (
                                    <button
                                        onClick={() => handleCompose(selectedEmail.from)}
                                        className="p-2 border rounded hover:bg-muted text-muted-foreground flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Reply className="w-4 h-4" /> Reply
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto leading-relaxed border-t border-muted/30">
                            {selectedEmail.bodyHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }} />
                            ) : (
                                <pre className="font-sans whitespace-pre-wrap">{selectedEmail.bodyText}</pre>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-accent/10">
                        <Mail className="w-16 h-16 text-muted mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-foreground">No Conversation Selected</h3>
                        <p className="max-w-md">Select an email from the list on the left to read its contents, or compose a new email.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
