'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroLogo from './HeroLogo';
import Logo from './Logo';

export const BottomFonzKartBanner = ({ className = '' }: { className?: string }) => {
    const [viewMode, setViewMode] = useState<'fonzkart' | 'cart-transit'>('fonzkart');

    useEffect(() => {
        const interval = setInterval(() => {
            setViewMode((prev) => (prev === 'fonzkart' ? 'cart-transit' : 'fonzkart'));
        }, 5000); // Cycles every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative w-full h-24 overflow-hidden flex items-center justify-center bg-slate-900/90 rounded-2xl border border-slate-800 px-6 ${className}`}>
            <AnimatePresence mode="wait">
                {viewMode === 'fonzkart' ? (
                    /* 1. FONZKART TEXT APPEARS (F has Smartphone, R has Rupee & Note) */
                    <motion.div
                        key="fonzkart-text"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center"
                    >
                        <HeroLogo forceLight={false} />
                    </motion.div>
                ) : (
                    /* 2. CART MOVES FROM LEFT TO RIGHT */
                    <motion.div
                        key="cart-glide"
                        className="absolute inset-0 flex items-center"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ duration: 3.2, ease: 'easeInOut' }}
                    >
                        <div className="flex items-center gap-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-green-600/30 border border-green-500/40 backdrop-blur-md">
                            <Logo className="h-14 w-auto" />
                            <span className="text-sm font-extrabold text-emerald-400 font-heading">
                                Fonzkart Shopping Cart
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BottomFonzKartBanner;
