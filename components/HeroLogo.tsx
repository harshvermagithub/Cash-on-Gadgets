'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Image from 'next/image';

/** Vector Smartphone — 1:1 Exact HD Replica of User Target Image 2 */
const SmartphoneFLogo = () => (
    <div className="relative w-9 sm:w-11 h-12 sm:h-15 flex items-center justify-center shrink-0 drop-shadow-md">
        <svg viewBox="0 0 32 60" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Dark Charcoal Frame */}
            <rect x="1" y="1" width="30" height="58" rx="5" className="fill-[#1c1917] dark:fill-black stroke-[#27272a] dark:stroke-white/30" strokeWidth="1.8" />
            
            {/* Inner Black Bezel */}
            <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />

            {/* Vibrant Emerald Green Screen */}
            <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#10B981" />

            {/* Pure White F Logo 1:1 Vector Replica matching Image 2 */}
            <g fill="#FFFFFF">
                {/* Top Swoosh pointing top-right */}
                <path d="M 8.5 12 C 8.5 12 12.5 7 19.5 7 C 24.5 7 25 12 23.5 13 C 21 17 16.5 19 12.5 20 C 10 20.5 8.5 22 8.5 23.5 Z" />
                {/* Middle Swoosh pointing right */}
                <path d="M 8.5 25 C 10.5 22 15 20.5 20 20.5 C 23.5 20.5 24 23.5 22 25 C 19 27 14.5 28.5 11.5 29.5 C 9.5 30 8.5 31.5 8.5 33 Z" />
                {/* Bottom Leaf Stem */}
                <path d="M 8.5 34.5 C 10.5 32.5 14 32 16 32 C 16 39 13.5 43.5 8.5 44.5 Z" />
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

