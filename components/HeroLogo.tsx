'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

            {/* F Logo Mask Extraction */}
            <defs>
                <filter id="heroExtractF">
                    <feColorMatrix type="matrix" values="5 0 0 0 -1  5 0 0 0 -1  5 0 0 0 -1  0 0 0 1 0" />
                </filter>
                <clipPath id="heroScreenClip">
                    <rect x="2.5" y="2.5" width="27" height="53" rx="2.5" />
                </clipPath>
                <mask id="heroFMask">
                    <image
                        href="/logo_final_v3.png"
                        x="-8"
                        y="-6"
                        width="48"
                        height="70"
                        preserveAspectRatio="xMidYMid meet"
                        filter="url(#heroExtractF)"
                    />
                </mask>
            </defs>

            {/* Black F Overlay (Solid, No Blinking) */}
            <rect
                x="-8"
                y="-6"
                width="48"
                height="70"
                fill="black"
                mask="url(#heroFMask)"
                clipPath="url(#heroScreenClip)"
            />

            {/* Top Speaker Notch */}
            <rect x="10" y="3" width="12" height="2.5" rx="1.2" className="fill-black dark:fill-white/80" />

            {/* Screen Glass Reflection Shine */}
            <path d="M2.5 2.5H29.5V18L2.5 32V2.5Z" fill="white" fillOpacity="0.12" />
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

            {/* Rupee '₹' Symbol (Vibrant Green R replacement) */}
            <motion.span
                animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="font-black text-3xl sm:text-4xl text-emerald-500 font-heading mx-0.5 inline-block"
            >
                ₹
            </motion.span>

            {/* T */}
            <span className={`font-black text-3xl sm:text-4xl tracking-tight font-heading ${textClass}`}>
                T
            </span>
        </div>
    );
};

export default HeroLogo;

