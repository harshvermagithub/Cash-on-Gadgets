'use client'

import React from 'react';
import { motion } from 'framer-motion';

export const HeroLogo = ({ className = "h-14 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-end justify-center overflow-visible pt-1 pb-1 px-1 ${className}`} aria-label="Fonzkart">
            {/* The Cart Container - Tilted Left */}
            <div className="relative -rotate-3 origin-bottom-right">
                {/* Content Inside the Cart - Scaled Down & Raised to float inside */}
                <div className="absolute bottom-[35%] left-1/2 -translate-x-[50%] flex flex-col items-start leading-none z-10 w-full pb-0 scale-[0.75]">

                    {/* Top Row: F inside Phone + ONZ */}
                    <div className="flex items-center justify-center gap-0.5 mb-0 ml-2">
                        {/* F inside Smartphone */}
                        <div
                            className="relative w-6 h-10 flex flex-col items-center justify-between rounded-[5px] border-2 border-slate-800 dark:border-white/30 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-300 py-[2px]"
                        >
                            {/* Notch (Old Style Phone for F) */}
                            <div className="w-2 h-0.5 bg-slate-800 dark:bg-white/50 rounded-full" />

                            {/* Straight F */}
                            <motion.span
                                animate={{ opacity: [1, 0.9, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="font-black text-lg font-sans leading-none text-green-600 dark:text-green-500"
                            >
                                F
                            </motion.span>

                            {/* Home Button */}
                            <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-white/50" />
                        </div>

                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            ONZ
                        </span>
                    </div>

                    {/* Bottom Row: KA + Cash/Rupee + T - Shifted Right to Align Start of K with Start of Z */}
                    <div className="flex items-center justify-center gap-0.5 ml-16 -mt-5">
                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            KA
                        </span>

                        {/* R replacement: iPhone 16 Style with Dynamic Island */}
                        <div className="relative w-6 h-10 bg-green-600 rounded-[5px] border-2 border-green-800 flex flex-col items-center justify-center shadow-sm overflow-hidden">
                            {/* Dynamic Island */}
                            <div className="absolute top-[3px] w-2.5 h-1 bg-black/50 rounded-full z-10" />

                            <motion.span
                                animate={{ opacity: [1, 0, 1, 0, 1, 1, 0.2, 1] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1]
                                }}
                                className="text-lg text-white font-black"
                            >
                                ₹
                            </motion.span>

                            {/* Home Bar */}
                            <div className="absolute bottom-[3px] w-2.5 h-0.5 bg-white/30 rounded-full" />
                        </div>

                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            T
                        </span>
                    </div>
                </div>

                {/* Custom Shopping Cart Graphic (Elongated & Open Top) */}
                <svg
                    width="130"
                    height="70"
                    viewBox="0 0 46 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-colors duration-300"
                    style={{ color: 'var(--logo-cart-color)', overflow: 'visible' }}
                >
                    {/* Wheel 1 (Left) */}
                    <path
                        d="M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Wheel 2 (Right) */}
                    <path
                        d="M41 20C41 20.5523 40.5523 21 40 21C39.4477 21 39 20.5523 39 20C39 19.4477 39.4477 19 40 19C40.5523 19 41 19.4477 41 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Elongated Cart Body - Open Top */}
                    <path
                        d="M1 1H4L6.68 14.39C6.8872 15.4284 7.79848 16.1782 8.85764 16.18H40.4182C41.4024 16.18 42.2721 15.5255 42.55 14.58L44 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default HeroLogo;
