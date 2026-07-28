'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export const AnimatedTrustChip = ({ className = '' }: { className?: string }) => {
    const [animationStep, setAnimationStep] = useState<'cart' | 'fonzkart' | 'tagline'>('cart');

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationStep((prev) => {
                if (prev === 'cart') return 'fonzkart';
                if (prev === 'fonzkart') return 'tagline';
                return 'cart';
            });
        }, 3200); // Transitions every 3.2s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-green-300/80 dark:border-green-500/40 shadow-sm hover:shadow-md transition-all cursor-default min-w-[260px] h-[38px] ${className}`}>
            
            <AnimatePresence mode="wait">
                {animationStep === 'cart' && (
                    /* PHASE 1: CART MOVES FROM LEFT TO RIGHT ACROSS CHIP */
                    <motion.div
                        key="cart-glide"
                        className="absolute inset-0 flex items-center justify-start px-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                            initial={{ x: '-20%' }}
                            animate={{ x: '120%' }}
                            transition={{ duration: 2.2, ease: 'easeInOut' }}
                        >
                            <ShoppingCart size={18} className="text-green-500" />
                            <span className="text-[10px] uppercase tracking-wider font-extrabold whitespace-nowrap">FonzKart Express</span>
                        </motion.div>
                    </motion.div>
                )}

                {animationStep === 'fonzkart' && (
                    /* PHASE 2: FONZKART WRITTEN WITH SMARTPHONE 'F' AND RUPEE 'R' */
                    <motion.div
                        key="fonzkart-text"
                        className="flex items-center gap-1 text-slate-900 dark:text-white font-extrabold text-sm font-heading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="text-emerald-500 font-extrabold">📱F</span>
                        <span>onz</span>
                        <span className="text-blue-500 font-extrabold">Ka</span>
                        <span className="text-amber-500 font-extrabold">₹r</span>
                        <span>t</span>
                    </motion.div>
                )}

                {animationStep === 'tagline' && (
                    /* PHASE 3: INDIA'S MOST TRUSTED RE-COMMERCE TAGLINE */
                    <motion.div
                        key="tagline-text"
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase whitespace-nowrap"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>India&apos;s Most Trusted Re-commerce</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedTrustChip;
