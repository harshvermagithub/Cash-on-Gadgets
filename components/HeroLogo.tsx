'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const SmartphoneSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="1"
            y="1"
            width="30"
            height="58"
            rx="4"
            strokeWidth="1.5"
            className="fill-slate-900 dark:fill-slate-950 stroke-slate-700 dark:stroke-slate-400"
        />
        <rect x="2.5" y="2.5" width="27" height="55" rx="2.5" fill="#10B981" />
        <rect x="10" y="3" width="12" height="3" rx="1.5" fill="black" />
        <path d="M2.5 2.5H29.5V20L2.5 35V2.5Z" fill="white" fillOpacity="0.1" />
    </svg>
);

const RupeeNoteSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="1"
            y="1"
            width="38"
            height="68"
            rx="2"
            strokeWidth="1"
            className="fill-slate-200 dark:fill-slate-300 stroke-slate-500 dark:stroke-slate-400"
        />
        <rect x="4" y="4" width="32" height="62" rx="1" fill="#D1FAE5" fillOpacity="0.5" />

        <text x="20" y="10" fontFamily="sans-serif" fontSize="5" fontWeight="bold" fill="#047857" textAnchor="middle">₹500</text>
        <text x="20" y="66" fontFamily="sans-serif" fontSize="5" fontWeight="bold" fill="#047857" textAnchor="middle">500</text>

        <circle cx="20" cy="35" r="14" stroke="#10B981" strokeWidth="0.5" fill="white" fillOpacity="0.8" />
        <text
            x="20"
            y="36"
            fontFamily="sans-serif"
            fontSize="20"
            fontWeight="bold"
            fill="#047857"
            textAnchor="middle"
            dominantBaseline="middle"
        >
            ₹
        </text>

        <line x1="2" y1="50" x2="38" y2="50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M2 24H38M2 46H38" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
    </svg>
);

export const HeroLogo = ({ className = "" }: { className?: string }) => {
    const cycleDuration = 4;

    return (
        <div className={`flex items-center gap-1 select-none ${className}`} aria-label="Fonzkart">
            {/* F / Smartphone Animation */}
            <div className="relative w-8 h-12 flex items-center justify-center mr-0.5">
                {/* State 1: F Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full p-0.5">
                        <Image src="/logo_final_v3.png" alt="F" fill className="object-contain" priority />
                    </div>
                </div>

                {/* State 2: Smartphone SVG */}
                <motion.div
                    animate={{ opacity: [1, 1, 0, 0, 1] }}
                    transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <SmartphoneSVG />
                </motion.div>
            </div>

            {/* O N Z K A */}
            <div className="flex items-center tracking-tighter">
                <span className="font-black text-4xl text-slate-900 dark:text-white tracking-tight">ONZKA</span>
            </div>

            {/* R / Rupee Animation */}
            <div className="relative w-9 h-14 flex items-center justify-center mx-1">
                {/* State 1: Rupee Symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-black text-4xl text-slate-900 dark:text-white">₹</span>
                </div>

                {/* State 2: 500 Note SVG (Vertical) */}
                <motion.div
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <div className="w-full h-full scale-[1.05]">
                        <RupeeNoteSVG />
                    </div>
                </motion.div>
            </div>

            {/* T */}
            <div className="flex items-center tracking-tighter">
                <span className="font-black text-4xl text-slate-900 dark:text-white">T</span>
            </div>

        </div>
    );
};
export default HeroLogo;
