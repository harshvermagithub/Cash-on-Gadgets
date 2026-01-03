
'use client';

import { motion } from 'framer-motion';

export default function RiderIllustration() {
    return (
        <svg
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xl"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* BOBBING MOTION */}
            <motion.g
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* --- SCOOTER (FACING LEFT: Front < 250, Back > 250) --- */}

                {/* EXHAUST / REAR MECHANICALS */}
                <path d="M340 350 L 380 340 L 380 320" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

                {/* SCOOTER BODY (Main Chassis) */}
                {/* Drawing facing LEFT: Front around 100, Back around 400 */}
                <path
                    d="M 370 330 
                       C 390 330, 410 310, 410 270 
                       L 400 240 
                       H 300 
                       L 250 330 
                       H 180 /* Floorboard Front */
                       C 160 330, 150 310, 150 250 /* Front Shield Bottom */
                       L 160 180 /* Front Shield Top */
                       H 190 
                       L 180 250
                       L 230 330 
                       H 370 Z"
                    fill="#10b981" /* Emerald-500 */
                    stroke="#047857" strokeWidth="2"
                />

                {/* SEAT */}
                <path d="M 300 240 L 410 230 C 420 230, 420 250, 410 260 L 300 255 Z" fill="#1e293b" />

                {/* FRONT FORK & FENDER */}
                <path d="M 175 180 L 160 355" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
                <path d="M 130 310 H 200 C 210 310, 210 340, 200 340 H 130 C 120 340, 120 310, 130 310 Z" fill="#10b981" />

                {/* HANDLEBARS */}
                <path d="M 175 180 L 140 170" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" />
                <circle cx="140" cy="170" r="5" fill="#000000" />

                {/* HEADLIGHT */}
                <path d="M 165 190 L 150 190" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" />
                <circle cx="160" cy="190" r="10" fill="#fef08a" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* --- RIDER --- */}

                {/* LEG (Left Side) */}
                <path d="M 320 250 L 300 310 L 250 310" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                {/* SHOE */}
                <path d="M 250 310 L 230 320" stroke="#ffffff" strokeWidth="15" strokeLinecap="round" />

                {/* TORSO */}
                <path d="M 330 240 L 310 160" stroke="#10b981" strokeWidth="38" strokeLinecap="round" />

                {/* ARM */}
                <path d="M 315 170 L 250 210 L 190 180" stroke="#10b981" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="190" cy="180" r="8" fill="#fca5a5" /> {/* Hand */}

                {/* HEAD */}
                <g transform="translate(310, 130)">
                    <circle cx="0" cy="0" r="30" fill="#15803d" /> {/* Helmet */}
                    <path d="M -25 -10 H 10 A 25 25 0 0 1 -25 20 Z" fill="#1e293b" opacity="0.8" /> {/* Visor Dark */}
                    <path d="M -25 -10 H 10 L 15 -15 H -20 Z" fill="#e2e8f0" /> {/* Visor Top */}
                </g>

                {/* BACKPACK (On back, so Right side of x=330) */}
                <g transform="translate(350, 150)">
                    <rect x="0" y="0" width="80" height="90" rx="8" fill="#15803d" stroke="#064e3b" strokeWidth="2" />
                    {/* FLAP */}
                    <path d="M 0 20 H 80 L 70 30 H 10 Z" fill="#052e16" opacity="0.2" />

                    {/* TEXT */}
                    <text x="40" y="45" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="14" letterSpacing="1">FONZ</text>
                    <text x="40" y="65" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="14" letterSpacing="1">KART</text>
                </g>

            </motion.g>

            {/* --- WHEELS (Spinning Left for Forward Motion) --- */}
            {/* Front Wheel (Center was 165, 350 -> Now 160, 355) */}
            <g transform="translate(160, 355)">
                <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                    {/* Draw wheel relative to 0,0 */}
                    <circle cx="0" cy="0" r="35" stroke="#1e293b" strokeWidth="12" fill="none" />
                    <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                    {/* Spokes */}
                    <path d="M 0 0 L 0 -30" stroke="#64748b" strokeWidth="3" />
                    <path d="M 0 0 L 25 15" stroke="#64748b" strokeWidth="3" />
                    <path d="M 0 0 L -25 15" stroke="#64748b" strokeWidth="3" />
                </motion.g>
            </g>

            {/* Rear Wheel (Center was 380, 350 -> Now 380, 355) */}
            <g transform="translate(380, 355)">
                <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                    {/* Draw wheel relative to 0,0 */}
                    <circle cx="0" cy="0" r="35" stroke="#1e293b" strokeWidth="12" fill="none" />
                    <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                    {/* Spokes */}
                    <path d="M 0 0 L 0 -30" stroke="#64748b" strokeWidth="3" />
                    <path d="M 0 0 L 25 15" stroke="#64748b" strokeWidth="3" />
                    <path d="M 0 0 L -25 15" stroke="#64748b" strokeWidth="3" />
                </motion.g>
            </g>

            {/* --- SPEED LINES (Moving Right to Left) --- */}
            <motion.g
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: [0, 1, 0], x: -100 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
                <path d="M 450 300 H 500" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                <path d="M 470 200 H 510" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <path d="M 460 380 H 490" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            </motion.g>

        </svg>
    );
}
