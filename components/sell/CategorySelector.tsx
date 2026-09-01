'use client';

import { motion } from 'framer-motion';

interface CategorySelectorProps {
    onSelect: (category: string) => void;
}

// --- Cart Logo Badge Helper ---
const CartLogoBadge = ({ width = 20 }: { width?: number }) => {
    const height = Math.round(width * (579 / 713));
    return (
        <image x={-width / 2} y={-height / 2} width={width} height={height} href="/fonzkart_cart_exact_transparent.png" preserveAspectRatio="xMidYMid meet" />
    );
};

// --- Animated SVG Components ---

const SmartphoneGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Tilted Phone */}
        <motion.g
            animate={{ y: [0, -3, 0], rotate: [-16, -18, -16] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '40px 90px' }}
        >
            <g transform="translate(25, 26)">
                <rect x="0" y="0" width="46" height="96" rx="11" className="fill-slate-800/90 stroke-slate-700" strokeWidth="1.5" />
                <rect x="3" y="3" width="40" height="90" rx="8" className="fill-[#020617]" />
                <circle cx="23" cy="48" r="16" className="fill-blue-600/30" />
                <rect x="8" y="14" width="9" height="9" rx="2.5" className="fill-blue-400/80" />
                <rect x="21" y="14" width="9" height="9" rx="2.5" className="fill-purple-400/80" />
                <rect x="8" y="68" width="28" height="12" rx="3" className="fill-slate-800/80 stroke-slate-700/60" strokeWidth="0.8" />
                <line x1="12" y1="74" x2="30" y2="74" className="stroke-cyan-400" strokeWidth="1.2" strokeLinecap="round" />
            </g>
        </motion.g>

        {/* Right Tilted Phone */}
        <motion.g
            animate={{ y: [0, -4, 0], rotate: [16, 18, 16] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: '160px 90px' }}
        >
            <g transform="translate(130, 22)">
                <rect x="0" y="0" width="48" height="98" rx="11" className="fill-slate-800/90 stroke-slate-700" strokeWidth="1.5" />
                <rect x="3" y="3" width="42" height="92" rx="8" className="fill-[#020617]" />
                <circle cx="24" cy="50" r="16" className="fill-emerald-600/30" />
                <rect x="8" y="14" width="9" height="9" rx="2.5" className="fill-emerald-400/80" />
                <rect x="21" y="14" width="9" height="9" rx="2.5" className="fill-amber-400/80" />
                <rect x="8" y="70" width="28" height="12" rx="3" className="fill-slate-800/80 stroke-slate-700/60" strokeWidth="0.8" />
                <circle cx="14" cy="76" r="2" className="fill-emerald-400" />
                <line x1="19" y1="76" x2="31" y2="76" className="stroke-emerald-400" strokeWidth="1.2" strokeLinecap="round" />
            </g>
        </motion.g>

        {/* Center Hero Flagship Smartphone */}
        <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
            <g transform="translate(68, 12)">
                <rect x="0" y="0" width="64" height="122" rx="15" className="fill-slate-900 stroke-slate-700 shadow-xl" strokeWidth="2" />
                <rect x="4" y="4" width="56" height="114" rx="11" className="fill-[#020617]" />

                {/* Dynamic Island */}
                <rect x="22" y="7" width="20" height="5" rx="2.5" className="fill-black" />

                {/* OLED Wallpaper Waves */}
                <g clipPath="url(#phone-screen-clip)">
                    <clipPath id="phone-screen-clip">
                        <rect x="4" y="4" width="56" height="114" rx="11" />
                    </clipPath>
                    
                    <motion.circle cx="28" cy="65" r="32" className="fill-blue-600/30" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                    <motion.circle cx="38" cy="85" r="26" className="fill-emerald-500/25" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 4, repeat: Infinity }} />

                    {/* App Grid */}
                    <g transform="translate(10, 18)">
                        <rect x="0" y="0" width="10" height="10" rx="3" className="fill-blue-500" />
                        <rect x="14" y="0" width="10" height="10" rx="3" className="fill-emerald-500" />
                        <rect x="28" y="0" width="10" height="10" rx="3" className="fill-amber-500" />
                    </g>

                    {/* Embedded Logo Badge */}
                    <g transform="translate(32, 48)">
                        <CartLogoBadge width={26} />
                    </g>

                    {/* Glowing Audio / Activity Wave Widget */}
                    <rect x="8" y="72" width="48" height="26" rx="6" className="fill-slate-800/80 stroke-slate-700/60" strokeWidth="1" />
                    <motion.path
                        d="M 12 85 Q 20 77 30 85 T 46 85"
                        className="stroke-emerald-400 fill-none" strokeWidth="2" strokeLinecap="round"
                        animate={{ pathLength: [0.2, 1, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </g>
            </g>
        </motion.g>
    </svg>
);

const TabletGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Background Tablet Frame */}
            <g transform="translate(68, 20) rotate(10)">
                <rect x="0" y="0" width="92" height="118" rx="10" className="fill-slate-800/70 stroke-slate-700" strokeWidth="1.5" />
                <rect x="4" y="4" width="84" height="110" rx="7" className="fill-purple-950/40" />
            </g>

            {/* Front Tablet */}
            <g transform="translate(30, 26)">
                <rect x="0" y="0" width="124" height="96" rx="10" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="4" y="4" width="116" height="88" rx="7" className="fill-[#020617]" />

                {/* Creative Studio Canvas */}
                <g clipPath="url(#tablet-clip-screen)">
                    <clipPath id="tablet-clip-screen">
                        <rect x="4" y="4" width="116" height="88" rx="7" />
                    </clipPath>

                    {/* Ambient Art Gradient */}
                    <circle cx="60" cy="50" r="38" className="fill-purple-600/30" />
                    <circle cx="90" cy="58" r="28" className="fill-pink-500/25" />

                    {/* Vector Wave Graph */}
                    <motion.path
                        d="M 10 65 Q 40 25 70 50 T 114 35"
                        className="stroke-purple-400 fill-none" strokeWidth="2.5" strokeLinecap="round"
                        animate={{ pathLength: [0.3, 1, 0.3] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Tools Palette (Left) */}
                    <rect x="8" y="10" width="22" height="65" rx="4" className="fill-slate-800/80 stroke-slate-700" strokeWidth="1" />
                    <circle cx="19" cy="20" r="4" className="fill-purple-400" />
                    <circle cx="19" cy="32" r="4" className="fill-pink-400" />
                    <circle cx="19" cy="44" r="4" className="fill-blue-400" />
                    <rect x="13" y="54" width="12" height="3" rx="1.5" className="fill-emerald-400" />

                    {/* Logo in Corner (Top-Right of screen, shifted up & right) */}
                    <g transform="translate(105, 16)">
                        <CartLogoBadge width={22} />
                    </g>
                </g>

                {/* Magnetic Stylus Pen (Hovering Top) */}
                <motion.g
                    transform="translate(45, -8) rotate(-15)"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <rect x="0" y="0" width="55" height="5" rx="2.5" className="fill-white stroke-slate-300" strokeWidth="1" />
                    <polygon points="55,0 60,2.5 55,5" className="fill-slate-800" />
                </motion.g>
            </g>
        </motion.g>
    </svg>
);

const WatchGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Left Fitness Tracker */}
            <g transform="translate(35, 25) rotate(-8)">
                <path d="M 20 0 V 22 M 20 78 V 100" stroke="#475569" strokeWidth="32" strokeLinecap="round" />
                <rect x="0" y="20" width="40" height="60" rx="10" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="4" y="24" width="32" height="52" rx="6" className="fill-black" />
                <circle cx="20" cy="50" r="10" className="stroke-orange-500" strokeWidth="2.5" fill="none" />
                <text x="20" y="53" textAnchor="middle" fill="#f97316" fontSize="5" fontWeight="bold" style={{ fontFamily: 'monospace' }}>8,420</text>
            </g>

            {/* Right Premium Smartwatch */}
            <g transform="translate(100, 20)">
                <path d="M 32 0 V 24 M 32 80 V 104" stroke="#ea580c" strokeWidth="36" strokeLinecap="round" />
                <rect x="2" y="20" width="60" height="64" rx="16" className="fill-slate-900 stroke-slate-700" strokeWidth="2.5" />
                <rect x="6" y="24" width="52" height="56" rx="12" className="fill-black" />

                {/* Digital Crown */}
                <rect x="62" y="34" width="4" height="14" rx="2" className="fill-slate-600" />

                {/* OLED Rings */}
                <circle cx="32" cy="52" r="18" className="stroke-red-500/40" strokeWidth="3" fill="none" />
                <circle cx="32" cy="52" r="14" className="stroke-emerald-500/40" strokeWidth="3" fill="none" />

                <motion.circle
                    cx="32" cy="52" r="18"
                    className="stroke-red-500" strokeWidth="3" fill="none"
                    strokeDasharray="60 120"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '32px 52px' }}
                />
                <motion.circle
                    cx="32" cy="52" r="14"
                    className="stroke-emerald-400" strokeWidth="3" fill="none"
                    strokeDasharray="45 100"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '32px 52px' }}
                />

                {/* Logo Badge inside watch face (optically balanced slightly right) */}
                <g transform="translate(31, 52)">
                    <CartLogoBadge width={18} />
                </g>
            </g>
        </motion.g>
    </svg>
);

const ConsoleGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Left Standing Console Tower */}
            <g transform="translate(14, 22) rotate(-10)">
                <path d="M 0 0 Q 4 42 0 84 H 18 Q 14 42 18 0 Z" className="fill-white stroke-slate-300" strokeWidth="1.2" />
                <rect x="3" y="4" width="12" height="76" rx="2" className="fill-slate-900" />
                <line x1="5" y1="10" x2="5" y2="72" className="stroke-cyan-400" strokeWidth="1.2" />
            </g>

            {/* Right Standing Console Tower */}
            <g transform="translate(170, 22) rotate(10)">
                <rect x="0" y="0" width="18" height="84" rx="4" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                <circle cx="9" cy="14" r="3.5" className="fill-emerald-500 stroke-emerald-300" strokeWidth="1" />
                <line x1="4" y1="32" x2="14" y2="32" className="stroke-slate-600" strokeWidth="1.2" />
                <line x1="4" y1="46" x2="14" y2="46" className="stroke-slate-600" strokeWidth="1.2" />
            </g>

            {/* Left Handheld Console */}
            <g transform="translate(42, 36) rotate(-6)">
                <rect x="0" y="0" width="34" height="52" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
                <rect x="3" y="10" width="28" height="32" rx="3" className="fill-[#020617]" />
                <circle cx="17" cy="26" r="8" className="fill-blue-500/30" />
            </g>

            {/* Right Handheld Console */}
            <g transform="translate(124, 36) rotate(6)">
                <rect x="0" y="0" width="34" height="52" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
                <rect x="3" y="10" width="28" height="32" rx="3" className="fill-[#020617]" />
                <circle cx="17" cy="26" r="8" className="fill-pink-500/30" />
            </g>

            {/* Center Wireless Gaming Gamepad */}
            <g transform="translate(62, 38)">
                <path d="M 8 56 C 0 48 -4 22 4 10 C 10 0 24 -2 36 2 C 42 4 50 4 56 2 C 68 -2 82 0 88 10 C 96 22 92 48 84 56 C 74 64 64 46 54 36 C 50 32 42 32 38 36 C 28 46 18 64 8 56 Z" 
                      className="fill-slate-900 stroke-slate-700" strokeWidth="2" strokeLinejoin="round" />
                
                {/* Center Touchpad with Logo */}
                <rect x="33" y="4" width="26" height="15" rx="2" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                <g transform="translate(46, 11)">
                    <CartLogoBadge width={15} />
                </g>

                {/* D-Pad (Left) */}
                <g transform="translate(20, 20)">
                    <rect x="-2" y="-6" width="4" height="12" rx="1" className="fill-slate-700" />
                    <rect x="-6" y="-2" width="12" height="4" rx="1" className="fill-slate-700" />
                </g>

                {/* Action Buttons (Right) */}
                <g transform="translate(72, 20)">
                    <circle cx="0" cy="-4" r="2" className="fill-emerald-500" />
                    <circle cx="4" cy="0" r="2" className="fill-red-500" />
                    <circle cx="0" cy="4" r="2" className="fill-blue-500" />
                    <circle cx="-4" cy="0" r="2" className="fill-amber-500" />
                </g>

                {/* Thumbsticks */}
                <g transform="translate(32, 30)">
                    <circle cx="0" cy="0" r="7" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-900" />
                </g>
                <g transform="translate(60, 30)">
                    <circle cx="0" cy="0" r="7" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-900" />
                </g>
            </g>
        </motion.g>
    </svg>
);

const TvGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Left Angled TV */}
            <g transform="translate(15, 34) rotate(-12)">
                <path d="M 28 42 V 50 M 20 50 H 36" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="0" y="0" width="56" height="34" rx="2" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                <rect x="2" y="2" width="52" height="30" rx="1.5" className="fill-[#020617]" />
                <circle cx="28" cy="17" r="10" className="fill-blue-500/30" />
                <polygon points="25,14 33,17 25,20" className="fill-white" />
            </g>

            {/* Right Angled TV */}
            <g transform="translate(130, 34) rotate(12)">
                <path d="M 28 42 V 50 M 20 50 H 36" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="0" y="0" width="56" height="34" rx="2" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                <rect x="2" y="2" width="52" height="30" rx="1.5" className="fill-[#020617]" />
                <circle cx="28" cy="17" r="10" className="fill-purple-500/30" />
                <polygon points="25,14 33,17 25,20" className="fill-white" />
            </g>

            {/* Center Hero Cinema TV */}
            <g transform="translate(48, 18)">
                {/* Stand Base */}
                <path d="M 35 72 L 69 72 L 75 80 H 29 Z" className="fill-slate-700" />
                <rect x="49" y="60" width="6" height="12" className="fill-slate-600" />

                {/* TV Frame */}
                <rect x="0" y="0" width="104" height="62" rx="3" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="2.5" y="2.5" width="99" height="57" rx="2" className="fill-[#020617]" />

                {/* Ambient Screen Light */}
                <circle cx="52" cy="30" r="28" className="fill-emerald-500/20" />

                {/* Featured Video Row */}
                <rect x="8" y="8" width="26" height="18" rx="2" className="fill-red-500/40 stroke-red-400" strokeWidth="0.6" />
                <polygon points="19,17 23,19 19,21" className="fill-white" />

                {/* Featured Logo Stream Channel */}
                <g transform="translate(50, 18)">
                    <CartLogoBadge width={22} />
                </g>

                <rect x="70" y="8" width="26" height="18" rx="2" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="0.6" />

                {/* App Icons Row */}
                <rect x="8" y="32" width="14" height="8" rx="1.5" className="fill-slate-800" />
                <rect x="26" y="32" width="14" height="8" rx="1.5" className="fill-slate-800" />
                <rect x="44" y="32" width="14" height="8" rx="1.5" className="fill-slate-800" />
                <rect x="62" y="32" width="14" height="8" rx="1.5" className="fill-slate-800" />
                <rect x="80" y="32" width="14" height="8" rx="1.5" className="fill-slate-800" />
            </g>

            {/* Smart Remote */}
            <g transform="translate(172, 32) rotate(14)">
                <rect x="0" y="0" width="12" height="46" rx="5" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <circle cx="6" cy="6" r="2" className="fill-red-500" />
                <circle cx="6" cy="16" r="4" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                <rect x="2.5" y="26" width="7" height="2.5" rx="1" className="fill-emerald-500" />
                <rect x="2.5" y="31" width="7" height="2.5" rx="1" className="fill-blue-500" />
            </g>
        </motion.g>
    </svg>
);

const RepairGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Phone Base Chassis */}
            <g transform="translate(50, 20)">
                <rect x="0" y="0" width="68" height="110" rx="12" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="4" y="4" width="60" height="102" rx="9" className="fill-[#020617]" />
                
                {/* Internal Circuit Board Elements with Logo */}
                <rect x="10" y="15" width="48" height="40" rx="4" className="fill-emerald-950/60 stroke-emerald-600/40" strokeWidth="1" />
                <g transform="translate(34, 35)">
                    <CartLogoBadge width={22} />
                </g>

                {/* Diagnostic Scanning Laser Beam */}
                <motion.line
                    x1="4" y1="20" x2="64" y2="20"
                    className="stroke-cyan-400" strokeWidth="2"
                    animate={{ y: [0, 80, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </g>

            {/* Precision Repair Screwdriver */}
            <motion.g
                transform="translate(130, 25) rotate(25)"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <rect x="-4" y="0" width="8" height="28" rx="2" className="fill-orange-600 stroke-orange-700" strokeWidth="1" />
                <rect x="-2" y="28" width="4" height="35" className="fill-slate-300 stroke-slate-400" strokeWidth="1" />
                <polygon points="-3,63 3,63 0,72" className="fill-slate-700" />
            </motion.g>
        </motion.g>
    </svg>
);

const LaptopGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            <g transform="translate(28, 22)">
                {/* Laptop Base Deck */}
                <path d="M 5 82 L 139 82 L 148 98 H -4 Z" className="fill-slate-800 stroke-slate-600" strokeWidth="1.5" />
                <rect x="52" y="86" width="40" height="5" rx="2" className="fill-slate-600" />

                {/* Display Screen Frame */}
                <rect x="18" y="8" width="108" height="74" rx="6" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="22" y="12" width="100" height="66" rx="3" className="fill-[#020617]" />

                {/* Screen Content: Modern IDE / Code Editor */}
                <g clipPath="url(#laptop-clip-web)">
                    <clipPath id="laptop-clip-web">
                        <rect x="22" y="12" width="100" height="66" rx="3" />
                    </clipPath>

                    {/* Window Header */}
                    <rect x="22" y="12" width="100" height="10" className="fill-slate-900" />
                    <circle cx="28" cy="17" r="2" className="fill-red-500" />
                    <circle cx="34" cy="17" r="2" className="fill-amber-500" />
                    <circle cx="40" cy="17" r="2" className="fill-emerald-500" />

                    {/* Code Syntax Lines */}
                    <motion.rect x="30" y="28" width="38" height="4" rx="2" className="fill-emerald-400" animate={{ width: [20, 38, 20] }} transition={{ duration: 3, repeat: Infinity }} />
                    <motion.rect x="30" y="36" width="45" height="4" rx="2" className="fill-cyan-400" animate={{ width: [25, 45, 25] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }} />
                    <motion.rect x="30" y="44" width="40" height="4" rx="2" className="fill-blue-400" animate={{ width: [20, 40, 20] }} transition={{ duration: 4, repeat: Infinity, delay: 0.6 }} />
                    <motion.rect x="30" y="52" width="48" height="4" rx="2" className="fill-purple-400" animate={{ width: [30, 48, 30] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.9 }} />

                    {/* Logo Badge in IDE Editor */}
                    <g transform="translate(96, 44)">
                        <CartLogoBadge width={24} />
                    </g>
                </g>
            </g>
        </motion.g>
    </svg>
);

const DesktopGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            {/* Left Angled Monitor */}
            <g transform="translate(18, 38) rotate(-10)">
                <path d="M 28 36 V 46 M 18 46 H 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="0" y="0" width="56" height="36" rx="3" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <rect x="2" y="2" width="52" height="32" rx="1.5" className="fill-[#020617]" />
                <circle cx="20" cy="18" r="9" className="fill-blue-600/30 stroke-blue-500/50" strokeWidth="1" />
                <circle cx="20" cy="18" r="4" className="fill-blue-500" />
                <line x1="20" y1="18" x2="44" y2="14" className="stroke-emerald-400" strokeWidth="1.2" />
            </g>

            {/* Right Background Monitor */}
            <g transform="translate(126, 40) rotate(8)">
                <path d="M 28 36 V 46 M 18 46 H 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="0" y="0" width="56" height="36" rx="3" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <rect x="2" y="2" width="52" height="32" rx="1.5" className="fill-[#020617]" />
                <circle cx="36" cy="18" r="9" className="stroke-emerald-400/60" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            </g>

            {/* Center Hero Monitor with Green Border and Cart Logo inside Radar */}
            <g transform="translate(52, 26)">
                {/* Stand Neck & Base */}
                <path d="M 44 50 V 62 M 32 62 H 56" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

                {/* Monitor Frame with Emerald Green Border */}
                <rect x="0" y="0" width="88" height="52" rx="4" className="fill-slate-900 stroke-emerald-500" strokeWidth="1.8" />
                <rect x="2.5" y="2.5" width="83" height="47" rx="2" className="fill-[#020617]" />

                {/* Radar Grid & Node Line */}
                <circle cx="25" cy="26" r="12" className="fill-blue-900/40 stroke-blue-600" strokeWidth="1.2" />
                <circle cx="25" cy="26" r="6" className="fill-blue-500" />
                <line x1="25" y1="26" x2="63" y2="20" className="stroke-emerald-400" strokeWidth="1.8" />
                <circle cx="44" cy="23" r="2" className="fill-emerald-400" />

                {/* Radar Outer Orbit with Logo */}
                <motion.circle
                    cx="63" cy="20" r="14"
                    className="stroke-emerald-400" strokeWidth="1.2" strokeDasharray="3 3" fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '63px 20px' }}
                />
                <g transform="translate(63, 20)">
                    <CartLogoBadge width={18} />
                </g>
            </g>

            {/* Right PC Tower 1 (Standing near center monitor with green border) */}
            <g transform="translate(138, 28)">
                <rect x="0" y="0" width="22" height="58" rx="3" className="fill-slate-900 stroke-emerald-500" strokeWidth="1.5" />
                <circle cx="11" cy="14" r="4.5" className="fill-blue-500 stroke-cyan-400" strokeWidth="1" />
                <line x1="6" y1="28" x2="16" y2="28" className="stroke-slate-600" strokeWidth="1" />
                <line x1="6" y1="32" x2="16" y2="32" className="stroke-slate-600" strokeWidth="1" />
                <line x1="6" y1="36" x2="16" y2="36" className="stroke-slate-600" strokeWidth="1" />
                <circle cx="11" cy="48" r="1.5" className="fill-emerald-400" />
            </g>

            {/* Right PC Tower 2 (Far Right Standing Tower) */}
            <g transform="translate(174, 40) rotate(6)">
                <rect x="0" y="0" width="18" height="54" rx="3" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <circle cx="9" cy="13" r="3.5" className="fill-blue-500 stroke-cyan-400" strokeWidth="0.8" />
                <line x1="5" y1="26" x2="13" y2="26" className="stroke-slate-600" strokeWidth="0.8" />
                <line x1="5" y1="30" x2="13" y2="30" className="stroke-slate-600" strokeWidth="0.8" />
            </g>
        </motion.g>
    </svg>
);

const CameraGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <g transform="translate(45, 40)">
                <rect x="0" y="10" width="110" height="70" rx="8" className="fill-slate-800 stroke-slate-600" strokeWidth="2" />
                <rect x="20" y="0" width="30" height="10" rx="2" className="fill-slate-700 stroke-slate-500" strokeWidth="2" />
                {/* Optical concentric lens */}
                <circle cx="55" cy="45" r="25" className="fill-slate-900 stroke-slate-500" strokeWidth="4" />
                <circle cx="55" cy="45" r="16" className="fill-black stroke-slate-700" strokeWidth="1.5" />
                <circle cx="55" cy="45" r="10" className="fill-slate-900 stroke-blue-600" strokeWidth="1.2" />
                <circle cx="55" cy="45" r="5" className="fill-black" />
                <circle cx="50" cy="40" r="4" className="fill-white/30" />
                {/* Red Tally Lamp (Top-Left) */}
                <circle cx="15" cy="24" r="4" className="fill-red-500" />
                {/* Logo Badge in Corner of Camera Body (Top-Right) */}
                <g transform="translate(94, 24)">
                    <CartLogoBadge width={22} />
                </g>
            </g>
        </motion.g>
    </svg>
);

const EarbudsGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
            {/* Left Matte Black Case with Both Buds */}
            <g transform="translate(24, 48) rotate(-12)">
                <g transform="translate(8, -12)">
                    <rect x="-1.5" y="0" width="3" height="12" rx="1.5" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                </g>
                <g transform="translate(22, -12)">
                    <rect x="-1.5" y="0" width="3" height="12" rx="1.5" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-800 stroke-slate-600" strokeWidth="0.8" />
                </g>
                <rect x="0" y="0" width="30" height="24" rx="8" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <path d="M 0 8 Q 15 12 30 8" stroke="#334155" strokeWidth="1" fill="none" />
                <circle cx="15" cy="16" r="1.5" className="fill-cyan-400" />
            </g>

            {/* Right Midnight Blue Case with Both Buds */}
            <g transform="translate(144, 42) rotate(12)">
                <g transform="translate(8, -12)">
                    <rect x="-1.5" y="0" width="3" height="12" rx="1.5" className="fill-slate-700 stroke-slate-500" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-700 stroke-slate-500" strokeWidth="0.8" />
                </g>
                <g transform="translate(22, -12)">
                    <rect x="-1.5" y="0" width="3" height="12" rx="1.5" className="fill-slate-700 stroke-slate-500" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="3.5" className="fill-slate-700 stroke-slate-500" strokeWidth="0.8" />
                </g>
                <rect x="0" y="0" width="30" height="24" rx="8" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
                <path d="M 0 8 Q 15 12 30 8" stroke="#475569" strokeWidth="1" fill="none" />
                <circle cx="15" cy="16" r="1.5" className="fill-emerald-400" />
            </g>

            {/* Center Hero White Case with Both Buds & Centered Logo (Replaces green dot) */}
            <g transform="translate(74, 28)">
                {/* Left Earbud */}
                <g transform="translate(12, 6)">
                    <rect x="2" y="6" width="5" height="18" rx="2.5" className="fill-white stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.2" />
                    <circle cx="4.5" cy="6" r="5.5" className="fill-white stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.2" />
                    <circle cx="4.5" cy="6" r="2" className="fill-slate-900" />
                </g>

                {/* Right Earbud */}
                <g transform="translate(36, 6)">
                    <rect x="2" y="6" width="5" height="18" rx="2.5" className="fill-white stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.2" />
                    <circle cx="4.5" cy="6" r="5.5" className="fill-white stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.2" />
                    <circle cx="4.5" cy="6" r="2" className="fill-slate-900" />
                </g>

                {/* Charging Case Body */}
                <rect x="0" y="24" width="54" height="42" rx="14" className="fill-white dark:fill-slate-100 stroke-slate-300 dark:stroke-slate-400 shadow-lg" strokeWidth="1.8" />
                <path d="M 0 38 Q 27 44 54 38" stroke="#e2e8f0" strokeWidth="1.2" fill="none" />
                
                {/* Logo Centered on Case Body (Replaces green dot) */}
                <g transform="translate(27, 50)">
                    <CartLogoBadge width={18} />
                </g>
            </g>
        </motion.g>
    </svg>
);

const ScreenGuardGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            {/* Left Phone with 9H Protector */}
            <g transform="translate(30, 28) rotate(-16)">
                <rect x="0" y="0" width="38" height="78" rx="8" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <rect x="2" y="2" width="34" height="74" rx="6" className="fill-[#020617]" />
                <rect x="2" y="2" width="34" height="74" rx="6" className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="0.8" />
                <circle cx="19" cy="38" r="8" className="fill-cyan-600" />
                <text x="19" y="41" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">9H</text>
            </g>

            {/* Right Phone with 9H Protector */}
            <g transform="translate(132, 20) rotate(16)">
                <rect x="0" y="0" width="38" height="78" rx="8" className="fill-slate-900 stroke-slate-700" strokeWidth="1.2" />
                <rect x="2" y="2" width="34" height="74" rx="6" className="fill-[#020617]" />
                <rect x="2" y="2" width="34" height="74" rx="6" className="fill-emerald-500/20 stroke-emerald-400" strokeWidth="0.8" />
                <circle cx="19" cy="38" r="8" className="fill-emerald-600" />
                <text x="19" y="41" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">9H</text>
            </g>

            {/* Center Hero Phone with Screen Guard & Logo */}
            <g transform="translate(76, 14)">
                <rect x="0" y="0" width="48" height="96" rx="11" className="fill-slate-900 stroke-emerald-500" strokeWidth="2" />
                <rect x="3" y="3" width="42" height="90" rx="9" className="fill-[#020617]" />
                
                {/* Dynamic Island */}
                <rect x="16" y="6" width="16" height="4" rx="2" className="fill-black" />
                
                {/* Screen Glow */}
                <circle cx="24" cy="48" r="20" className="fill-emerald-600/30" />
                
                {/* Hovering Screen Guard Layer */}
                <motion.rect
                    x="2" y="2" width="44" height="92" rx="8"
                    className="fill-cyan-400/25 stroke-cyan-400" strokeWidth="1.2"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Logo inside phone */}
                <g transform="translate(24, 38)">
                    <CartLogoBadge width={22} />
                </g>
            </g>
        </motion.g>
    </svg>
);

// --- Data ---
const categories = [
    {
        id: 'smartphone',
        name: 'Smartphones',
        subtext: 'Instant cash for your phone',
        component: <SmartphoneGraphic />,
        bgColors: 'bg-blue-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-blue-900 dark:text-blue-100'
    },
    {
        id: 'tablet',
        name: 'Tablets',
        subtext: 'Instant cash for your tablet',
        component: <TabletGraphic />,
        bgColors: 'bg-purple-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-purple-900 dark:text-purple-100'
    },
    {
        id: 'camera',
        name: 'Cameras',
        subtext: 'Premium value for your gear',
        component: <CameraGraphic />,
        bgColors: 'bg-rose-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-rose-900 dark:text-rose-100'
    },
    {
        id: 'laptop',
        name: 'Laptops',
        subtext: 'Upgrade today, highest payouts',
        component: <LaptopGraphic />,
        bgColors: 'bg-cyan-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-cyan-900 dark:text-cyan-100'
    },
    {
        id: 'watch',
        name: 'Smartwatches',
        subtext: 'Top market prices guaranteed',
        component: <WatchGraphic />,
        bgColors: 'bg-orange-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-orange-900 dark:text-orange-100'
    },
    {
        id: 'smarttv',
        name: 'Smart TVs',
        subtext: 'Best value for your television',
        component: <TvGraphic />,
        bgColors: 'bg-emerald-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-emerald-900 dark:text-emerald-100'
    },
    {
        id: 'console',
        name: 'Consoles',
        subtext: 'Instant cash for your console',
        component: <ConsoleGraphic />,
        bgColors: 'bg-indigo-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-indigo-900 dark:text-indigo-100'
    },
    {
        id: 'desktop',
        name: 'Desktops',
        subtext: 'TURN YOUR OLD PC INTO CASH',
        component: <DesktopGraphic />,
        bgColors: 'bg-[#f0fdf4] dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-[#064e3b] dark:text-emerald-300'
    },
    {
        id: 'earbuds',
        name: 'Earbuds',
        subtext: 'INSTANT QUOTE AND FAST MONEY',
        component: <EarbudsGraphic />,
        bgColors: 'bg-[#fdf4ff] dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-[#701a75] dark:text-fuchsia-300'
    },
    {
        id: 'repair',
        name: 'Repair',
        subtext: 'Quick, reliable, affordable',
        component: <RepairGraphic />,
        bgColors: 'bg-red-50 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-red-900 dark:text-red-100'
    },
    {
        id: 'unbreakable-screenguard',
        name: 'Screen Guard',
        subtext: 'UNBREAKABLE • 3-HR DOORSTEP',
        component: <ScreenGuardGraphic />,
        bgColors: 'bg-[#f0fdfa] dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 dark:border dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(19,226,91,0.2)]',
        textColor: 'text-[#083344] dark:text-cyan-300'
    },
];


export default function CategorySelector({ onSelect }: CategorySelectorProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 mb-12">
                <h2 className="text-3xl md:text-5xl font-bold dark:text-white tracking-tight">What would you like to sell?</h2>
                <p className="text-muted-foreground dark:text-slate-400 text-lg">Select a category to proceed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container px-4 mx-auto">
                {categories.map((cat, index) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                        onClick={() => onSelect(cat.id)}
                        className={`
                            relative h-60 md:h-72 w-full rounded-[2rem] overflow-hidden text-left
                            border transition-all duration-300 group
                            ${cat.bgColors} hover:shadow-xl hover:-translate-y-1
                            border-transparent hover:border-black/5 dark:hover:border-white/10
                        `}
                    >
                        {/* Text Content */}
                        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 w-3/4">
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 mb-2 ${cat.textColor}`}>
                                {cat.subtext}
                            </p>
                            <h3 className={`text-3xl md:text-4xl font-bold tracking-tight ${cat.textColor} leading-none`}>
                                {cat.name}
                            </h3>
                        </div>

                        {/* Graphic */}
                        <div className="absolute bottom-3 right-3 md:bottom-2 md:right-2 w-48 h-38 md:w-72 md:h-54 transform group-hover:scale-110 transition-transform duration-500 ease-out origin-bottom-right z-10">
                            {cat.component}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
