'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MultiGadgetComposition } from '@/components/icons/DeviceIcons';

export const Logo = ({ className = "h-14 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-end justify-center overflow-visible pt-1 pb-1 px-1 ${className}`} aria-label="Fonzkart">
            {/* The Cart Container - Tilted Left */}
            <div className="relative -rotate-2 origin-bottom-right">
                {/* Content Inside the Cart - Multi-Gadgets Floating Basket */}
                <div className="absolute bottom-[38%] left-1/2 -translate-x-[48%] flex items-center justify-center z-10 w-full pb-0 scale-[0.88]">
                    <MultiGadgetComposition />
                </div>

                {/* Custom Shopping Cart Graphic */}
                <motion.svg
                    width="76"
                    height="66"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                    style={{ overflow: 'visible' }}
                    animate={{ y: [0, -1.5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Glowing background inside the cart basket */}
                    <motion.polygon
                        points="6,15 9,16 22,16 24.5,10 6.5,10"
                        className="fill-green-500/10 dark:fill-green-400/15"
                    />

                    {/* Speed / Energy Trails Behind Cart */}
                    <motion.path d="M-3 15 L2 15" strokeWidth="1" className="stroke-emerald-500/60 dark:stroke-emerald-400/60" animate={{ x: [-4, 4, -4], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} strokeLinecap="round" />
                    <motion.path d="M0 11 L3 11" strokeWidth="1" className="stroke-teal-500/60 dark:stroke-teal-400/60" animate={{ x: [-2, 5, -2], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} strokeLinecap="round" />

                    {/* Wheels */}
                    <motion.circle cx="9" cy="20" r="1.2" className="stroke-green-600 dark:stroke-green-400/80" strokeWidth="1.5" />
                    <motion.circle cx="22" cy="20" r="1.2" className="stroke-green-600 dark:stroke-green-400/80" strokeWidth="1.5" />

                    {/* Wheel inner glowing dot */}
                    <motion.circle cx="9" cy="20" r="0.4" className="fill-green-400 dark:fill-green-300" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle cx="22" cy="20" r="0.4" className="fill-green-400 dark:fill-green-300" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />

                    {/* Elongated Cart Body */}
                    <motion.path
                        d="M1 1H4L6.68 14.39C6.8872 15.4284 7.79848 16.1782 8.85764 16.18H22.4182C23.4024 16.18 24.2721 15.5255 24.55 14.58L26 9"
                        className="stroke-green-600 dark:stroke-green-400"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Cart front accent line glowing pulse */}
                    <motion.path
                        d="M8.85764 16.18H22.4182C23.4024 16.18 24.2721 15.5255 24.55 14.58L26 9"
                        className="stroke-lime-400"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Floating neon particles above cart */}
                    <motion.circle cx="26" cy="3" r="0.75" className="fill-emerald-400" animate={{ y: [0, -4, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    <motion.circle cx="22" cy="6" r="0.6" className="fill-lime-400" animate={{ y: [0, -3, 0], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
                </motion.svg>
            </div>
        </div>
    );
};

export default Logo;

