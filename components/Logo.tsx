'use client'

import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ className = "h-14 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-end justify-center overflow-visible pt-1 pb-1 px-1 ${className}`} aria-label="Fonzkart">
            {/* The Cart Container - Tilted Left */}
            <div className="relative -rotate-3 origin-bottom-right">
                {/* Content Inside the Cart - Scaled Down & Raised to float inside */}
                <div className="absolute bottom-[35%] left-1/2 -translate-x-[45%] flex flex-col items-center leading-none z-10 w-full text-center pb-0 scale-[0.85]">

                    {/* Top Row: F inside Phone + ONZ */}
                    <div className="flex items-center justify-center gap-0.5 mb-0.5">
                        {/* F inside Smartphone */}
                        <div
                            className="relative w-4 h-6 flex items-center justify-center rounded-[3px] border border-slate-700 dark:border-white/20 shadow-inner overflow-hidden transition-colors duration-300"
                            style={{ backgroundColor: 'var(--logo-box-bg)' }}
                        >
                            {/* Flicker Animation */}
                            <motion.span
                                animate={{ opacity: [1, 0, 1, 0, 1, 1, 0.2, 1] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1]
                                }}
                                className="font-black text-sm font-mono transition-colors duration-300"
                                style={{ color: 'var(--logo-f-color)' }}
                            >
                                F
                            </motion.span>
                        </div>

                        <span
                            className="font-black text-lg tracking-tighter transition-colors duration-300"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            ONZ
                        </span>
                    </div>

                    {/* Bottom Row: KA + Cash/Rupee + T */}
                    <div className="flex items-center justify-center gap-0.5">
                        <span
                            className="font-bold text-xs tracking-tight transition-colors duration-300"
                            style={{ color: 'var(--logo-ka-t-color)' }}
                        >
                            KA
                        </span>

                        {/* R replacement: Vertical Cash with Rupee */}
                        <div className="relative w-3 h-4 bg-green-600 rounded-[2px] border border-green-700 flex items-center justify-center shadow-sm -mt-0.5">
                            <motion.span
                                animate={{ opacity: [1, 0, 1, 0, 1, 1, 0.2, 1] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1]
                                }}
                                className="text-[8px] text-white font-bold"
                            >
                                ₹
                            </motion.span>
                        </div>

                        <span
                            className="font-bold text-xs tracking-tight transition-colors duration-300"
                            style={{ color: 'var(--logo-ka-t-color)' }}
                        >
                            T
                        </span>
                    </div>
                </div>

                {/* Custom Shopping Cart Graphic (Elongated & Open Top) */}
                <svg
                    width="80"
                    height="70"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-colors duration-300"
                    style={{ color: 'var(--logo-cart-color)', overflow: 'visible' }}
                >
                    {/* Wheels positioned wider */}
                    <path
                        d="M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M23 20C23 20.5523 22.5523 21 22 21C21.4477 21 21 20.5523 21 20C21 19.4477 21.4477 19 22 19C22.5523 19 23 19.4477 23 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Elongated Cart Body - Open Top */}
                    <path
                        d="M1 1H4L6.68 14.39C6.8872 15.4284 7.79848 16.1782 8.85764 16.18H22.4182C23.4024 16.18 24.2721 15.5255 24.55 14.58L26 9"
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

export default Logo;
