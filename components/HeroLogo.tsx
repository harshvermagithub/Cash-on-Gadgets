'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Image from 'next/image';

/** Vector Smartphone with F Logo Mask & Pulsing Screen Animation */
const SmartphoneFLogo = () => (
    <div className="relative w-8 sm:w-10 h-11 sm:h-14 flex items-center justify-center shrink-0 drop-shadow-md">
        <svg viewBox="0 0 32 58" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Phone Frame */}
            <rect x="1" y="1" width="30" height="56" rx="4" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
            
            {/* Solid Green Screen */}
            <rect
                x="2.5"
                y="2.5"
                width="27"
                height="53"
                rx="2.5"
                fill="#10B981"
            />

            {/* Top Speaker Notch */}
            <rect x="10" y="3" width="12" height="2.5" rx="1.2" className="fill-black dark:fill-white/80" />

            {/* Screen Glass Reflection Shine */}
            <path d="M2.5 2.5H29.5V18L2.5 32V2.5Z" fill="white" fillOpacity="0.12" />
        </svg>

        {/* F Logo Image Overlay — 100% Mobile & WebKit Compatible */}
        <div className="absolute inset-0 flex items-center justify-center p-[4px] pointer-events-none">
            <div className="relative w-[75%] h-[75%] flex items-center justify-center overflow-hidden">
                <Image
                    src="/logo_final_v3.png"
                    alt="FonzKart F Logo"
                    fill
                    className="object-contain"
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

