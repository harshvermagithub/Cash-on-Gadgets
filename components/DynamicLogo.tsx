'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FCartLogo } from '@/components/FCartLogo';
import { HeroLogo } from '@/components/HeroLogo';

export const DynamicLogo = ({ className = "" }: { className?: string }) => {
    const [animationPhase, setAnimationPhase] = useState<'cart' | 'fonzkart'>('cart');

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase((prev) => (prev === 'cart' ? 'fonzkart' : 'cart'));
        }, 6500); // 6.5s per phase so Cart remains centered and shown for most of the time
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative flex items-center justify-center min-h-[100px] min-w-[300px] overflow-hidden select-none ${className}`} aria-label="Fonzkart">
            <AnimatePresence mode="wait">
                {animationPhase === 'cart' ? (
                    /* PHASE 1: CART IS PRESENT IN CENTER FOR MOST OF THE TIME, THEN MOVES SLOWLY TO THE RIGHT */
                    <motion.div
                        key="cart-phase"
                        className="flex items-center justify-center"
                        initial={{ x: 0, opacity: 1 }}
                        animate={{
                            x: [0, 0, 0, 160], // Stays centered for ~4.5s, then moves slowly towards the right side
                            opacity: [1, 1, 1, 0]
                        }}
                        exit={{ x: 180, opacity: 0 }}
                        transition={{
                            duration: 6.0,
                            times: [0, 0.65, 0.75, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <FCartLogo size={100} animate={true} />
                    </motion.div>
                ) : (
                    /* PHASE 2: FONZKART TEXT WRITTEN (ALWAYS HAS SMARTPHONE 'F' & RUPEE NOTE 'R') */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="flex items-center justify-center py-2"
                    >
                        <HeroLogo forceLight={false} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DynamicLogo;
