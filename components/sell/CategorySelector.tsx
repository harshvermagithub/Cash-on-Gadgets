'use client';

import { motion } from 'framer-motion';

interface CategorySelectorProps {
    onSelect: (category: string) => void;
}

// --- Cart Logo Badge Helper ---
const CartLogoBadge = ({ radius = 8, strokeColor = '#22c55e', strokeWidth = 1.5 }: { radius?: number; strokeColor?: string; strokeWidth?: number }) => (
    <g>
        <circle cx={0} cy={0} r={radius} fill="#ffffff" stroke={strokeColor} strokeWidth={strokeWidth} />
        <image x={-radius * 0.9} y={-radius * 0.9} width={radius * 1.8} height={radius * 1.8} href="/cart.svg" preserveAspectRatio="xMidYMid meet" />
    </g>
);

// --- Animated SVG Components ---

const SmartphoneGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Background Angled Phone */}
            <g transform="translate(118, 25) rotate(14)">
                <rect x="0" y="0" width="52" height="104" rx="12" className="fill-slate-800/80 stroke-slate-600" strokeWidth="1.5" />
                <rect x="3" y="3" width="46" height="98" rx="9" className="fill-blue-900/40" />
            </g>

            {/* Front Flagship Smartphone */}
            <g transform="translate(48, 20) rotate(-6)">
                <rect x="0" y="0" width="64" height="118" rx="14" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="4" y="4" width="56" height="110" rx="11" className="fill-[#020617]" />

                {/* Dynamic Island */}
                <rect x="22" y="7" width="20" height="5" rx="2.5" className="fill-black" />

                {/* OLED Wallpaper Waves */}
                <g clipPath="url(#phone-screen-clip)">
                    <clipPath id="phone-screen-clip">
                        <rect x="4" y="4" width="56" height="110" rx="11" />
                    </clipPath>
                    
                    <motion.circle cx="28" cy="65" r="32" className="fill-blue-600/30" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                    <motion.circle cx="38" cy="85" r="26" className="fill-emerald-500/25" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 4, repeat: Infinity }} />

                    {/* App Grid */}
                    <g transform="translate(10, 20)">
                        <rect x="0" y="0" width="10" height="10" rx="3" className="fill-blue-500" />
                        <rect x="14" y="0" width="10" height="10" rx="3" className="fill-emerald-500" />
                        <rect x="28" y="0" width="10" height="10" rx="3" className="fill-amber-500" />
                    </g>

                    {/* Embedded Logo Badge */}
                    <g transform="translate(32, 48)">
                        <CartLogoBadge radius={11} strokeColor="#22c55e" strokeWidth={1.5} />
                    </g>

                    {/* Glowing Audio / Data Widget */}
                    <rect x="10" y="68" width="44" height="26" rx="6" className="fill-slate-800/80 stroke-slate-700/60" strokeWidth="1" />
                    <motion.path
                        d="M 14 81 Q 22 73 32 81 T 50 81"
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
                    <circle cx="70" cy="45" r="38" className="fill-purple-600/30" />
                    <circle cx="95" cy="55" r="28" className="fill-pink-500/25" />

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

                    {/* Embedded Logo Badge */}
                    <g transform="translate(78, 48)">
                        <CartLogoBadge radius={13} strokeColor="#c084fc" strokeWidth={1.8} />
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

                {/* Logo Badge inside watch face */}
                <g transform="translate(32, 52)">
                    <CartLogoBadge radius={9} strokeColor="#f97316" strokeWidth={1.5} />
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
            {/* Standing Console Tower (Left) */}
            <g transform="translate(30, 24)">
                <path d="M 0 0 Q 5 45 0 92 H 24 Q 20 45 24 0 Z" className="fill-white stroke-slate-300" strokeWidth="1.5" />
                <rect x="4" y="4" width="16" height="84" rx="2" className="fill-slate-900" />
                <line x1="6" y1="10" x2="6" y2="80" className="stroke-cyan-400" strokeWidth="1.5" />
                <rect x="15" y="40" width="2" height="30" rx="1" className="fill-slate-600" />
            </g>

            {/* Wireless Gaming Gamepad (Right) */}
            <g transform="translate(75, 45)">
                <path d="M 0 15 C 8 -10 32 -15 55 -15 C 78 -15 102 -10 110 15 C 118 40 128 75 105 88 C 88 98 75 70 60 50 C 48 44 22 44 10 50 C -5 70 -18 98 -35 88 C -58 75 -48 40 -40 15 Z" 
                      className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                
                {/* Center Touchpad with Logo */}
                <rect x="18" y="-8" width="34" height="22" rx="3" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
                <g transform="translate(35, 3)">
                    <CartLogoBadge radius={7} strokeColor="#38bdf8" strokeWidth={1.2} />
                </g>

                {/* D-Pad */}
                <g transform="translate(-15, 18)">
                    <rect x="-3" y="-9" width="6" height="18" rx="1.5" className="fill-slate-700" />
                    <rect x="-9" y="-3" width="18" height="6" rx="1.5" className="fill-slate-700" />
                </g>

                {/* Action Buttons */}
                <g transform="translate(85, 18)">
                    <circle cx="0" cy="-7" r="3" className="fill-emerald-500" />
                    <circle cx="7" cy="0" r="3" className="fill-red-500" />
                    <circle cx="0" cy="7" r="3" className="fill-blue-500" />
                    <circle cx="-7" cy="0" r="3" className="fill-amber-500" />
                </g>

                {/* Thumbsticks */}
                <circle cx="8" cy="40" r="9" className="fill-slate-800 stroke-slate-600" strokeWidth="1.5" />
                <circle cx="62" cy="40" r="9" className="fill-slate-800 stroke-slate-600" strokeWidth="1.5" />
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
            <g transform="translate(25, 20)">
                {/* Stand Base */}
                <path d="M 45 96 L 95 96 L 105 106 H 35 Z" className="fill-slate-700" />
                <rect x="66" y="80" width="8" height="16" className="fill-slate-600" />

                {/* TV Frame */}
                <rect x="0" y="0" width="140" height="82" rx="3" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <rect x="3" y="3" width="134" height="76" rx="2" className="fill-[#020617]" />

                {/* 4K UI Feed */}
                <g clipPath="url(#tv-screen-clip-web)">
                    <clipPath id="tv-screen-clip-web">
                        <rect x="3" y="3" width="134" height="76" rx="2" />
                    </clipPath>

                    {/* Ambient Screen Light */}
                    <circle cx="70" cy="40" r="40" className="fill-emerald-500/20" />

                    {/* Featured Video Row */}
                    <rect x="10" y="10" width="34" height="24" rx="2" className="fill-red-500/40 stroke-red-400" strokeWidth="0.8" />
                    <polygon points="25,22 29,24.5 25,27" className="fill-white" />

                    {/* Featured Logo Stream Channel */}
                    <g transform="translate(67, 22)">
                        <CartLogoBadge radius={12} strokeColor="#10b981" strokeWidth={1.5} />
                    </g>

                    <rect x="90" y="10" width="34" height="24" rx="2" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="0.8" />

                    {/* App Icons Row */}
                    <rect x="10" y="42" width="18" height="10" rx="2" className="fill-slate-800" />
                    <rect x="32" y="42" width="18" height="10" rx="2" className="fill-slate-800" />
                    <rect x="54" y="42" width="18" height="10" rx="2" className="fill-slate-800" />
                    <rect x="76" y="42" width="18" height="10" rx="2" className="fill-slate-800" />
                    <rect x="98" y="42" width="18" height="10" rx="2" className="fill-slate-800" />
                </g>

                {/* Smart Remote */}
                <g transform="translate(148, 25) rotate(6)">
                    <rect x="0" y="0" width="14" height="55" rx="6" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                    <circle cx="7" cy="8" r="2.5" className="fill-red-500" />
                    <circle cx="7" cy="20" r="5" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
                    <rect x="3" y="32" width="8" height="3" rx="1" className="fill-emerald-500" />
                    <rect x="3" y="38" width="8" height="3" rx="1" className="fill-blue-500" />
                </g>
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
                    <CartLogoBadge radius={10} strokeColor="#34d399" strokeWidth={1.5} />
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
                    <g transform="translate(98, 44)">
                        <CartLogoBadge radius={12} strokeColor="#06b6d4" strokeWidth={1.5} />
                    </g>
                </g>
            </g>
        </motion.g>
    </svg>
);

const DesktopGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <g transform="translate(30, 24)">
                {/* Stand Neck & Base */}
                <path d="M48 66 V82" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                <path d="M30 82 H66" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

                {/* Desktop Monitor Frame */}
                <rect x="0" y="10" width="96" height="66" rx="5" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                
                {/* Screen Content */}
                <g clipPath="url(#desktop-screen-clip)">
                    <clipPath id="desktop-screen-clip">
                        <rect x="4" y="14" width="88" height="58" rx="2" />
                    </clipPath>
                    <rect x="4" y="14" width="88" height="58" rx="2" className="fill-[#020617]" />

                    {/* Left Node: Blue Orbit & Center */}
                    <circle cx="26" cy="43" r="14" className="fill-blue-950/60 stroke-blue-700/50" strokeWidth="1.5" />
                    <motion.circle cx="26" cy="43" r="8" className="fill-blue-600" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />

                    {/* Connecting Green Data Line */}
                    <line x1="26" y1="43" x2="68" y2="35" className="stroke-emerald-400" strokeWidth="2.5" />
                    <motion.circle r="2.5" className="fill-emerald-300" animate={{ cx: [26, 68], cy: [43, 35], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />

                    {/* Right Node: Logo Badge inside Radar */}
                    <g transform="translate(68, 35)">
                        <CartLogoBadge radius={11} strokeColor="#22c55e" strokeWidth={1.5} />
                    </g>
                    <motion.circle cx="68" cy="35" r="16" className="stroke-emerald-400" strokeWidth="2" strokeDasharray="4 4" fill="none" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '68px 35px' }} />
                </g>

                {/* PC Tower */}
                <g transform="translate(108, 14)">
                    <rect x="0" y="0" width="30" height="74" rx="5" className="fill-slate-900 stroke-slate-700" strokeWidth="2" />
                    <motion.circle cx="15" cy="18" r="5" className="fill-blue-500" stroke="#38bdf8" strokeWidth="1.5" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                    <rect x="8" y="32" width="14" height="2" rx="1" className="fill-slate-700" />
                    <rect x="8" y="38" width="14" height="2" rx="1" className="fill-slate-700" />
                </g>
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
                <circle cx="55" cy="45" r="25" className="fill-slate-900 stroke-slate-500" strokeWidth="4" />
                {/* Logo Badge in camera lens */}
                <g transform="translate(55, 45)">
                    <CartLogoBadge radius={11} strokeColor="#2563eb" strokeWidth={1.5} />
                </g>
                <circle cx="15" cy="25" r="4" className="fill-red-500" />
            </g>
        </motion.g>
    </svg>
);

const EarbudsGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
            <g transform="translate(68, 38)">
                {/* Left Earbud */}
                <g transform="translate(14, 8)">
                    <rect x="2" y="6" width="7" height="20" rx="3.5" className="fill-white stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
                    <circle cx="5.5" cy="6" r="6" className="fill-white stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
                    <circle cx="5.5" cy="6" r="2" className="fill-slate-900" />
                </g>

                {/* Right Earbud */}
                <g transform="translate(37, 8)">
                    <rect x="2" y="6" width="7" height="20" rx="3.5" className="fill-white stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
                    <circle cx="5.5" cy="6" r="6" className="fill-white stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
                    <circle cx="5.5" cy="6" r="2" className="fill-slate-900" />
                </g>

                {/* Charging Case with Logo */}
                <rect x="0" y="24" width="64" height="48" rx="18" className="fill-white dark:fill-slate-100 stroke-slate-300 dark:stroke-slate-400 shadow-lg" strokeWidth="2" />
                <path d="M 0 40 Q 32 46 64 40" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
                <g transform="translate(32, 50)">
                    <CartLogoBadge radius={9} strokeColor="#22c55e" strokeWidth={1.3} />
                </g>
            </g>
        </motion.g>
    </svg>
);

const ScreenGuardGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            {/* Screen Guard (Left, Hovering) */}
            <motion.g
                transform="translate(42, 20)"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <rect x="0" y="0" width="48" height="96" rx="8" className="fill-cyan-400/40 stroke-cyan-400" strokeWidth="2" />
                
                {/* Diagonal Glass Reflection Beam */}
                <g clipPath="url(#guard-clip)">
                    <clipPath id="guard-clip">
                        <rect x="0" y="0" width="48" height="96" rx="8" />
                    </clipPath>
                    <path d="M 0 0 L 22 0 L 48 96 L 26 96 Z" fill="#ffffff" fillOpacity="0.45" />
                </g>
            </motion.g>

            {/* Alignment Dot */}
            <motion.circle cx="98" cy="85" r="2.5" className="fill-cyan-400" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />

            {/* Base Smartphone (Right with Logo inside screen) */}
            <g transform="translate(108, 36)">
                <rect x="0" y="0" width="56" height="100" rx="14" className="fill-slate-900 stroke-slate-700" strokeWidth="2.5" />
                <rect x="4" y="4" width="48" height="92" rx="10" className="fill-[#020617]" />
                <g transform="translate(28, 50)">
                    <CartLogoBadge radius={11} strokeColor="#38bdf8" strokeWidth={1.5} />
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
