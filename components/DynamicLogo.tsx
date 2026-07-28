'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FCartLogo } from '@/components/FCartLogo';
import { HeroLogo } from '@/components/HeroLogo';

export const DynamicLogo = ({ className = "" }: { className?: string }) => {
    const [animationPhase, setAnimationPhase] = useState<'fonzkart' | 'cart-transit'>('fonzkart');

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase((prev) => (prev === 'fonzkart' ? 'cart-transit' : 'fonzkart'));
        }, 4500); // Toggles between FonzKart text and Cart transit every 4.5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative flex items-center justify-center min-h-[90px] min-w-[280px] overflow-hidden select-none ${className}`} aria-label="Fonzkart">
            <AnimatePresence mode="wait">
                {animationPhase === 'fonzkart' ? (
                    /* PHASE 1: FONZKART TEXT WRITTEN WITH SMARTPHONE 'F' AND RUPEE 'R' */
                    <motion.div
                        key="fonzkart-wordmark"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="flex items-center justify-center py-2"
                    >
                        <HeroLogo forceLight={false} />
                    </motion.div>
                ) : (
                    /* PHASE 2: CART ENTERS FROM LEFT AND MOVES TO RIGHT */
                    <motion.div
                        key="cart-glide-transit"
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ x: '-120%', opacity: 0 }}
                        animate={{ x: '120%', opacity: [0, 1, 1, 0] }}
                        exit={{ x: '120%', opacity: 0 }}
                        transition={{ duration: 3.2, ease: 'easeInOut' }}
                    >
                        <FCartLogo size={95} animate={true} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DynamicLogo;
