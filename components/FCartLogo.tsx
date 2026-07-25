'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEVICE_LIST } from '@/components/icons/DeviceIcons';

/**
 * Simplified Fonzkart Logo:
 * Just the "F" sitting inside a shopping cart. Nothing else.
 */
export const FCartLogo = ({
    className = '',
    size = 80,
    animate = true,
}: {
    className?: string;
    size?: number;
    animate?: boolean;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!animate) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % DEVICE_LIST.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [animate]);

    // Scale factors relative to size
    const cartW = size;
    const cartH = size * 0.85;
    const fSize = size * 0.38;

    const MotionOrDiv = animate ? motion.div : 'div';
    const MotionOrSvg = animate ? motion.svg : 'svg';

    const cartAnimation = animate
        ? { animate: { y: [0, -2, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } }
        : {};

    const glowAnimation = animate
        ? { animate: { opacity: [0, 0.6, 0] }, transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const } }
        : {};

    const wheelPulse = animate
        ? { animate: { scale: [1, 1.15, 1] }, transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } }
        : {};

    const currentDevice = DEVICE_LIST[currentIndex];

    return (
        <div
            className={`relative inline-flex items-center justify-center select-none ${className}`}
            style={{ width: cartW, height: cartH }}
            aria-label="Fonzkart"
        >
            <MotionOrDiv
                className="relative w-full h-full"
                {...cartAnimation}
            >
                {/* Cart SVG */}
                <MotionOrSvg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 85"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    style={{ overflow: 'visible' }}
                >
                    {/* Glow fill inside cart basket */}
                    <polygon
                        points="22,55 33,60 82,60 90,38 24,38"
                        className="fill-green-500/10 dark:fill-green-400/15"
                    />

                    {/* Speed trails */}
                    {animate && (
                        <>
                            <motion.line
                                x1="-5" y1="55" x2="10" y2="55"
                                strokeWidth="2"
                                className="stroke-emerald-500/50"
                                strokeLinecap="round"
                                animate={{ x: [-6, 6, -6], opacity: [0, 0.8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.line
                                x1="0" y1="42" x2="12" y2="42"
                                strokeWidth="1.5"
                                className="stroke-teal-500/40"
                                strokeLinecap="round"
                                animate={{ x: [-4, 8, -4], opacity: [0, 0.7, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                        </>
                    )}

                    {/* Cart body */}
                    <path
                        d="M5 5H16L24 54C24.7 57.3 27.6 59.5 31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33"
                        className="stroke-green-600 dark:stroke-green-400"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Cart accent glow line */}
                    <motion.path
                        d="M31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33"
                        className="stroke-lime-400"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        {...glowAnimation}
                    />

                    {/* Wheels */}
                    <circle cx="35" cy="72" r="5" className="stroke-green-600 dark:stroke-green-400" strokeWidth="3.5" fill="none" />
                    <circle cx="78" cy="72" r="5" className="stroke-green-600 dark:stroke-green-400" strokeWidth="3.5" fill="none" />

                    {/* Wheel inner dots */}
                    <motion.circle
                        cx="35" cy="72" r="1.5"
                        className="fill-green-400 dark:fill-green-300"
                        {...wheelPulse}
                    />
                    <motion.circle
                        cx="78" cy="72" r="1.5"
                        className="fill-green-400 dark:fill-green-300"
                        {...(animate ? { animate: { scale: [1, 1.15, 1] }, transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 } } : {})}
                    />

                    {/* Floating particles */}
                    {animate && (
                        <>
                            <motion.circle
                                cx="90" cy="15" r="2"
                                className="fill-emerald-400"
                                animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                            <motion.circle
                                cx="80" cy="22" r="1.5"
                                className="fill-lime-400"
                                animate={{ y: [0, -6, 0], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                            />
                        </>
                    )}
                </MotionOrSvg>

                {/* Device Icon — Centered inside the cart basket */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{
                        width: fSize * 0.96,
                        height: fSize * 1.44,
                        left: '50%',
                        top: '26%',
                        transform: 'translate(-42%, -40%)',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentDevice.key}
                            initial={animate ? { opacity: 0, scale: 0.7, y: 4 } : { opacity: 1, scale: 1, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={animate ? { opacity: 0, scale: 0.7, y: -4 } : { opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className={`absolute inset-0 flex items-center justify-center ${
                                currentDevice.key === 'phone' ? 'scale-100' : 'scale-[0.85]'
                            }`}
                        >
                            <currentDevice.Icon className="w-full h-full" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </MotionOrDiv>
        </div>
    );
};

export default FCartLogo;
