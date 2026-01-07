
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-0.5">
                            {/* Single Line Logo with CSS Variables */}
                            <Logo />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            The smartest way to sell your old gadgets. Get instant quotes, free doorstep pickup, and instant payment.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Services</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/sell?category=smartphone" className="hover:text-green-600 transition-colors">Sell Smartphone</Link></li>
                            <li><Link href="/sell?category=tablet" className="hover:text-green-600 transition-colors">Sell Tablet</Link></li>
                            <li><Link href="/sell?category=laptop" className="hover:text-green-600 transition-colors">Sell Laptop</Link></li>
                            <li><Link href="/sell?category=console" className="hover:text-green-600 transition-colors">Sell Console</Link></li>
                            <li><Link href="/sell?category=tv" className="hover:text-green-600 transition-colors">Sell Smart TV</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-green-600 transition-colors">How it Works</Link></li>
                            <li><Link href="/careers" className="hover:text-green-600 transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-green-600 transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-green-600 shrink-0" />
                                <span>+91 90603 36060</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-green-600 shrink-0" />
                                <span>connect@fonzkart.in</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                                <span>Bengaluru, Karnataka, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Fonzkart. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-green-600 transition-colors">Terms</Link>
                        <Link href="/sitemap" className="hover:text-green-600 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
