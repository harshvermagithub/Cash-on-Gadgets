
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { getSession, logout } from '@/lib/session';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './Logo';

export default async function Header() {
    const session = await getSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md overflow-visible">
            <div className="container mx-auto flex h-16 items-start justify-between px-4 md:px-6 pt-3 overflow-visible">
                <Link href="/" className="flex items-start gap-2 overflow-visible mt-2">
                    <Logo className="w-auto h-full max-h-16 py-1 text-primary" />
                </Link>

                <nav className="flex items-center gap-4">
                    <Link href="/sell" className="text-sm font-medium hover:text-primary transition-colors">
                        Sell Phone
                    </Link>
                    <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                        My Orders
                    </Link>
                    {session && (
                        <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                            Admin Panel
                        </Link>
                    )}
                    <ThemeToggle />

                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden md:inline-block">Hi, {session.user?.name}</span>
                            <form action={async () => {
                                'use server';
                                await logout();
                            }}>
                                <button className="flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                                <User className="h-4 w-4" />
                                Login
                            </button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
