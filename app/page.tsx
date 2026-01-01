'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, CheckCircle, Smartphone, Bike, Banknote, Star } from 'lucide-react';
import HeroAnimation from '@/components/HeroAnimation';
import CategorySelector from '@/components/sell/CategorySelector';
import { useRouter } from 'next/navigation';



export default function Home() {
    const router = useRouter();

    const handleCategorySelect = (category: string) => {
        router.push(`/sell?category=${category}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-background">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 fade-in-20 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Trusted by 1,000+ Customers
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                                Smart way to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">sell your phone.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                Experience the smart way to sell. Get maximum value and instant cash at your doorstep—no negotiations, just a seamless, premium service.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/sell"
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-green-500/25 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 group"
                                >
                                    Get Exact Value
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/orders"
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white border border-green-100 text-foreground font-semibold text-lg hover:bg-green-50 transition-all duration-300"
                                >
                                    Track Order
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" /> Instant Payment
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" /> Doorstep Pickup
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" /> Safe & Secure
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative w-full h-[500px] max-w-[600px] animate-in zoom-in-50 fade-in duration-1000 delay-200 perspective-1000 flex items-center justify-center">
                            <HeroAnimation />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Selection Section */}
            <section className="py-20 bg-muted/30 border-y">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <CategorySelector onSelect={handleCategorySelect} />
                    </div>
                </div>
            </section>

            {/* Brands Marquee & Stats Section */}
            <section className="py-12 border-y bg-emerald-50/50">
                <div className="container mx-auto px-6 mb-12">
                    <p className="text-center text-sm font-semibold text-green-700/60 uppercase tracking-wider mb-8">We Accept All Major Brands</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 items-center">
                        {/* Simple Text Logos for Brands (keeping it cleaner than icons for now) */}
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">Apple</span>
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">Samsung</span>
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">OnePlus</span>
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">Xiaomi</span>
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">Vivo</span>
                        <span className="text-2xl font-bold text-gray-400 hover:text-green-800 transition-colors cursor-default">Oppo</span>
                    </div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-green-200/50">
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50K+</h3>
                            <p className="text-sm text-muted-foreground font-medium">Gadgets Sold</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">₹10Cr+</h3>
                            <p className="text-sm text-muted-foreground font-medium">Cash Paid</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">100+</h3>
                            <p className="text-sm text-muted-foreground font-medium">Cities Covered</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-lime-600 mb-2">4.8★</h3>
                            <p className="text-sm text-muted-foreground font-medium">User Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section - Dynamic & Animated */}
            <section className="py-24 bg-background overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-[100px] opacity-30 -z-10" />
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-green-900"
                        >
                            HOW IT WORKS
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1: Valuation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center space-y-6 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated Phone Element */}
                                <div className="relative w-32 h-56 bg-slate-900 rounded-[2rem] border-4 border-slate-800 shadow-2xl flex flex-col items-center overflow-hidden">
                                    <div className="w-12 h-4 bg-black rounded-b-xl mb-2 z-10" />
                                    <div className="w-full flex-1 bg-slate-800 p-2 flex flex-col items-center justify-center gap-3">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"
                                        >
                                            <Smartphone className="w-6 h-6 text-green-400" />
                                        </motion.div>
                                        <div className="space-y-1 w-full px-2">
                                            <motion.div
                                                initial={{ width: "20%" }}
                                                whileInView={{ width: "80%" }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-1.5 bg-slate-600 rounded-full"
                                            />
                                            <motion.div
                                                initial={{ width: "20%" }}
                                                whileInView={{ width: "60%" }}
                                                transition={{ duration: 1, delay: 0.7 }}
                                                className="h-1.5 bg-slate-600 rounded-full"
                                            />
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 1 }}
                                            className="px-3 py-1 bg-emerald-500 text-[10px] font-bold text-white rounded-full mt-2"
                                        >
                                            ₹15,000
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-lg relative z-10 ring-4 ring-background">1</div>
                            </div>
                            <h3 className="text-xl font-bold text-green-900">Get Your Device Valuation</h3>
                            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                                Answer a few questions about your phone condition and get the best price.
                            </p>
                        </motion.div>

                        {/* Step 2: Pickup */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col items-center text-center space-y-6 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated Bike Element */}
                                <div className="relative">
                                    <motion.div
                                        animate={{ x: [-10, 10, -10] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Bike className="w-24 h-24 text-teal-600 drop-shadow-lg" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ x: [10, -10, 10], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -bottom-2 w-full h-3 bg-black/10 rounded-full blur-md"
                                    />
                                </div>
                            </motion.div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-lg relative z-10 ring-4 ring-background">2</div>
                            </div>
                            <h3 className="text-xl font-bold text-green-900">Schedule Pickup</h3>
                            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                                Choose a time slot of your convenience. Our field agent will give you a visit at your chosen time and place.
                            </p>
                        </motion.div>

                        {/* Step 3: Get Paid */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col items-center text-center space-y-6 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-lime-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated Cash Element */}
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            y: [0, -5, 0]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="relative z-10"
                                    >
                                        <Banknote className="w-24 h-24 text-lime-600 drop-shadow-lg" />
                                        <motion.div
                                            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0, 1, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-6 -right-6"
                                        >
                                            <div className="bg-yellow-400 text-black font-bold text-xs px-2 py-1 rounded-full shadow-lg border border-yellow-200">
                                                PAID
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-lime-600 flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-lg relative z-10 ring-4 ring-background">3</div>
                            </div>
                            <h3 className="text-xl font-bold text-green-900">Get Paid</h3>
                            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                                Get paid instantly at your doorstep once your device is verified. No delays, no hidden charges.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold">Loved by 1000+ Customers</h2>
                            <p className="text-muted-foreground">Don&apos;t just take our word for it. Here&apos;s what people are saying about Fonzkart.</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(v => <Star key={v} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                            <span className="ml-2 font-bold text-lg">4.9/5 Rating</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Rahul Sharma",
                                role: "Software Engineer",
                                text: "Sold my iPhone 13. The price was exactly what was quoted on the site. No hidden deductions. Executive was polite.",
                                initial: "R"
                            },
                            {
                                name: "Priya Patel",
                                role: "Student",
                                text: "Honestly simpler than I thought. I needed cash urgently for my new phone, and they paid via UPI instantly at my doorstep.",
                                initial: "P"
                            },
                            {
                                name: "Amit Kumar",
                                role: "Business Owner",
                                text: "Used Cashify before but Fonzkart gave me ₹2000 more for the same device. Highly recommended for the best price.",
                                initial: "A"
                            }
                        ].map((review, i) => (
                            <div key={i} className="p-8 bg-card border rounded-3xl space-y-6 hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(v => <Star key={v} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-lg leading-relaxed">&quot;{review.text}&quot;</p>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {review.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{review.name}</h4>
                                        <p className="text-xs text-muted-foreground">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section - Dynamic & Animated */}
            <section className="py-24 bg-green-50/30 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-green-900"
                        >
                            WHY CHOOSE US
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1: Prices */}
                        <motion.div
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-6 bg-white/60 p-6 rounded-3xl border border-transparent hover:border-green-200 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-green-100/50 rounded-2xl group-hover:bg-green-100 transition-colors">
                                <motion.div
                                    animate={{ rotateY: [0, 180, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center bg-white shadow-sm"
                                >
                                    <span className="font-bold text-green-700 text-xl">₹</span>
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold group-hover:text-green-700 transition-colors">Amazing Prices</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Buying or selling, we guarantee the best market rates for your device.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 2: Speed */}
                        <motion.div
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center gap-6 bg-white/60 p-6 rounded-3xl border border-transparent hover:border-teal-200 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-teal-100/50 rounded-2xl group-hover:bg-teal-100 transition-colors">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Zap className="w-10 h-10 text-teal-500 fill-teal-500" />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold group-hover:text-teal-600 transition-colors">Quick & Fast Service</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Get mobile in a click at your home/office instantly. No waiting.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 3: Safety */}
                        <motion.div
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-6 bg-white/60 p-6 rounded-3xl border border-transparent hover:border-lime-200 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-lime-100/50 rounded-2xl group-hover:bg-lime-100 transition-colors">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ShieldCheck className="w-10 h-10 text-green-600" />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">Safety Guaranteed</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We are the safest hands for your device security. 100% Data Wipe.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
