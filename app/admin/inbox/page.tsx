import { getEmails } from '@/actions/email';
import InboxClient from './InboxClient';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
    const emails = await getEmails();

    return (
        <div className="flex flex-col h-full bg-muted/20">
            <div className="p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Mail Inbox</h1>
                    <p className="text-muted-foreground mt-2">Manage incoming and outgoing support emails via Fonzkart Support.</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden px-6 pb-6">
                <div className="bg-card border rounded-xl h-[calc(100vh-12rem)] shadow-sm flex overflow-hidden">
                    <InboxClient initialEmails={emails} />
                </div>
            </div>
        </div>
    );
}
