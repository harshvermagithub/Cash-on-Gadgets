'use client';

import { motion } from 'framer-motion';

interface CategorySelectorProps {
    onSelect: (category: string) => void;
}

// --- Custom SVG Components (Refined Positioning) ---

const SmartphoneGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(140, 40) rotate(15)">
            <rect x="0" y="0" width="45" height="90" rx="4" className="fill-blue-100 dark:fill-slate-800 stroke-blue-500" strokeWidth="1.5" />
            <circle cx="22" cy="25" r="12" className="stroke-blue-500" strokeWidth="1" />
        </g>
        <g transform="translate(100, 30) rotate(0)">
            <rect x="0" y="0" width="50" height="100" rx="8" className="fill-slate-100 dark:fill-slate-800 stroke-slate-500" strokeWidth="1.5" />
            <rect x="15" y="5" width="20" height="6" rx="3" className="fill-black" />
        </g>
        <g transform="translate(50, 50) rotate(-10)">
            <rect x="0" y="0" width="55" height="110" rx="2" className="fill-white dark:fill-slate-900 stroke-slate-900 dark:stroke-slate-100" strokeWidth="1.5" />
            <rect x="3" y="3" width="49" height="104" className="fill-slate-50 dark:fill-slate-950" />
            <path d="M0 0 L55 0 L55 110 L0 110 Z" className="fill-transparent" />
            <path d="M0 0 L55 110" className="stroke-white/20" strokeWidth="40" />
        </g>
    </svg>
);

const TabletGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="80" y="20" width="100" height="130" rx="6" transform="rotate(10 130 85)" className="fill-slate-200 dark:fill-slate-800 stroke-slate-400" strokeWidth="1.5" />
        <rect x="20" y="60" width="140" height="90" rx="6" className="fill-white dark:fill-slate-950 stroke-slate-800 dark:stroke-slate-100" strokeWidth="1.5" />
        <rect x="26" y="66" width="128" height="78" className="fill-blue-50 dark:fill-slate-900" />
        <rect x="30" y="155" width="120" height="8" rx="4" className="fill-white stroke-slate-300" />
    </svg>
);

const WatchGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(30, 40) rotate(-10)">
            <path d="M25 0 V20 M25 80 V100" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="40" strokeLinecap="round" />
            <rect x="0" y="20" width="50" height="60" rx="10" className="fill-slate-900 stroke-slate-600" strokeWidth="2" />
            <rect x="5" y="25" width="40" height="50" rx="6" className="fill-black" />
            <circle cx="25" cy="50" r="15" className="stroke-green-500" strokeWidth="3" strokeDasharray="60 100" />
        </g>
        <g transform="translate(110, 50)">
            <path d="M35 0 V20 M35 70 V90" className="stroke-purple-200 dark:stroke-purple-900" strokeWidth="40" strokeLinecap="round" />
            <circle cx="35" cy="45" r="35" className="fill-white dark:fill-slate-800 stroke-slate-300" strokeWidth="2" />
            <circle cx="35" cy="45" r="30" className="fill-black" />
            <path d="M35 55 L30 50 C25 45 25 35 30 35 C35 35 35 40 35 40 C35 40 35 35 40 35 C45 35 45 45 40 50 Z" className="fill-red-500" />
        </g>
    </svg>
);

const ConsoleGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Scaled down (0.85) and shifted right to avoid overlapping left text */}
        <g transform="translate(35, 15) scale(0.85)">
            <g transform="translate(130, 10)">
                <rect x="0" y="0" width="60" height="110" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                <ellipse cx="30" cy="5" rx="28" ry="8" className="fill-slate-800" />
            </g>
            <g transform="translate(70, 5)">
                <path d="M10 0 C10 -10 40 -10 40 0 V115 C40 125 10 125 10 115 Z" className="fill-white dark:fill-slate-200 stroke-slate-300" strokeWidth="1.5" />
                <path d="M20 0 V115" className="stroke-blue-500/50" strokeWidth="2" />
            </g>
            <g transform="translate(20, 85)">
                <rect x="0" y="0" width="80" height="40" rx="2" className="fill-slate-800 stroke-slate-600" />
                <rect x="5" y="2" width="70" height="36" className="fill-black" />
                <rect x="-10" y="0" width="10" height="40" rx="2" className="fill-blue-500" />
                <rect x="80" y="0" width="10" height="40" rx="2" className="fill-red-500" />
            </g>
            <g transform="translate(100, 85)">
                <path d="M0 10 H50 C55 10 55 30 50 30 H40 L30 20 L20 30 H10 C5 30 5 10 0 10" className="fill-white dark:fill-slate-300 stroke-slate-500" strokeWidth="1.5" />
            </g>
        </g>
    </svg>
);

const TvGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20, 20)">
            <rect x="0" y="0" width="160" height="100" rx="2" className="fill-black stroke-slate-600" strokeWidth="2" />
            <rect x="5" y="5" width="150" height="90" className="fill-slate-900" />
            <path d="M5 95 L40 60 L70 80 L100 40 L155 95 H5" className="fill-white/10" />
        </g>
        <path d="M80 120 L120 120 L140 130 H60 L80 120" className="fill-slate-700" />
    </svg>
);

const RepairGraphic = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="20" width="60" height="110" rx="6" className="fill-slate-100 dark:fill-slate-900 stroke-slate-400" strokeWidth="2" />
        <path d="M70 40 L130 90 M90 100 L110 30" className="stroke-slate-300" strokeWidth="1" />
        <g transform="translate(40, 80) rotate(-30)">
            <rect x="0" y="0" width="10" height="60" rx="2" className="fill-orange-500 stroke-orange-600" />
            <path d="M-5 0 H15 L10 -15 H0 L-5 0" className="fill-slate-400" />
        </g>
        <g transform="translate(160, 80) rotate(30)">
            <rect x="0" y="0" width="10" height="60" rx="2" className="fill-blue-500 stroke-blue-600" />
            <circle cx="5" cy="0" r="8" className="fill-slate-300" />
        </g>
    </svg>
);

// --- Data ---
const categories = [
    {
        id: 'smartphone',
        name: 'Smartphones',
        subtext: 'Apple / Samsung / Vivo / Oppo',
        component: <SmartphoneGraphic />,
        bgColors: 'bg-blue-50 dark:bg-slate-900',
        textColor: 'text-blue-900 dark:text-blue-100'
    },
    {
        id: 'tablet',
        name: 'Tablets',
        subtext: 'iPad / Samsung / Lenovo',
        component: <TabletGraphic />,
        bgColors: 'bg-purple-50 dark:bg-slate-900',
        textColor: 'text-purple-900 dark:text-purple-100'
    },
    {
        id: 'smartwatch',
        name: 'Smartwatches',
        subtext: 'Apple / Samsung / Fitbit',
        component: <WatchGraphic />,
        bgColors: 'bg-orange-50 dark:bg-slate-900',
        textColor: 'text-orange-900 dark:text-orange-100'
    },
    {
        id: 'console',
        name: 'Consoles',
        subtext: 'PS5 / Xbox / Nintendo',
        component: <ConsoleGraphic />,
        bgColors: 'bg-indigo-50 dark:bg-slate-900',
        textColor: 'text-indigo-900 dark:text-indigo-100'
    },
    {
        id: 'tv',
        name: 'Smart TVs',
        subtext: 'Sony / LG / Samsung / MI',
        component: <TvGraphic />,
        bgColors: 'bg-emerald-50 dark:bg-slate-900',
        textColor: 'text-emerald-900 dark:text-emerald-100'
    },
    {
        id: 'repair',
        name: 'Repair',
        subtext: 'Screen / Battery / Others',
        component: <RepairGraphic />,
        bgColors: 'bg-red-50 dark:bg-slate-900',
        textColor: 'text-red-900 dark:text-red-100'
    },
];

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 mb-12">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What would you like to sell?</h2>
                <p className="text-muted-foreground text-lg">Select a category to proceed</p>
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
                        {/* Text Content - Adjusted Alignment */}
                        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 w-3/4">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-60 mb-2">{cat.subtext}</p>
                            <h3 className={`text-3xl md:text-4xl font-bold tracking-tight ${cat.textColor} leading-none`}>
                                {cat.name}
                            </h3>
                        </div>

                        {/* Graphic - Adjusted Positioning & Size */}
                        <div className="absolute bottom-4 right-4 md:bottom-2 md:right-2 w-40 h-32 md:w-64 md:h-48 transform group-hover:scale-110 transition-transform duration-500 ease-out origin-bottom-right z-10">
                            {cat.component}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
