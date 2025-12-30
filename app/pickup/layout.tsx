
import Link from 'next/link';

export default function PickupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="px-6 py-4 border-b bg-card">
                <Link href="/pickup" className="font-bold text-xl text-primary flex items-center gap-2">
                    Connect
                </Link>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
