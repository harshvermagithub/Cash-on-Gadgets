'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, CheckCircle, Star, Clock, MapPin, BadgePercent, Sparkles } from 'lucide-react';
import HowItWorks from '@/components/HowItWorks';
import HeroAnimation from '@/components/HeroAnimation';
import { ReviewsMarquee } from '@/components/ReviewsMarquee';
import CategorySelector from '@/components/sell/CategorySelector';
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
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-0 pb-32 md:pt-40 md:pb-52 overflow-hidden bg-background w-full">
                {/* Background FX */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-50 dark:bg-slate-950/20">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] opacity-60" />
                    <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] opacity-40" />
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 max-w-[100vw] overflow-x-hidden">
                    <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-24">

                        {/* LEFT COLUMN: Content */}
                        <div className="flex-1 w-full max-w-2xl animate-in slide-in-from-bottom-8 fade-in-20 duration-700 flex flex-col items-center text-center xl:items-start xl:text-left z-20">

                            {/* REBUILT DESKTOP TOP SECTION: No BigLogo. Clean Typography. */}

                            {/* Trust Badge / Pill */}
                            <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-green-200/60 shadow-sm mb-6 hover:shadow-md transition-all cursor-default w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">India&apos;s Most Trusted Re-commerce</span>
                            </div>

                            {/* Mobile View Specifics (Logo + Chips) */}
                            <div className="block xl:hidden w-full space-y-4 pt-0 mb-12">
                                <div className="flex flex-wrap justify-center gap-2 px-2 pt-6 pb-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 text-black dark:text-white text-[10px] font-bold border border-green-200/50 shadow-sm transition-all cursor-default whitespace-nowrap">
                                        <Sparkles className="w-3 h-3 text-green-500" />
                                        Trusted by 1k+
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 text-black dark:text-white text-[10px] font-bold border border-green-200/50 shadow-sm transition-all cursor-default whitespace-nowrap">
                                        <MapPin className="w-3 h-3 text-green-500" />
                                        Bengaluru Pickup
                                    </div>
                                </div>
                                <div className="flex justify-center items-center py-2 w-full">
                                    <div className="scale-[1.1] origin-center transform flex justify-center items-center">
                                        <HeroLogo />
                                    </div>
                                </div>
                                <div className="w-full h-[550px] relative mt-2 mb-8 flex items-center justify-center overflow-visible">
                                    <div className="scale-[1] origin-center w-full h-full">
                                        <HeroAnimation />
                                    </div>
                                </div>
                                <div className="relative z-20 bg-background/80 backdrop-blur-sm pt-2 rounded-xl w-full max-w-full overflow-hidden">
                                    <div className="px-1"><HomeSearch /></div>
                                    <div className="mt-6 w-full overflow-hidden"><BrandRail initialBrands={initialBrands} /></div>
                                </div>
                            </div>

                            {/* MAIN HEADLINE */}
                            <div className="max-w-full overflow-hidden relative">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] md:leading-[1.1]">
                                    Smart way to <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-x">sell your device.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mt-6 font-medium mx-auto xl:mx-0">
                                    Get the <span className="text-green-600 dark:text-green-400 font-bold">Highest Value</span> for your old smartphone, laptop, or Smartwatch instantly. Doorstep pickup in 24 hours.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto justify-center xl:justify-start">
                                <Link
                                    href="/sell"
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-slate-900 dark:bg-green-600 text-white font-bold text-lg shadow-xl shadow-green-500/20 hover:bg-slate-800 dark:hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group w-full sm:w-auto"
                                >
                                    Check Price
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/orders"
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg hover:border-green-200 hover:bg-green-50/50 dark:hover:bg-slate-700 transition-all duration-200 w-full sm:w-auto"
                                >
                                    Track Order
                                </Link>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex items-center gap-6 pt-8 text-sm font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30"><Zap className="w-3.5 h-3.5 text-green-600" /></div>
                                    Instant Cash
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><MapPin className="w-3.5 h-3.5 text-blue-600" /></div>
                                    Doorstep Pickup
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30"><ShieldCheck className="w-3.5 h-3.5 text-purple-600" /></div>
                                    Safe & Secure
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Desktop Hero Animation */}
                        <div className="hidden xl:flex flex-1 relative w-full h-[600px] max-w-[700px] animate-in zoom-in-50 fade-in duration-1000 delay-200 perspective-1000 items-center justify-center">
                            {/* Decorative Blob under Animation */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-emerald-500/5 rounded-full blur-3xl transform scale-90" />
                            <HeroAnimation />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Selection Section (unchanged) */}
            <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <CategorySelector onSelect={handleCategorySelect} />
                    </div>
                </div>
            </section>

            {/* Brands Marquee & Stats Section */}
            <section className="py-12 border-y bg-slate-900 border-slate-800 w-full overflow-hidden">
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
            <section className="py-24 overflow-hidden w-full">
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

            {/* Why Choose Us Section */}
            <section className="py-24 bg-slate-900 overflow-hidden w-full">
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
