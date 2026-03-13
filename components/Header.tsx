
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { getSession, logout, isAdmin } from '@/lib/session';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';

export default async function Header() {
    const session = await getSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md overflow-visible">
            <div className="container mx-auto flex h-16 items-start justify-between px-4 md:px-6 pt-3 overflow-visible">
                <Link href="/" className="flex items-start gap-2 overflow-visible mt-2">
                    <Logo className="w-auto h-full max-h-16 py-1 text-primary" />
                </Link>

                <nav className="flex items-center gap-6">
                    <NavLinks session={session} isAdminUser={session ? isAdmin(session.user) : false} />
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <ThemeToggle />

                    {session ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium">
                                <User className="h-4 w-4" />
                                <span className="hidden md:inline-block">Hi, {session.user?.name}</span>
                            </Link>
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
