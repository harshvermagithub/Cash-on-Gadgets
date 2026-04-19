import Link from 'next/link';
import { getExecutiveSession } from '@/actions/executive';
import { NotificationProvider } from '@/components/NotificationProvider';
import { NotificationBell } from '@/components/admin/NotificationBell';

export default async function PickupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const executive = await getExecutiveSession();

    return (
        <NotificationProvider riderId={executive?.id}>
            <div className="min-h-screen bg-background flex flex-col">
                <header className="px-6 h-16 border-b bg-card flex items-center justify-between sticky top-0 z-20">
                    <Link href="/pickup" className="font-bold text-lg text-emerald-500 flex items-center gap-2">
                        Field Executive Portal
                    </Link>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/20">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </NotificationProvider>
    );
}
