'use client'

import React, { useEffect, useState } from 'react';
import { motion, Transition } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const SmartphoneSVG = ({ isDark }: { isDark: boolean }) => (
    <svg width="100%" height="100%" viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="1"
            y="1"
            width="30"
            height="58"
            rx="4"
            strokeWidth="1.5"
            style={{
                fill: isDark ? '#000000' : '#0f172a',
                stroke: isDark ? 'white' : '#334155'
            }}
            className="transition-colors duration-300"
        />
        <rect x="2.5" y="2.5" width="27" height="55" rx="2.5" fill="#10B981" />
        <defs>
            <filter id="extractF">
                <feColorMatrix type="matrix" values="5 0 0 0 -1  5 0 0 0 -1  5 0 0 0 -1  0 0 0 1 0" />
            </filter>
            <clipPath id="screenClip">
                <rect x="2.5" y="2.5" width="27" height="55" rx="2.5" />
            </clipPath>
            <mask id="fMask">
                <image
                    href="/logo_final_v3.png"
                    x="-8"
                    y="-6"
                    width="48"
                    height="72"
                    preserveAspectRatio="xMidYMid meet"
                    filter="url(#extractF)"
                />
            </mask>
        </defs>
        <rect
            x="-8"
            y="-6"
            width="48"
            height="72"
            fill="black"
            mask="url(#fMask)"
            clipPath="url(#screenClip)"
        />
        <rect
            x="10"
            y="3"
            width="12"
            height="3"
            rx="1.5"
            style={{ fill: isDark ? 'white' : 'black' }}
            className="transition-colors duration-300"
        />
        <path d="M2.5 2.5H29.5V20L2.5 35V2.5Z" fill="white" fillOpacity="0.1" />
    </svg>
);

const RupeeNoteSVG = ({ isDark }: { isDark: boolean }) => (
    <svg width="100%" height="100%" viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="1"
            y="1"
            width="38"
            height="68"
            rx="2"
            strokeWidth="1"
            style={{
                fill: isDark ? '#cbd5e1' : '#e2e8f0',
                stroke: isDark ? '#94a3b8' : '#64748b'
            }}
            className="transition-colors duration-300"
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
        <path
            d="M2 24H38M2 46H38"
            style={{ stroke: isDark ? '#64748b' : '#94a3b8' }}
            strokeWidth="0.5"
            className="transition-colors duration-300"
        />
    </svg>
);

export const HeroLogo = ({ className = "" }: { className?: string }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Animation constants
    const cycleDuration = 4;

    // TYPED TRANSITION SETTINGS TO FIX BUILD ERROR
    const transitionSettings: Transition = {
        duration: cycleDuration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.5, 0.9, 1]
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === 'dark');
    const textClass = isDark ? 'text-white' : 'text-slate-900';

    return (
        <div className={`flex items-center gap-1 select-none ${className}`} aria-label="Fonzkart">
            {/* F / Smartphone Animation */}
            <div className="relative w-8 h-12 flex items-center justify-center mr-0.5">
                {/* State 1: F Logo Image */}
                <motion.div
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={transitionSettings}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div
                        className="relative w-full h-full p-0.5 transition-[filter] duration-300"
                        style={{ filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none' }}
                    >
                        <Image
                            src="/logo_final_v3.png"
                            alt="F"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* State 2: Smartphone SVG */}
                <motion.div
                    animate={{ opacity: [1, 1, 0, 0, 1] }}
                    transition={transitionSettings}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <SmartphoneSVG isDark={isDark} />
                </motion.div>
            </div>

            {/* O N Z K A */}
            <div className="flex items-center tracking-tighter">
                <span className={`font-black text-4xl tracking-tight transition-colors duration-300 ${textClass}`}>ONZKA</span>
            </div>

            {/* R / Rupee Animation */}
            <div className="relative w-9 h-14 flex items-center justify-center mx-1">
                {/* State 1: Rupee Symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-black text-4xl transition-colors duration-300 ${textClass}`}>₹</span>
                </div>

                {/* State 2: 500 Note SVG */}
                <motion.div
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <div className="w-full h-full scale-[1.05]">
                        <RupeeNoteSVG isDark={isDark} />
                    </div>
                </motion.div>
            </div>

            {/* T */}
            <div className="flex items-center tracking-tighter">
                <span className={`font-black text-4xl transition-colors duration-300 ${textClass}`}>T</span>
            </div>

        </div>
    );
};
export default HeroLogo;
