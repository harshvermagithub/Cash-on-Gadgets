'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, CheckCircle, Star, Clock, MapPin, BadgePercent } from 'lucide-react';
import HowItWorks from '@/components/HowItWorks';
import HeroAnimation from '@/components/HeroAnimation';
import { ReviewsMarquee } from '@/components/ReviewsMarquee';
import CategorySelector from '@/components/sell/CategorySelector';
import { BigLogo } from '@/components/BigLogo';
import { Logo } from '@/components/Logo';
import { HomeSearch } from '@/components/HomeSearch';
import { BrandRail } from '@/components/BrandRail';
import { HeroLogo } from '@/components/HeroLogo';
import { useRouter } from 'next/navigation';
import { Brand } from '@/lib/store';

export function HomeClient({ initialBrands }: { initialBrands: Brand[] }) {
    const router = useRouter();

    const handleCategorySelect = (category: string) => {
        router.push(`/sell?category=${category}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-0 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-background">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20">
                        <div className="flex-1 animate-in slide-in-from-bottom-8 fade-in-20 duration-700">
                            <div className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Trusted by 1,000+ Customers
                            </div>

                            {/* Custom Big Logo Area - Responsive Split */}

                            {/* Mobile Hero View (Text Banner + Search + Brands) */}
                            <div className="block xl:hidden w-full space-y-6 pt-0 mb-20">


                                {/* Top Chips Section */}
                                <div className="flex flex-wrap justify-center gap-3 px-4 pt-12 pb-12">
                                    {/* Chip 1: Trusted */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 text-black dark:text-white text-[10px] font-bold border border-green-200/50 shadow-sm hover:scale-105 hover:shadow-md transition-all cursor-default">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                        </span>
                                        Trusted by 1,000+ Customers
                                    </div>

                                    {/* Chip 3: Bangalore */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 text-black dark:text-white text-[10px] font-bold border border-green-200/50 shadow-sm hover:scale-105 hover:shadow-md transition-all cursor-default">
                                        <MapPin className="w-3 h-3 text-green-500" />
                                        Pickup All Over Bangalore
                                    </div>
                                </div>

                                <div className="flex justify-center items-center py-32">
                                    <div className="scale-[3.5] origin-center transform flex justify-center items-center">
                                        <Logo />
                                    </div>
                                </div>

                                <HomeSearch />
                                <BrandRail initialBrands={initialBrands} />
                            </div>

                            {/* Desktop/Tablet Hero View (Original BigLogo) */}
                            <div className="hidden xl:block w-full -ml-2">
                                <BigLogo />
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.2] md:leading-[1.1]">
                                Smart way to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">sell your device.</span>
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
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-lg hover:bg-green-50 dark:hover:bg-slate-700 transition-all duration-300"
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

            {/* Brands Marquee & Stats Section - ALWAYS DARK MODE */}
            <section className="py-12 border-y bg-slate-900 border-slate-800">
                <div className="container mx-auto px-6 mb-12">
                    <p className="text-center text-sm font-semibold text-green-400/60 uppercase tracking-wider mb-8">We Accept All Major Brands</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                        <span className="text-2xl font-bold text-slate-200 hover:text-white transition-colors cursor-default">Apple</span>
                        <span className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-default">Samsung</span>
                        <span className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-default">Vivo</span>
                        <span className="text-2xl font-bold text-red-400 hover:text-red-300 transition-colors cursor-default">OnePlus</span>
                        <span className="text-2xl font-bold text-slate-200 hover:text-white transition-colors cursor-default">Nothing</span>
                        <span className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors cursor-default">iQOO</span>
                    </div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-700">
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">5K+</h3>
                            <p className="text-sm text-slate-400 font-medium">Devices Bought</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">₹10L+</h3>
                            <p className="text-sm text-slate-400 font-medium">Cash Paid</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-400 mb-2">Bengaluru</h3>
                            <p className="text-sm text-slate-400 font-medium">& Outskirts Covered</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-lime-400 mb-2">4.8★</h3>
                            <p className="text-sm text-slate-400 font-medium">User Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <HowItWorks />

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

                    <div className="mt-8">
                        <ReviewsMarquee />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section - ALWAYS DARK MODE */}
            <section className="py-24 bg-slate-900 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-green-400"
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
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center gap-6 bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-green-600 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-green-900/20 rounded-2xl group-hover:bg-green-900/40 transition-colors">
                                <motion.div
                                    animate={{ rotateY: [0, 180, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center bg-slate-900 shadow-sm"
                                >
                                    <span className="font-bold text-green-400 text-xl">₹</span>
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">Amazing Prices</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Buying or selling, we guarantee the best market rates for your device.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 2: Speed */}
                        <motion.div
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col items-center text-center gap-6 bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-teal-600 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-teal-900/20 rounded-2xl group-hover:bg-teal-900/40 transition-colors">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Zap className="w-10 h-10 text-teal-400 fill-teal-400" />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">Quick & Fast Service</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Get cash instantly at your doorstep just before the pickup completes. No waiting—payment is processed immediately.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 3: Safety */}
                        <motion.div
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col items-center text-center gap-6 bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-lime-600 transition-all duration-300 group cursor-default"
                        >
                            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-lime-900/20 rounded-2xl group-hover:bg-lime-900/40 transition-colors">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ShieldCheck className="w-10 h-10 text-green-400" />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">Safety Guaranteed</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
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
