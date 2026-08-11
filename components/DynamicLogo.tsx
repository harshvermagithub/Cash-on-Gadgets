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
        <div
            className={`relative flex items-center justify-center min-h-[110px] w-full max-w-[500px] mx-auto overflow-hidden select-none ${className}`}
            aria-label="Fonzkart"
        >
            <AnimatePresence mode="wait">
                {animationPhase === 'cart' ? (
                    /* PHASE 1: CART HOLDS IN CENTER (100% OPACITY), GLIDES RIGHT AT FULL OPACITY, AND DISAPPEARS BEFORE BORDER */
                    <motion.div
                        key="cart-phase"
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            x: [0, 0, 100, 125], // Holds centered for ~3s, then glides to the right
                            opacity: [1, 1, 1, 0] // 100% opaque during movement, fades to 0 before border
                        }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                        transition={{
                            duration: 4.4,
                            times: [0, 0.68, 0.88, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <FCartLogo size={120} animate={true} />
                    </motion.div>
                ) : (
                    /* PHASE 2: WORDMARK APPEARS IN CENTER, HOLDS, THEN DISAPPEARS COMPLETELY (<0.5s GAP BEFORE CART) */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
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




