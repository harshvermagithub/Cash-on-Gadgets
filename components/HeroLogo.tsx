'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const HeroLogo = ({ className = "h-14 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-end justify-center overflow-visible pt-1 pb-1 px-1 ${className}`} aria-label="Fonzkart">
            {/* The Cart Container - Tilted Left */}
            <div className="relative -rotate-3 origin-bottom-right">
                {/* Content Inside the Cart - Scaled Down & Raised to float inside */}
                <div className="absolute bottom-[15%] left-1/2 -translate-x-[50%] flex flex-col items-start leading-none z-10 w-full pb-0 scale-[0.75]">

                    {/* Top Row: F inside Phone + ONZ */}
                    <div className="flex items-center justify-center gap-0.5 mb-0 ml-9">
                        {/* F Logo Box (Smartphone 3D - Reverted Tilt/Buttons) */}
                        <div
                            className="relative w-6 h-10 flex flex-col items-center justify-center rounded-[5px] border-2 border-slate-800 bg-slate-900 shadow-[2px_2px_4px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300"
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-full h-full bg-green-500 relative"
                            >
                                <Image src="/logo_final_v3.png" alt="F" fill className="object-cover" />
                            </motion.div>

                            {/* Notch */}
                            <div className="absolute top-0 w-2.5 h-[3px] bg-black rounded-b-[3px] z-10" />
                        </div>

                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            ONZ
                        </span>
                    </div>

                    {/* Bottom Row: KA + Cash/Rupee + T - Shifted Right to Align Start of K with Start of Z */}
                    <div className="flex items-center justify-center gap-0.5 ml-22 -mt-5">
                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            KA
                        </span>

                        {/* R replacement: 500 Rupee Note */}
                        <div className="relative w-7 h-11 bg-emerald-50 dark:bg-emerald-950 rounded-[2px] border border-emerald-600 dark:border-emerald-400 flex flex-col items-center justify-center shadow-sm overflow-hidden">
                            {/* Note Details */}
                            <span className="absolute top-[1px] left-[2px] text-[5px] font-bold text-emerald-800 dark:text-emerald-300">₹500</span>
                            <span className="absolute bottom-[1px] right-[2px] text-[5px] font-bold text-emerald-800 dark:text-emerald-300">500</span>

                            <motion.span
                                animate={{ opacity: [1, 0, 1, 0, 1, 1, 0.2, 1] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1]
                                }}
                                className="text-lg text-emerald-800 dark:text-emerald-300 font-black"
                            >
                                ₹
                            </motion.span>
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
                    width="210"
                    height="80"
                    viewBox="0 -35 110 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-colors duration-300"
                    style={{ color: 'var(--logo-cart-color)', overflow: 'visible' }}
                >
                    {/* Wheel 1 (Left - r=2.5) */}
                    <circle cx="12" cy="21" r="2.5" stroke="currentColor" strokeWidth="1.5" />

                    {/* Wheel 2 (Right - r=2.5) */}
                    <circle cx="86" cy="21" r="2.5" stroke="currentColor" strokeWidth="1.5" />

                    {/* Elongated Cart Body - Open Top - Extended Right & Slightly Up */}
                    <path
                        d="M3 -30H6L8.68 14.39C8.8872 15.4284 9.79848 16.1782 10.8576 16.18H85.4C86.4 16.18 87.2 15.5 87.5 14.6L91 -10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div >
    );
};

export default HeroLogo;
