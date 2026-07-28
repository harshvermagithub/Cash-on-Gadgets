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
        }, 5500); // 5.5s per cycle phase
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative flex items-center justify-center min-h-[95px] min-w-[320px] overflow-hidden select-none ${className}`} aria-label="Fonzkart">
            <AnimatePresence mode="popLayout" initial={false}>
                {animationPhase === 'cart' ? (
                    /* PHASE 1: CART HOLDS IN CENTER (100% OPACITY), THEN GLIDES RIGHT WITH FULL OPACITY UNTIL VERY END */
                    <motion.div
                        key="cart-phase"
                        className="flex items-center justify-center"
                        initial={{ x: 0, opacity: 1 }}
                        animate={{
                            x: [0, 0, 160], // Holds centered for ~3.5s, then glides to the right
                            opacity: [1, 1, 1, 0] // 100% opaque during movement, fades only at very end
                        }}
                        exit={{ x: 180, opacity: 0 }}
                        transition={{
                            duration: 4.8,
                            times: [0, 0.7, 0.95, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <FCartLogo size={100} animate={true} />
                    </motion.div>
                ) : (
                    /* PHASE 2: OFFICIAL FONZKART LOGO APPEARS (SMARTPHONE 'F' + ONZKA + GREEN RUPEE '₹' + T) INSTANTLY */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.94, x: -15 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.94, x: 15 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
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

