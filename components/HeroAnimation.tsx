"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Banknote, ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

// Circular Cart Logo Component for SVGs
const CircularCartBadge = ({ radius = 18, id = "cart-badge" }: { radius?: number; id?: string }) => (
    <g id={id}>
        <circle cx="0" cy="0" r={radius} fill="#ffffff" stroke="#22c55e" strokeWidth={radius * 0.08} />
        {/* Cart base & basket in SVG vectors */}
        <g transform={`scale(${radius / 22}) translate(-14, -14)`}>
            <path d="M 4 5 L 8 5 L 11 18 C 11.5 20 13 21 15 21 L 23 21 C 25 21 26 19.5 26.5 18 L 28 10 L 9 10" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="24" r="2" fill="#16a34a" />
            <circle cx="24" cy="24" r="2" fill="#16a34a" />
            {/* Mini Gadgets inside cart */}
            <rect x="12" y="5" width="4" height="6" rx="1" fill="#0284c7" />
            <rect x="17" y="3" width="7" height="8" rx="1" fill="#0f172a" stroke="#22c55e" strokeWidth="0.8" />
            <circle cx="19" cy="7" r="1.2" fill="#ef4444" />
        </g>
    </g>
);

// -----------------------------------------------------------------------------
// 1. SMARTPHONES GROUP (3 Fanned Phones)
// -----------------------------------------------------------------------------
const SmartphonesGroupSVG = () => (
    <svg viewBox="0 0 360 260" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="hero-phone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="hero-phone-wave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
            <clipPath id="center-phone-clip">
                <rect x="-44" y="-88" width="88" height="176" rx="14" />
            </clipPath>
        </defs>

        {/* LEFT PHONE (ANGLED) */}
        <g transform="translate(110, 130) rotate(-13) scale(0.85)" opacity="0.85">
            <rect x="-48" y="-95" width="96" height="190" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-44" y="-91" width="88" height="182" rx="14" fill="#020617" />
            <path d="M -44 10 Q 0 -30 44 10 L 44 91 L -44 91 Z" fill="url(#hero-phone-wave)" opacity="0.4" />
        </g>

        {/* RIGHT PHONE (ANGLED) */}
        <g transform="translate(250, 130) rotate(13) scale(0.85)" opacity="0.85">
            <rect x="-48" y="-95" width="96" height="190" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-44" y="-91" width="88" height="182" rx="14" fill="#020617" />
            <path d="M -44 10 Q 0 -30 44 10 L 44 91 L -44 91 Z" fill="url(#hero-phone-wave)" opacity="0.4" />
        </g>

        {/* CENTER MAIN PHONE (FRONT & GLOWING) */}
        <g transform="translate(180, 125)">
            <rect x="-50" y="-98" width="100" height="196" rx="20" fill="#0f172a" stroke="#22c55e" strokeWidth="3" />
            <rect x="-46" y="-94" width="92" height="188" rx="16" fill="#000000" />

            <g clipPath="url(#center-phone-clip)">
                <rect x="-44" y="-88" width="88" height="176" rx="14" fill="url(#hero-phone-grad)" />

                {/* Wave Art */}
                <path d="M -44 15 Q -10 -25 44 15 L 44 88 L -44 88 Z" fill="url(#hero-phone-wave)" opacity="0.6" />

                {/* Dynamic Island */}
                <rect x="-16" y="-84" width="32" height="8" rx="4" fill="#000000" />
                <circle cx="9" cy="-80" r="1.5" fill="#0284c7" />

                {/* Status bar */}
                <text x="-36" y="-78" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="5.5" fill="#ffffff">9:41</text>
                <rect x="28" y="-82" width="6" height="3.5" rx="1" stroke="#ffffff" strokeWidth="0.6" fill="none" />
                <rect x="29" y="-81" width="3.5" height="1.8" rx="0.5" fill="#22c55e" />

                {/* Circular Cart Logo in Top Right */}
                <g transform="translate(26, -58)">
                    <CircularCartBadge radius={11} id="phone-cart" />
                </g>

                {/* Verified Center Shield */}
                <g transform="translate(0, -6)">
                    <circle cx="0" cy="0" r="20" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.2" />
                    <path d="M -8 0 L -2 6 L 9 -5" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="-22" y="28" width="44" height="4" rx="2" fill="#ffffff" fillOpacity="0.4" />
                    <rect x="-15" y="35" width="30" height="3" rx="1.5" fill="#38bdf8" fillOpacity="0.6" />
                </g>

                {/* Home Indicator */}
                <rect x="-20" y="80" width="40" height="2" rx="1" fill="#ffffff" fillOpacity="0.75" />
            </g>
        </g>
    </svg>
);

// -----------------------------------------------------------------------------
// 2. LAPTOPS GROUP (3 Fanned Laptops)
// -----------------------------------------------------------------------------
const LaptopsGroupSVG = () => (
    <svg viewBox="0 0 360 260" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="hero-laptop-screen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
            <clipPath id="center-laptop-clip">
                <rect x="-70" y="-62" width="140" height="82" rx="3" />
            </clipPath>
        </defs>

        {/* LEFT LAPTOP */}
        <g transform="translate(100, 115) rotate(-10) scale(0.78)" opacity="0.85">
            <rect x="-75" y="-68" width="150" height="92" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="-71" y="-64" width="142" height="84" rx="3" fill="#020617" />
            <path d="M -75 25 L 75 25 L 90 60 L -90 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        </g>

        {/* RIGHT LAPTOP */}
        <g transform="translate(260, 115) rotate(10) scale(0.78)" opacity="0.85">
            <rect x="-75" y="-68" width="150" height="92" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="-71" y="-64" width="142" height="84" rx="3" fill="#020617" />
            <path d="M -75 25 L 75 25 L 90 60 L -90 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        </g>

        {/* CENTER MAIN LAPTOP */}
        <g transform="translate(180, 135)">
            {/* Screen Lid */}
            <rect x="-76" y="-70" width="152" height="94" rx="6" fill="#0f172a" stroke="#22c55e" strokeWidth="2.5" />
            <rect x="-72" y="-66" width="144" height="86" rx="4" fill="#000000" />

            <g clipPath="url(#center-laptop-clip)">
                <rect x="-70" y="-62" width="140" height="82" rx="3" fill="url(#hero-laptop-screen)" />

                {/* Window Dots & Mock Code */}
                <circle cx="-60" cy="-52" r="2" fill="#ef4444" />
                <circle cx="-54" cy="-52" r="2" fill="#f59e0b" />
                <circle cx="-48" cy="-52" r="2" fill="#22c55e" />

                <rect x="-60" y="-42" width="50" height="4" rx="1.5" fill="#22c55e" fillOpacity="0.8" />
                <rect x="-60" y="-34" width="65" height="3" rx="1" fill="#ffffff" fillOpacity="0.35" />
                <rect x="-60" y="-28" width="45" height="3" rx="1" fill="#ffffff" fillOpacity="0.25" />
                <rect x="-60" y="-22" width="55" height="3" rx="1" fill="#22c55e" fillOpacity="0.6" />

                {/* Circular Cart Logo Top Right */}
                <g transform="translate(50, -42)">
                    <CircularCartBadge radius={12} id="laptop-cart" />
                </g>
            </g>

            {/* Base */}
            <path d="M -76 25 L 76 25 L 94 65 L -94 65 Z" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            {/* Keyboard Well */}
            <path d="M -68 28 L 68 28 L 78 46 L -78 46 Z" fill="#0b1120" />
            {/* Glowing Spacebar */}
            <rect x="-22" y="42" width="44" height="3" rx="1" fill="#22c55e" fillOpacity="0.6" stroke="#22c55e" strokeWidth="0.8" />
            {/* Trackpad */}
            <rect x="-20" y="49" width="40" height="13" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
        </g>
    </svg>
);

// -----------------------------------------------------------------------------
// 3. TABLETS GROUP (3 Fanned Tablets)
// -----------------------------------------------------------------------------
const TabletsGroupSVG = () => (
    <svg viewBox="0 0 360 260" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="hero-tab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="50%" stopColor="#042f2e" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <clipPath id="center-tab-clip">
                <rect x="-52" y="-78" width="104" height="156" rx="10" />
            </clipPath>
        </defs>

        {/* LEFT TABLET */}
        <g transform="translate(110, 130) rotate(-13) scale(0.85)" opacity="0.85">
            <rect x="-56" y="-84" width="112" height="168" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-52" y="-80" width="104" height="160" rx="10" fill="#020617" />
        </g>

        {/* RIGHT TABLET */}
        <g transform="translate(250, 130) rotate(13) scale(0.85)" opacity="0.85">
            <rect x="-56" y="-84" width="112" height="168" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-52" y="-80" width="104" height="160" rx="10" fill="#020617" />
        </g>

        {/* CENTER MAIN TABLET */}
        <g transform="translate(180, 125)">
            <rect x="-58" y="-86" width="116" height="172" rx="16" fill="#0f172a" stroke="#22c55e" strokeWidth="3" />
            <rect x="-54" y="-82" width="108" height="164" rx="12" fill="#000000" />

            <g clipPath="url(#center-tab-clip)">
                <rect x="-52" y="-78" width="104" height="156" rx="10" fill="url(#hero-tab-grad)" />

                {/* Creative Waves */}
                <circle cx="0" cy="5" r="28" fill="rgba(34,197,94,0.18)" stroke="#22c55e" strokeWidth="1.2" />
                <path d="M -28 18 Q 0 -25 28 18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -20 24 Q 0 -8 20 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />

                {/* Circular Cart Logo Top Right */}
                <g transform="translate(32, -54)">
                    <CircularCartBadge radius={12} id="tab-cart" />
                </g>
            </g>

            {/* Pencil Pro Snapped on Right */}
            <g transform="translate(62, -55)">
                <rect x="0" y="0" width="5" height="110" rx="2.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
                <path d="M 0 110 L 2.5 119 L 5 110 Z" fill="#cbd5e1" />
                <circle cx="2.5" cy="119" r="0.8" fill="#0f172a" />
            </g>
        </g>
    </svg>
);

// -----------------------------------------------------------------------------
// 4. SMARTWATCHES GROUP (3 Fanned Watches)
// -----------------------------------------------------------------------------
const WatchesGroupSVG = () => (
    <svg viewBox="0 0 360 260" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="center-watch-clip">
                <rect x="-32" y="-42" width="64" height="84" rx="14" />
            </clipPath>
        </defs>

        {/* LEFT WATCH */}
        <g transform="translate(110, 130) rotate(-13) scale(0.85)" opacity="0.85">
            <path d="M -20 -80 L 20 -80 L 16 -45 L -16 -45 Z" fill="#334155" />
            <path d="M -16 45 L 16 45 L 20 80 L -20 80 Z" fill="#334155" />
            <rect x="-36" y="-46" width="72" height="92" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-32" y="-42" width="64" height="84" rx="14" fill="#000000" />
        </g>

        {/* RIGHT WATCH */}
        <g transform="translate(250, 130) rotate(13) scale(0.85)" opacity="0.85">
            <path d="M -20 -80 L 20 -80 L 16 -45 L -16 -45 Z" fill="#334155" />
            <path d="M -16 45 L 16 45 L 20 80 L -20 80 Z" fill="#334155" />
            <rect x="-36" y="-46" width="72" height="92" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="-32" y="-42" width="64" height="84" rx="14" fill="#000000" />
        </g>

        {/* CENTER MAIN WATCH */}
        <g transform="translate(180, 130)">
            {/* Straps */}
            <path d="M -22 -85 L 22 -85 L 18 -48 L -18 -48 Z" fill="#334155" stroke="#475569" strokeWidth="1.2" />
            <path d="M -18 48 L 18 48 L 22 85 L -22 85 Z" fill="#334155" stroke="#475569" strokeWidth="1.2" />

            {/* Case */}
            <rect x="-38" y="-48" width="76" height="96" rx="20" fill="#0f172a" stroke="#22c55e" strokeWidth="3" />
            <rect x="38" y="-30" width="5" height="18" rx="2.5" fill="#22c55e" />

            <g clipPath="url(#center-watch-clip)">
                <rect x="-32" y="-42" width="64" height="84" rx="14" fill="#000000" />

                {/* Mini Circular Cart Logo at Top */}
                <g transform="translate(0, -28)">
                    <CircularCartBadge radius={7.5} id="watch-cart" />
                </g>

                {/* Digital Time */}
                <text x="0" y="-12" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="9" fill="#ffffff" textAnchor="middle">10:45</text>

                {/* Activity Rings */}
                <g transform="translate(0, 12)">
                    <circle r="16" stroke="#1e293b" strokeWidth="3" fill="none" />
                    <circle r="16" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="75 100" fill="none" transform="rotate(-90)" />
                    <circle r="12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeDasharray="55 75" fill="none" transform="rotate(-90)" />
                    <circle r="8" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="35 50" fill="none" transform="rotate(-90)" />
                </g>

                {/* Heart Pulse */}
                <path d="M -8 34 L -4 34 L -2 30 L 0 38 L 2 32 L 4 34 L 8 34" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
            </g>
        </g>
    </svg>
);

// -----------------------------------------------------------------------------
// 5. CAMERAS GROUP (3 Fanned Cameras)
// -----------------------------------------------------------------------------
const CamerasGroupSVG = () => (
    <svg viewBox="0 0 360 260" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* LEFT CAMERA */}
        <g transform="translate(105, 115) rotate(-10) scale(0.82)" opacity="0.85">
            <polygon points="-24,-45 -9,-60 21,-60 36,-45" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <rect x="-72" y="-45" width="144" height="102" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="10" cy="5" r="44" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        </g>

        {/* RIGHT CAMERA */}
        <g transform="translate(255, 115) rotate(10) scale(0.82)" opacity="0.85">
            <polygon points="-24,-45 -9,-60 21,-60 36,-45" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <rect x="-72" y="-45" width="144" height="102" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="10" cy="5" r="44" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        </g>

        {/* CENTER MAIN CAMERA */}
        <g transform="translate(180, 130)">
            <polygon points="-24,-45 -9,-60 21,-60 36,-45" fill="#0f172a" stroke="#22c55e" strokeWidth="2.5" />
            <rect x="-75" y="-45" width="150" height="106" rx="14" fill="#0f172a" stroke="#22c55e" strokeWidth="3" />
            <rect x="-68" y="-38" width="26" height="92" rx="6" fill="#1e293b" />

            {/* Lens Rings */}
            <circle cx="12" cy="8" r="46" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="12" cy="8" r="40" stroke="#ef4444" strokeWidth="1.8" fill="none" />
            <circle cx="12" cy="8" r="34" fill="#030712" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="12" cy="8" r="26" fill="#064e3b" fillOpacity="0.8" />
            <circle cx="12" cy="8" r="16" fill="#0ea5e9" fillOpacity="0.85" />
            <circle cx="6" cy="1" r="7" fill="#ffffff" fillOpacity="0.45" />

            {/* 4K PRO Tag */}
            <g transform="translate(42, 36)">
                <rect width="28" height="13" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                <text x="14" y="9.5" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="5" fill="#4ade80" textAnchor="middle">4K PRO</text>
            </g>
        </g>
    </svg>
);

// -----------------------------------------------------------------------------
// Category Groups Config
// -----------------------------------------------------------------------------
const DEFAULT_GROUPS = [
    {
        id: "phones",
        name: "Smartphones",
        value: "₹1,29,000+",
        Component: SmartphonesGroupSVG,
    },
    {
        id: "laptops",
        name: "Laptops",
        value: "₹1,49,000+",
        Component: LaptopsGroupSVG,
    },
    {
        id: "tablets",
        name: "Tablets",
        value: "₹1,20,000+",
        Component: TabletsGroupSVG,
    },
    {
        id: "watches",
        name: "Smartwatches",
        value: "₹65,000+",
        Component: WatchesGroupSVG,
    },
    {
        id: "cameras",
        name: "Cameras",
        value: "₹1,85,000+",
        Component: CamerasGroupSVG,
    }
];

export default function HeroAnimation({ displayPrices = [] }: { displayPrices?: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Map dynamic prices to groups if provided
    const groups = DEFAULT_GROUPS.map(g => {
        const custom = displayPrices.find(p => p.categoryKey === g.id);
        if (custom && custom.displayPrice) {
            return { ...g, value: custom.displayPrice };
        }
        return g;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % groups.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [groups.length]);

    const group = groups[currentIndex] || groups[0];
    const ActiveGroupSVG = group.Component;

    return (
        <div className="relative w-full h-full flex flex-row items-center justify-center overflow-visible select-none">
            {/* Ambient Multi-layer Halo */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute w-72 h-72 md:w-[450px] md:h-[450px] bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-[90px] animate-pulse" />
                <div className="absolute w-48 h-48 md:w-[300px] md:h-[300px] bg-teal-400/10 rounded-full blur-[60px]" />
            </div>

            {/* Main Interactive Flow Container */}
            <div className="relative z-10 flex flex-row items-center justify-center gap-3 sm:gap-8 md:gap-12 w-full max-w-5xl px-0 origin-center scale-[0.62] sm:scale-100 mt-4 sm:mt-0">

                {/* 1. LEFT: 3-DEVICE FAN STACK */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-72 shrink-0 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={group.id}
                            initial={{ scale: 0.88, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0, y: -15 }}
                            transition={{ type: "spring", stiffness: 120, damping: 16 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <ActiveGroupSVG />
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom Category Chip */}
                    <div className="absolute -bottom-2 sm:-bottom-6 left-0 right-0 text-center z-20">
                        <motion.div
                            key={`label-${group.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="inline-flex items-center gap-1.5 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 backdrop-blur-md px-6 py-2 rounded-full shadow-2xl border border-emerald-500/40"
                        >
                            <Zap className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 fill-emerald-400" />
                            <span className="text-xs font-black uppercase tracking-[0.18em] whitespace-nowrap">{group.name}</span>
                        </motion.div>
                    </div>
                </div>

                {/* 2. MIDDLE: GLOWING PULSE FLOW ARROW */}
                <div className="relative z-30 shrink-0 mx-1 sm:mx-3 flex flex-col items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/25 flex items-center justify-center"
                    >
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-emerald-400/30">
                            <motion.div
                                animate={{ x: [-2, 3, -2] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowRight className="text-emerald-400 w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Instant
                    </span>
                </div>

                {/* 3. RIGHT: 3D MULTI-LAYER CASH STACK */}
                <div className="relative w-56 sm:w-64 h-48 sm:h-64 shrink-0 flex flex-col items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`cash-${group.id}`}
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.4 }}
                            >
                                {[2, 1, 0].map((offset) => (
                                    <motion.div
                                        key={offset}
                                        initial={{ y: 35, opacity: 0, scale: 0.9 }}
                                        animate={{
                                            y: offset * -16,
                                            opacity: 1,
                                            scale: 1 - offset * 0.04,
                                            rotate: offset * -3
                                        }}
                                        transition={{ delay: offset * 0.08, type: "spring", stiffness: 140, damping: 15 }}
                                        className={`absolute w-44 sm:w-56 h-28 sm:h-32 rounded-2xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden border ${
                                            offset === 0
                                                ? "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-900 border-white/30 text-white z-30 shadow-emerald-500/30"
                                                : offset === 1
                                                ? "bg-gradient-to-br from-emerald-600 to-teal-950 border-emerald-400/20 text-white/90 z-20"
                                                : "bg-gradient-to-br from-teal-800 to-slate-950 border-emerald-500/10 text-white/70 z-10"
                                        }`}
                                        style={{ top: "35%" }}
                                    >
                                        {/* Security Foil Band */}
                                        <div className="absolute top-0 right-10 w-4 h-full bg-gradient-to-b from-yellow-300/30 via-yellow-200/10 to-transparent pointer-events-none transform -skew-x-12" />

                                        {/* Top Card Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="p-1 rounded-lg bg-white/20 backdrop-blur-sm">
                                                    <Banknote className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">FONZKART PAY</span>
                                            </div>
                                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: "6s" }} />
                                        </div>

                                        {/* Live Payout Amount */}
                                        <div className="my-1 flex items-baseline gap-1">
                                            <span className="font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-md">
                                                {group.value}
                                            </span>
                                        </div>

                                        {/* Bottom Trust Badge */}
                                        <div className="flex items-center justify-between pt-1 border-t border-white/15">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                                                <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider">Direct Bank / Cash</span>
                                            </div>
                                            <span className="text-[8.5px] font-extrabold text-emerald-200 bg-black/30 px-2 py-0.5 rounded-full">
                                                3 Hrs Pickup
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
