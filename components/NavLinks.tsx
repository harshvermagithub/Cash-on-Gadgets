'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export function NavLinks({ session, isAdminUser }: { session: any, isAdminUser: boolean }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const links = [
        { href: '/sell', label: 'Check Price' },
        { href: '/orders', label: 'My Orders' },
    ];

    if (session && isAdminUser) {
        links.push({ href: '/admin', label: 'Admin Panel' });
    }

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div className="flex items-center gap-6">
            {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`relative py-2 text-sm font-medium transition-all duration-300 hover:text-primary ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                        {link.label}
                        {isActive && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        )}
                    </Link>
                );
            })}

            {/* View More Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-1 py-2 text-sm font-medium transition-all duration-300 hover:text-primary ${
                        isOpen ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                    View More
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 md:w-[450px] rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-md p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Column 1: Company */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Company</h4>
                                <ul className="space-y-2.5">
                                    <li>
                                        <Link href="/about" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/how-it-works" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            How It Works
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/careers" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Careers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contact" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 2: Legal & Info */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Policies & Info</h4>
                                <ul className="space-y-2.5">
                                    <li>
                                        <Link href="/terms" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Terms of Service
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cancellation-policy" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Cancellation Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/refund-policy" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Refund Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/return-policy" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Return & Exchange Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/sitemap" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                                            Sitemap
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
