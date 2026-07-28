'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FCartLogo } from '@/components/FCartLogo';
import { HeroLogo } from '@/components/HeroLogo';

interface DynamicLogoProps {
    className?: string;
    size?: 'small' | 'normal';
}

export const DynamicLogo = ({ className = "", size = "normal" }: DynamicLogoProps) => {
    const [animationPhase, setAnimationPhase] = useState<'cart' | 'fonzkart'>('cart');

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase((prev) => (prev === 'cart' ? 'fonzkart' : 'cart'));
        }, 5000); // 5s per cycle phase
        return () => clearInterval(interval);
    }, []);

    const isSmall = size === 'small';
    const cartSize = isSmall ? 65 : 100;

    return (
        <div
            className={`relative flex items-center justify-center select-none ${
                isSmall ? 'min-h-[48px] min-w-[200px]' : 'min-h-[95px] w-full max-w-[460px] mx-auto'
            } overflow-hidden ${className}`}
            aria-label="Fonzkart"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {animationPhase === 'cart' ? (
                    /* PHASE 1: CART HOLDS IN CENTER (100% OPACITY), GLIDES RIGHT AT FULL OPACITY, AND DISAPPEARS BEFORE BORDER */
                    <motion.div
                        key="cart-phase"
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            x: [0, 0, 90, 110], // Holds centered for ~3.2s, then glides to the right
                            opacity: [1, 1, 1, 0] // 100% opaque during movement, fades to 0 before border
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 4.6,
                            times: [0, 0.68, 0.88, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <FCartLogo size={cartSize} animate={true} />
                    </motion.div>
                ) : (
                    /* PHASE 2: WORDMARK APPEARS INSTANTLY IN CENTER (ZERO BLANK TIME) AND FADES FROM CENTER */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className={`flex items-center justify-center ${isSmall ? 'scale-[0.62] origin-center py-0' : 'py-2'}`}
                    >
                        <HeroLogo forceLight={false} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DynamicLogo;



