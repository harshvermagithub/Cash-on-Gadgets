'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const BigLogo = () => {
    // Shared animation props for synchronization
    const blinkAnimation = {
        opacity: [1, 0, 1, 0, 1, 1, 0.2, 1]
    };

    const blinkTransition = {
        duration: 2.5,
        repeat: Infinity,
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1]
    };

    return (
        <div className="w-full py-32 pb-12 select-none opacity-90 hover:opacity-100 transition-opacity duration-500 overflow-visible flex justify-start">
            <div className="relative flex items-center justify-start">
                {/* The Cart Container - Tilted Left - Left Origin for Alignment */}
                {/* Reduced scale to prevent overlap, adjusted padding in parent container */}

                <div className="relative -rotate-3 origin-left scale-[2] md:scale-[2.8] lg:scale-[3.5] ml-4">
                    {/* Content Inside the Cart - Gap Reduced by Half */}
                    <div className="absolute top-[2.5%] left-1/2 -translate-x-[48%] flex flex-col items-start leading-none z-10">
                        {/* Row 1: F O N Z */}
                        <div className="flex items-center gap-[1px]">
                            {/* F inside Phone */}
                            <div
                                className="relative w-4 h-6 flex items-center justify-center rounded-[3px] border border-slate-700 dark:border-white/20 shadow-inner overflow-hidden transition-colors duration-300"
                                style={{ backgroundColor: 'var(--logo-box-bg)' }}
                            >
                                <motion.span
                                    animate={blinkAnimation}
                                    transition={blinkTransition}
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

                        {/* Row 2: K A ₹ T (Staggered to start under Z) */}
                        <div className="flex items-center gap-[1px] ml-[38px] -mt-[2px]">
                            <span
                                className="font-bold text-xs tracking-tight transition-colors duration-300"
                                style={{ color: 'var(--logo-ka-t-color)' }}
                            >
                                KA
                            </span>
                            <div className="relative w-3 h-4 bg-green-600 rounded-[2px] border border-green-700 flex items-center justify-center shadow-sm -mt-0.5">
                                <motion.span
                                    animate={blinkAnimation}
                                    transition={blinkTransition}
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

                    {/* Custom Shopping Cart Graphic - Gap Reduced by Half */}
                    <svg
                        width="110"
                        height="70"
                        viewBox="0 0 38 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1.5 transition-colors duration-300"
                        style={{ color: 'var(--logo-cart-color)', overflow: 'visible' }}
                    >
                        {/* Rear Wheel */}
                        <path
                            d="M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {/* Front Wheel */}
                        <path
                            d="M33 20C33 20.5523 32.5523 21 32 21C31.4477 21 31 20.5523 31 20C31 19.4477 31.4477 19 32 19C32.5523 19 33 19.4477 33 20Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {/* Cart Body */}
                        <path
                            d="M1 1H4L6.68 14.39C6.8872 15.4284 7.79848 16.1782 8.85764 16.18H32.4C33.4 16.18 34.2 15.5 34.5 14.6L36 9"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
