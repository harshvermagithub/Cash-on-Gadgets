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
                <path d="M 8.5 10 C 8.5 10 12 3.5 22.5 3 C 28 3 28.5 8.5 26.5 9.5 C 24 13 18.5 15.5 14 16 C 11 16.5 8.5 18 8.5 19.5 Z" />
                {/* Middle Swoosh pointing right */}
                <path d="M 8.5 21 C 10.5 18 16 16.5 23 16.5 C 27 16.5 27.5 20 25 22 C 21.5 23.5 16 25 12 26 C 9.5 26.5 8.5 28.5 8.5 30 Z" />
                {/* Bottom Leaf Stem */}
                <path d="M 8.5 31 C 11 28.5 15 28 17.5 28 C 17.5 36 14 41 8.5 42 Z" />
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

