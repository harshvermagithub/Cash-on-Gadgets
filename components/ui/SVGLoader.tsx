'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { HeroLogo } from "@/components/HeroLogo";

const SmartphoneLoaderSVG = () => (
    <div className="relative w-12 h-20 md:w-16 md:h-24">
        <svg width="100%" height="100%" viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl relative z-20">
            {/* Outer Dark Charcoal Frame */}
            <rect x="1" y="1" width="30" height="58" rx="5" fill="#1c1917" stroke="#27272a" strokeWidth="1.8" />
            
            {/* Inner Black Bezel */}
            <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />
            
            {/* Vibrant Emerald Green Screen */}
            <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#10B981" />

            {/* Pure White F Logo 1:1 Vector Replica matching Image 2 */}
            <g fill="#FFFFFF">
                {/* Top Swoosh pointing top-right */}
                <path d="M 8.5 10 C 8.5 10 12 3.5 22.5 3 C 28 3 28.5 8.5 26.5 9.5 C 24 13 18.5 15.5 14 16 C 11 16.5 8.5 18 8.5 19.5 Z" />
                {/* Middle Swoosh pointing right */}
                <path d="M 8.5 21 C 10.5 18 16 16.5 23 16.5 C 27 16.5 27.5 20 25 22 C 21.5 23.5 16 25 12 26 C 9.5 26.5 8.5 28.5 8.5 30 Z" />
                {/* Bottom Leaf Stem */}
                <path d="M 8.5 31 C 11 28.5 15 28 17.5 28 C 17.5 36 14 41 8.5 42 Z" />
            </g>
        </svg>

        {/* Animated Scan Line (White for contrast on Green) */}
        <motion.div
            className="absolute left-[15%] right-[15%] h-0.5 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.4)] z-30"
            animate={{ top: ['10%', '85%', '10%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Screen Content Pulse */}
        <motion.div
            className="absolute inset-x-[15%] top-[10%] bottom-[15%] bg-white/20 rounded-sm z-20"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    </div>
);

export default function SVGLoader({ className = "" }: { className?: string }) {
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center bg-white/95 backdrop-blur-md ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
            >
                <SmartphoneLoaderSVG />

                <div className="flex flex-col items-center gap-1">
                    {/* forceLight prop applied to ensure FONZKART text is pure black always */}
                    <HeroLogo className="scale-125" forceLight />

                    <div className="flex gap-1">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-green-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                            className="w-2 h-2 rounded-full bg-green-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="w-2 h-2 rounded-full bg-green-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
