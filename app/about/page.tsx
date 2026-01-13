import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 space-y-12 max-w-4xl">
            <section className="space-y-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-700 dark:text-green-500 flex items-center justify-center gap-2 flex-wrap">
                    <span>About</span>
                    <span className="inline-flex items-center gap-1">
                        {/* F Replacement: Phone Icon (scaled for heading) */}
                        <div className="relative w-8 h-12 flex items-center justify-center rounded-[6px] border-2 border-slate-700 dark:border-white/20 shadow-inner overflow-hidden bg-black mb-1">
                            {/* Inner Screen */}
                            <div className="w-[85%] h-[85%] rounded-[2px] bg-green-500 overflow-hidden relative">
                                <Image src="/logo_final_v3.png" alt="F" fill className="object-cover" />
                            </div>
                        </div>

                        <span>onzka</span>

                        {/* R Replacement: Note Icon (larger ₹, no 500) */}
                        <div className="relative w-8 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-[4px] border border-emerald-600 dark:border-emerald-400 flex items-center justify-center shadow-sm overflow-hidden mb-1">
                            <span className="text-2xl text-emerald-800 dark:text-emerald-300 font-black">₹</span>
                        </div>

                        <span>t</span>
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Reinventing the way you sell your old gadgets. Simple, Fast, and Secure.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                    At Fonzkart, we believe that selling your used electronics should be as easy as buying new ones.
                    We are dedicated to providing a seamless, transparent, and rewarding experience for our customers.
                    Our mission is to reduce e-waste by extending the lifecycle of gadgets while putting instant cash in your pocket.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Why Choose Us?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-card rounded-xl border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Instant Quotes</h3>
                        <p className="text-sm text-muted-foreground">Get the best price for your device in seconds with our AI-driven pricing engine.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Free Doorstep Pickup</h3>
                        <p className="text-sm text-muted-foreground">Our evaluation expert comes to your location to check the device and pick it up.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Instant Payment</h3>
                        <p className="text-sm text-muted-foreground">Receive payment immediately via UPI or Cash before we leave with your device.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
                        <p className="text-sm text-muted-foreground">We ensure your data is wiped and your device is handled responsibly.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
