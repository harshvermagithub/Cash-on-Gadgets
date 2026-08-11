'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Image from 'next/image';

/** Vector Smartphone with White F Logo Mask matching user screenshot 100% */
const SmartphoneFLogo = () => (
    <div className="relative w-9 sm:w-11 h-12 sm:h-15 flex items-center justify-center shrink-0 drop-shadow-md">
        <svg viewBox="0 0 32 58" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Dark Phone Frame */}
            <rect x="1" y="1" width="30" height="56" rx="4.5" className="fill-[#18181b] dark:fill-black stroke-slate-700 dark:stroke-white/30" strokeWidth="1.5" />
            
            {/* Vibrant Emerald Green Screen */}
            <rect
                x="2.5"
                y="2.5"
                width="27"
                height="53"
                rx="3"
                fill="#10B981"
            />

            {/* Top Speaker Notch */}
            <rect x="10" y="3.2" width="12" height="2.5" rx="1.2" className="fill-black dark:fill-white/80" />

            {/* Screen Glass Reflection Shine */}
            <path d="M2.5 2.5H29.5V18L2.5 32V2.5Z" fill="white" fillOpacity="0.12" />

            {/* Pure White F Logo HD Vector — 100% Crisp & Mobile Compatible */}
            <g fill="#FFFFFF">
                {/* Top Bar Swoosh */}
                <path d="M 9.5 13.5 C 9.5 13.5 13.5 8 21 7.5 C 26.5 7.5 27.5 12.5 26 14 C 24 17.5 19 19.5 14.5 20.5 C 11.5 21 9.5 22 9.5 23.5 Z" />
                {/* Middle Bar Swoosh */}
                <path d="M 9.5 25 C 11 22 16.5 20.5 21.5 20.5 C 25.5 20.5 26 24 24 26 C 21 28 16 29.5 12.5 30.5 C 10 31 9.5 33 9.5 34.5 Z" />
                {/* Bottom Stem */}
                <path d="M 9.5 36 C 12 33.5 16 33 18 33 C 18 40.5 15 45 9.5 46 Z" />
            </g>
        </svg>
    </div>
);

export const HeroLogo = ({ className = "", forceLight = false }: { className?: string, forceLight?: boolean }) => {
    const textClass = forceLight ? 'text-slate-900' : 'text-slate-900 dark:text-white';

    return (
        <div className={`inline-flex items-center gap-1 sm:gap-1.5 select-none ${className}`} aria-label="Fonzkart">
            {/* Smartphone 'F' Logo */}
            <SmartphoneFLogo />

            {/* ONZ */}
            <span className={`font-black text-3xl sm:text-4xl tracking-tight font-heading ${textClass}`}>
                ONZ
            </span>

            {/* KA */}
            <span className={`font-black text-3xl sm:text-4xl tracking-tight font-heading ${textClass}`}>
                KA
            </span>

            {/* Rupee '₹' Symbol (Static Vibrant Green R replacement) */}
            <span className="font-black text-3xl sm:text-4xl text-emerald-500 font-heading mx-0.5 inline-block">
                ₹
            </span>

            {/* T */}
            <span className={`font-black text-3xl sm:text-4xl tracking-tight font-heading ${textClass}`}>
                T
            </span>
        </div>
    );
};

export default HeroLogo;

