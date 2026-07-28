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
        }, 5000); // 5s per cycle phase
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative flex items-center justify-center min-h-[95px] w-full max-w-[460px] mx-auto overflow-hidden select-none ${className}`} aria-label="Fonzkart">
            <AnimatePresence mode="wait">
                {animationPhase === 'cart' ? (
                    /* PHASE 1: CART HOLDS IN CENTER (100% OPACITY), GLIDES RIGHT AT FULL OPACITY, AND FADES OUT COMPLETELY BEFORE THE BORDER */
                    <motion.div
                        key="cart-phase"
                        className="flex items-center justify-center"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{
                            x: [0, 0, 110, 130], // Holds centered for ~3s, then glides to the right
                            opacity: [1, 1, 1, 0] // Stays 100% opaque during transit, completely disappears BEFORE border
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 4.5,
                            times: [0, 0.65, 0.88, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <FCartLogo size={100} animate={true} />
                    </motion.div>
                ) : (
                    /* PHASE 2: WORDMARK APPEARS & DISAPPEARS DIRECTLY FROM THE CENTER */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
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


