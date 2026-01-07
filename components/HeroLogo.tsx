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
                    width="120"
                    height="70"
                    viewBox="0 0 50 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-colors duration-300"
                    style={{ color: 'var(--logo-cart-color)', overflow: 'visible' }}
                >
                    {/* Wheel 1 (Left - Shifted +2 -> 12) */}
                    <path
                        d="M12 20C12 20.5523 11.5523 21 11 21C10.4477 21 10 20.5523 10 20C10 19.4477 10.4477 19 11 19C11.5523 19 12 19.4477 12 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Wheel 2 (Right - Shifted +2 -> 45) */}
                    <path
                        d="M45 20C45 20.5523 44.5523 21 44 21C43.4477 21 43 20.5523 43 20C43 19.4477 43.4477 19 44 19C44.5523 19 45 19.4477 45 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Elongated Cart Body - Open Top - Shifted Right +2 */}
                    <path
                        d="M3 1H6L8.68 14.39C8.8872 15.4284 9.79848 16.1782 10.8576 16.18H44.4182C45.4024 16.18 46.2721 15.5255 46.55 14.58L48 9"
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
