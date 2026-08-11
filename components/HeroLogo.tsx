'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Image from 'next/image';

/** Vector Smartphone — 1:1 Exact HD Replica of User Target Image 2 using original icon.png */
const SmartphoneFLogo = () => (
    <div className="relative w-7 sm:w-9 h-10 sm:h-12 flex items-center justify-center shrink-0 drop-shadow-md">
        <svg viewBox="0 0 32 60" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Dark Charcoal Frame */}
            <rect x="1" y="1" width="30" height="58" rx="5" className="fill-[#1c1917] dark:fill-black stroke-[#27272a] dark:stroke-white/30" strokeWidth="1.8" />
            
            {/* Inner Black Bezel */}
            <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />

            {/* Transparent placeholder for positioning the image inside bezel */}
            <rect x="3" y="3" width="26" height="54" rx="3.2" fill="transparent" />
        </svg>

        {/* 1-to-1 Exact F Logo Image Overlay using icon.png */}
        <div className="absolute inset-0 flex items-center justify-center p-[6%] pointer-events-none">
            <div className="relative w-[85%] h-[90%] overflow-hidden rounded-[3px]">
                <Image
                    src="/icon.png"
                    alt="FonzKart Phone Screen Logo"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
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

