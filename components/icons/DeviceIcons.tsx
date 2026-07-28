'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- Compact Device SVG Icons for Logo Use ---

/** Smartphone icon — the primary/largest device */
export const PhoneIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 32 60" className={`drop-shadow-md ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="30" height="58" rx="4" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
        <rect x="2.5" y="2.5" width="27" height="55" rx="2.5" fill="#10B981" />
        {/* Notch */}
        <rect x="10" y="3" width="12" height="3" rx="1.5" className="fill-black dark:fill-white/80" />
        {/* F logo overlay */}
        <defs>
            <filter id="logoExtractF">
                <feColorMatrix type="matrix" values="5 0 0 0 -1  5 0 0 0 -1  5 0 0 0 -1  0 0 0 1 0" />
            </filter>
            <clipPath id="logoScreenClip">
                <rect x="2.5" y="2.5" width="27" height="55" rx="2.5" />
            </clipPath>
            <mask id="logoFMask">
                <image
                    href="/logo_final_v3.png"
                    x="-8" y="-6"
                    width="48" height="72"
                    preserveAspectRatio="xMidYMid meet"
                    filter="url(#logoExtractF)"
                />
            </mask>
        </defs>
        <rect x="-8" y="-6" width="48" height="72" fill="black" mask="url(#logoFMask)" clipPath="url(#logoScreenClip)" />
        {/* Screen shine */}
        <path d="M2.5 2.5H29.5V20L2.5 35V2.5Z" fill="white" fillOpacity="0.1" />
    </svg>
);/** Laptop icon */
export const LaptopIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 48 34" className={`drop-shadow-md ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Screen lid */}
        <rect x="4" y="1" width="40" height="26" rx="2" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
        {/* Screen content - Indigo */}
        <rect x="6" y="3" width="36" height="22" rx="1" fill="#6366F1" opacity="0.9" />
        {/* Code lines on screen */}
        <rect x="9" y="7" width="16" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="9" y="11" width="24" height="2" rx="1" fill="white" opacity="0.3" />
        <rect x="9" y="15" width="20" height="2" rx="1" fill="white" opacity="0.25" />
        {/* Screen shine */}
        <path d="M6 3H42V14L6 22V3Z" fill="white" fillOpacity="0.12" />
        {/* Keyboard base */}
        <path d="M0 27H48L46 33H2L0 27Z" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
        {/* Trackpad */}
        <rect x="18" y="29" width="12" height="2.5" rx="1" className="fill-slate-400 dark:fill-slate-500" />
    </svg>
);

/** Television / Smart TV icon */
export const TvIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 52 38" className={`drop-shadow-md ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* TV body */}
        <rect x="1" y="1" width="50" height="30" rx="2" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
        {/* Screen - Vivid Blue */}
        <rect x="3" y="3" width="46" height="26" rx="1" fill="#0284C7" opacity="0.95" />
        {/* Content blocks / Streaming cards */}
        <rect x="6" y="6" width="12" height="9" rx="1" fill="#EF4444" opacity="0.9" />
        <rect x="20" y="6" width="12" height="9" rx="1" fill="#F59E0B" opacity="0.9" />
        <rect x="34" y="6" width="12" height="9" rx="1" fill="#6366F1" opacity="0.9" />
        <rect x="6" y="18" width="40" height="4" rx="1" fill="white" opacity="0.3" />
        {/* Screen shine */}
        <path d="M3 3H49V16L3 26V3Z" fill="white" fillOpacity="0.1" />
        {/* Stand */}
        <path d="M20 31L26 37L32 31" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

/** Camera icon */
export const CameraIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 48 36" className={`drop-shadow-md ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flash hump */}
        <rect x="14" y="1" width="16" height="6" rx="2" className="fill-slate-500 dark:fill-slate-600" />
        {/* Camera body */}
        <rect x="2" y="7" width="44" height="28" rx="4" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
        {/* Lens outer ring */}
        <circle cx="24" cy="22" r="10" className="stroke-cyan-400 dark:stroke-cyan-300" strokeWidth="2" fill="none" />
        {/* Lens inner - Cyan glass */}
        <circle cx="24" cy="22" r="6" fill="#0EA5E9" opacity="0.9" />
        {/* Lens highlight */}
        <circle cx="22" cy="19" r="2" fill="white" opacity="0.5" />
        {/* Recording LED */}
        <circle cx="40" cy="12" r="2" fill="#ef4444" opacity="0.9" />
    </svg>
);

/** Smartwatch icon */
export const WatchIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 32 52" className={`drop-shadow-md ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top band */}
        <path d="M9 0H23V12H9Z" className="fill-slate-500 dark:fill-slate-600" />
        {/* Bottom band */}
        <path d="M9 40H23V52H9Z" className="fill-slate-500 dark:fill-slate-600" />
        {/* Watch body */}
        <rect x="2" y="10" width="28" height="32" rx="6" className="fill-[#0f172a] dark:fill-black stroke-slate-600 dark:stroke-white/30" strokeWidth="1.5" />
        {/* Screen - Dark OLED */}
        <rect x="5" y="13" width="22" height="26" rx="4" fill="#0F172A" />
        {/* Time display */}
        <rect x="8" y="17" width="16" height="4" rx="1" fill="#38BDF8" opacity="0.9" />
        {/* Activity ring - Coral Orange */}
        <circle cx="16" cy="30" r="5" className="stroke-slate-700" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="30" r="5" stroke="#F97316" strokeWidth="1.5" fill="none" strokeDasharray="20 12" strokeLinecap="round" />
        {/* Crown button */}
        <rect x="29" y="20" width="3" height="8" rx="1" className="fill-slate-400 dark:fill-slate-400" />
    </svg>
);

// --- Device definitions for cycling ---
export const DEVICE_LIST = [
    { key: 'phone', label: 'Phone', Icon: PhoneIcon },
    { key: 'laptop', label: 'Laptop', Icon: LaptopIcon },
    { key: 'tv', label: 'TV', Icon: TvIcon },
    { key: 'camera', label: 'Camera', Icon: CameraIcon },
    { key: 'watch', label: 'Watch', Icon: WatchIcon },
] as const;

// --- Cycling Device Icon Component ---

interface CyclingDeviceIconProps {
    /** Width/height container class, e.g. "w-5 h-8" */
    className?: string;
    /** Cycle interval in milliseconds (default 3000) */
    interval?: number;
    /** If true, phone icon is rendered slightly bigger than others */
    emphasizePhone?: boolean;
}

/**
 * Animates through device icons sequentially:
 * Phone → Laptop → TV → Camera → Watch → Phone …
 */
export const CyclingDeviceIcon = ({
    className = 'w-6 h-10',
    interval = 3000,
    emphasizePhone = true,
}: CyclingDeviceIconProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % DEVICE_LIST.length);
        }, interval);
        return () => clearInterval(timer);
    }, [interval]);

    const current = DEVICE_LIST[currentIndex];
    const isPhone = current.key === 'phone';

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.key}
                    initial={{ opacity: 0, scale: 0.7, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -4 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className={`absolute inset-0 flex items-center justify-center ${
                        emphasizePhone && isPhone ? 'scale-100' : emphasizePhone ? 'scale-[0.85]' : ''
                    }`}
                >
                    <current.Icon className="w-full h-full" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CyclingDeviceIcon;

// --- Multi-Gadget Composition (All devices tucked safely inside the cart basket) ---

interface MultiGadgetCompositionProps {
    className?: string;
}

/**
 * Renders all 5 gadget icons simultaneously in a compact, non-overlapping cluster
 * designed to sit DEEP INSIDE the shopping cart basket without sticking out left, right, or top:
 * - Phone: Center anchor (green screen with F logo)
 * - Smart TV: Right side (vivid blue screen, larger than laptop)
 * - Laptop: Left side (indigo screen + keyboard base)
 * - Camera: Top-left tucked (cyan lens)
 * - Smartwatch: Top-right tucked (OLED watch + orange ring)
 */
export const MultiGadgetComposition = ({
    className = '',
}: MultiGadgetCompositionProps) => {
    return (
        <div className={`relative w-[60px] h-[36px] flex items-center justify-center select-none ${className}`}>
            {/* 1. Center: Main Smartphone (Green Screen with F Logo) - Moved UP & Enlarged by 6% */}
            <motion.div
                animate={{ y: [-3, -4, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="z-30 relative w-[13.8px] h-[26.5px] drop-shadow-md scale-[1.06] -top-[3px]"
            >
                <PhoneIcon className="w-full h-full" />
            </motion.div>

            {/* 2. Left: Laptop (Indigo Screen) - Shifted rightward inside cart basket wall */}
            <motion.div
                animate={{ y: [0, 1, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute left-[6px] bottom-[1px] z-20 w-[22px] h-[15px] drop-shadow-sm"
            >
                <LaptopIcon className="w-full h-full" />
            </motion.div>

            {/* 3. Right: Smart TV (Vivid Blue Screen) - Tucked inside right basket wall, larger than laptop */}
            <motion.div
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute right-[0px] bottom-[0px] z-20 w-[26px] h-[19px] drop-shadow-sm"
            >
                <TvIcon className="w-full h-full" />
            </motion.div>

            {/* 4. Top-Left: DSLR Camera (Cyan Lens) - Tucked behind/above laptop */}
            <motion.div
                animate={{ y: [0, -1.2, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute left-[4px] top-[1px] z-15 w-[15px] h-[11px] drop-shadow-xs"
            >
                <CameraIcon className="w-full h-full" />
            </motion.div>

            {/* 5. Top-Right: Smart Watch (Dark OLED & Orange Ring) - Tucked behind/above TV */}
            <motion.div
                animate={{ y: [0, 1, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute right-[6px] top-[0px] z-15 w-[11px] h-[17px] drop-shadow-xs"
            >
                <WatchIcon className="w-full h-full" />
            </motion.div>
        </div>
    );
};




