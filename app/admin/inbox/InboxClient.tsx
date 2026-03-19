'use client';

import { useState, useRef, useTransition } from 'react';
import { Mail, Send, Reply, X, Loader2, CheckCircle2, AlertCircle, Inbox, PenSquare } from 'lucide-react';
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

type ComposeState = {
    to: string;
    subject: string;
};

export default function InboxClient({ initialEmails }: { initialEmails: EmailMessageType[] }) {
    const [emails, setEmails] = useState<EmailMessageType[]>(initialEmails);
    const [selectedEmail, setSelectedEmail] = useState<EmailMessageType | null>(null);
    const [compose, setCompose] = useState<ComposeState | null>(null);
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const openCompose = (to = '', subject = '') => {
        setCompose({ to, subject });
        setSelectedEmail(null);
        setFeedback(null);
    };

    const openReply = (email: EmailMessageType) => {
        const replySubject = email.subject?.startsWith('Re:')
            ? email.subject
            : `Re: ${email.subject || ''}`;
        openCompose(email.from, replySubject);
    };

    const closeCompose = () => {
        setCompose(null);
        setFeedback(null);
    };

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const to = formData.get('to') as string;
        const subject = formData.get('subject') as string;
        const bodyText = formData.get('bodyText') as string;

        setFeedback(null);

        startTransition(async () => {
            const result = await sendEmail(null, formData);

            if (result.error) {
                setFeedback({ type: 'error', message: result.error });
            } else {
                // Optimistically prepend the sent email to the list
                const optimisticEmail: EmailMessageType = {
                    id: `optimistic-${Date.now()}`,
                    from: '"Fonzkart Support" <support@fonzkart.in>',
                    to,
                    subject,
                    bodyText,
                    bodyHtml: null,
                    receivedAt: new Date(),
                    isOutbound: true,
                };
                setEmails(prev => [optimisticEmail, ...prev]);
                setFeedback({ type: 'success', message: 'Email sent successfully!' });
                // Auto-close compose after short delay
                setTimeout(() => {
                    closeCompose();
                    setSelectedEmail(optimisticEmail);
                }, 1200);
            }
        });
    };

    return (
        <div className="flex w-full h-full">
            {/* ─── Email List Sidebar ─────────────────────────────── */}
            <div className="w-1/3 border-r flex flex-col h-full bg-card">
                <div className="p-4 border-b shrink-0 flex items-center justify-between">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-primary" /> Inbox
                    </h2>
                    <button
                        onClick={() => openCompose()}
                        className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-1.5 transition-colors"
                    >
                        <PenSquare className="w-4 h-4" /> Compose
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {emails.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No emails yet.
                        </div>
                    ) : (
                        emails.map((email) => (
                            <button
                                key={email.id}
                                onClick={() => { setSelectedEmail(email); setCompose(null); setFeedback(null); }}
                                className={`w-full text-left p-3.5 rounded-lg cursor-pointer transition-all border ${
                                    selectedEmail?.id === email.id
                                        ? 'bg-primary/10 border-primary/30 shadow-sm'
                                        : 'bg-transparent hover:bg-muted border-transparent'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="font-semibold text-sm truncate pr-2 text-foreground">
                                        {email.isOutbound ? `To: ${email.to}` : email.from}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                                        {new Date(email.receivedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-sm font-medium truncate text-foreground/80">
                                    {email.subject || 'No Subject'}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                    {email.bodyText || 'No preview'}
                                </div>
                                {email.isOutbound && (
                                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                                        Sent
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ─── Content Panel ──────────────────────────────────── */}
            <div className="w-2/3 flex flex-col h-full bg-background relative">

                {/* ── Compose View ── */}
                {compose !== null ? (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b flex justify-between items-center bg-card shrink-0">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Send className="w-4 h-4 text-primary" /> New Message
                            </h3>
                            <button
                                onClick={closeCompose}
                                className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                                title="Discard"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form ref={formRef} onSubmit={handleSend} className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">

                            {/* Feedback banner */}
                            {feedback && (
                                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium border ${
                                    feedback.type === 'success'
                                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800'
                                        : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                                }`}>
                                    {feedback.type === 'success'
                                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        : <AlertCircle className="w-4 h-4 shrink-0" />
                                    }
                                    {feedback.message}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
                                    To
                                </label>
                                <input
                                    name="to"
                                    type="email"
                                    required
                                    defaultValue={compose.to}
                                    className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                                    placeholder="customer@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
                                    Subject
                                </label>
                                <input
                                    name="subject"
                                    type="text"
                                    required
                                    defaultValue={compose.subject}
                                    className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                                    placeholder="e.g. Order Update – FZK-00142"
                                />
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
                                    Message
                                </label>
                                <textarea
                                    name="bodyText"
                                    required
                                    className="flex-1 w-full px-3 py-3 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-sans bg-background min-h-[200px]"
                                    placeholder="Write your message here…"
                                />
                            </div>

                            <div className="flex justify-end pt-2 shrink-0 border-t">
                                <button
                                    type="button"
                                    onClick={closeCompose}
                                    className="px-5 py-2 mr-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-all text-sm shadow-sm"
                                >
                                    {isPending
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                                        : <><Send className="w-4 h-4" /> Send Email</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                /* ── Email Read View ── */
                ) : selectedEmail ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b shrink-0 bg-card">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold mb-3 text-foreground">
                                        {selectedEmail.subject || 'No Subject'}
                                    </h3>
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <div>
                                            <span className="font-semibold text-foreground">From: </span>
                                            {selectedEmail.from}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-foreground">To: </span>
                                            {selectedEmail.to}
                                        </div>
                                        <div className="text-xs mt-1 text-muted-foreground/70">
                                            {new Date(selectedEmail.receivedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                {!selectedEmail.isOutbound && (
                                    <button
                                        onClick={() => openReply(selectedEmail)}
                                        className="shrink-0 flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-muted text-foreground transition-colors"
                                    >
                                        <Reply className="w-4 h-4" /> Reply
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto leading-relaxed">
                            {selectedEmail.bodyHtml ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                                />
                            ) : (
                                <pre className="font-sans whitespace-pre-wrap text-sm text-foreground/90">
                                    {selectedEmail.bodyText || 'No content.'}
                                </pre>
                            )}
                        </div>
                    </div>

                /* ── Empty State ── */
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-accent/10">
                        <Mail className="w-16 h-16 text-muted mb-4 opacity-40" />
                        <h3 className="text-xl font-semibold mb-2 text-foreground">No Conversation Selected</h3>
                        <p className="max-w-xs text-sm">
                            Pick an email from the list, or compose a new one to get started.
                        </p>
                        <button
                            onClick={() => openCompose()}
                            className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow"
                        >
                            <PenSquare className="w-4 h-4" /> Compose New Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
