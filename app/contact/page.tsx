'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, Recycle, Building2, ShieldCheck, Truck } from 'lucide-react';

function ContactContent() {
    const searchParams = useSearchParams();
    const isBulk = searchParams.get('topic') === 'bulk';

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
            <h1 className="text-4xl font-bold text-center mb-4 text-green-700 dark:text-green-500">
                {isBulk ? 'Bulk Selling & E-Waste Recycling' : 'Contact Us'}
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                {isBulk
                    ? 'Looking to liquidate corporate IT assets, bulk gadgets, or recycle e-waste responsibly? Get custom pricing & doorstep logistics.'
                    : 'Have questions about selling your device? We are here to help.'}
            </p>

            {/* Bulk Banner Info */}
            {isBulk && (
                <div className="mb-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Recycle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Corporate & Bulk Asset Recycling Program</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                We help businesses, institutions, and bulk sellers monetize old electronics with certified data sanitization and eco-friendly recycling.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center gap-3 bg-background/80 p-3.5 rounded-xl border">
                            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-xs font-semibold">Corporate IT Liquidation</span>
                        </div>
                        <div className="flex items-center gap-3 bg-background/80 p-3.5 rounded-xl border">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-xs font-semibold">Data Wipe Guarantee</span>
                        </div>
                        <div className="flex items-center gap-3 bg-background/80 p-3.5 rounded-xl border">
                            <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-xs font-semibold">Free Bulk Pickup & Instant Pay</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Get in Touch</h2>
                        <p className="text-muted-foreground">Reach out to our team directly for inquiries, quotes, or bulk partnerships.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-10 h-10 bg-green-100 dark:bg-green-950/60 rounded-lg flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Phone & WhatsApp</h3>
                                <p className="text-sm text-muted-foreground">+91 90603 36060</p>
                                <p className="text-xs text-muted-foreground mt-1">Mon-Sat, 10am - 7pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-10 h-10 bg-green-100 dark:bg-green-950/60 rounded-lg flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-sm text-muted-foreground">connect@fonzkart.in</p>
                                <p className="text-xs text-muted-foreground mt-1">CEO Direct: ceo@fonzkart.in</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-10 h-10 bg-green-100 dark:bg-green-950/60 rounded-lg flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Headquarters</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bengaluru, Karnataka, India.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input type="text" id="name" className="w-full p-2 rounded-md border bg-background" placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                <input type="tel" id="phone" className="w-full p-2 rounded-md border bg-background" placeholder="Your phone" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input type="email" id="email" className="w-full p-2 rounded-md border bg-background" placeholder="your@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="inquiryType" className="text-sm font-medium">Inquiry Type</label>
                            <select id="inquiryType" defaultValue={isBulk ? "bulk" : "general"} className="w-full p-2 rounded-md border bg-background text-sm">
                                <option value="general">General Inquiry / Device Quote</option>
                                <option value="bulk">Bulk Selling & Corporate Recycling</option>
                                <option value="partner">Franchise & Partner Support</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full p-2 rounded-md border bg-background resize-none"
                                defaultValue={isBulk ? "Hi, I have a bulk quantity of devices/corporate assets for selling or e-waste recycling. Please contact me with details." : ""}
                                placeholder="How can we help?"
                            ></textarea>
                        </div>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors">
                            <Send className="w-4 h-4" /> Send Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading contact page...</div>}>
            <ContactContent />
        </Suspense>
    );
}

