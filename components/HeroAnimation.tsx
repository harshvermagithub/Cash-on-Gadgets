'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Banknote, RefreshCw, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

const DEVICES = [
    {
        name: "iPhone 17 Pro Max",
        value: "₹1,15,000",
        color: "#1a1a1b",
        highlight: "#4a4a4b",
        brand: "Apple",
        cameraType: "triple",
        cardCount: 7
    },
    {
        name: "iPhone 16",
        value: "₹95,000",
        color: "#F1B8D1",
        highlight: "#ffdaeb",
        brand: "Apple",
        cameraType: "dual-vertical",
        cardCount: 5
    },
    {
        name: "Samsung S25 Ultra",
        value: "₹1,00,000",
        color: "#0f0f0f",
        highlight: "#2a2a2a",
        brand: "Samsung",
        cameraType: "p-shaped",
        cardCount: 6
    },
    {
        name: "Samsung S24 Ultra",
        value: "₹90,000",
        color: "#D9D5C1",
        highlight: "#f5f1de",
        brand: "Samsung",
        cameraType: "p-shaped",
        cardCount: 5
    },
    {
        name: "Pixel 9 Pro",
        value: "₹85,000",
        color: "#1c1c1c",
        highlight: "#333333",
        brand: "Google",
        cameraType: "visor",
        cardCount: 4
    }
]

export default function HeroAnimation() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % DEVICES.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const device = DEVICES[currentIndex]

    return (
        <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-visible">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Container for alignment */}
            <div className="relative z-10 flex items-center justify-center gap-8 md:gap-16 w-full max-w-4xl px-4">

                {/* 1. THE FLAT PREMIUM PHONE COMPONENT */}
                <div className="relative w-[180px] h-[360px] sm:w-[220px] sm:h-[440px] shrink-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={device.name}
                            initial={{ x: -50, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 50, opacity: 0, scale: 0.9 }}
                            transition={{
                                duration: 0.6,
                                type: "spring",
                                stiffness: 70,
                                damping: 15
                            }}
                            className="absolute inset-0 select-none cursor-default"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full relative"
                            >
                                {/* Phone Body */}
                                <div
                                    className="w-full h-full rounded-[2.8rem] border-[4px] border-slate-800 shadow-2xl relative overflow-hidden group"
                                    style={{
                                        backgroundColor: device.color,
                                    }}
                                >
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />

                                    {/* Camera Module Section */}
                                    <div className="pt-12 w-full px-8 flex justify-start">
                                        <div className="relative z-20">
                                            {device.cameraType === "triple" && (
                                                <div className="bg-black/10 backdrop-blur-md rounded-[2.5rem] p-4 grid grid-cols-2 gap-2.5 shadow-xl border border-white/5">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className={`${i === 3 ? 'col-span-2 mx-auto' : ''} w-8 h-8 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center`}>
                                                            <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/5" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {device.cameraType === "dual-vertical" && (
                                                <div className="bg-black/10 backdrop-blur-md rounded-full p-2.5 flex flex-col gap-2.5 shadow-xl border border-white/5">
                                                    <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                                                        <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/5" />
                                                    </div>
                                                    <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                                                        <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/5" />
                                                    </div>
                                                </div>
                                            )}
                                            {device.cameraType === "p-shaped" && (
                                                <div className="flex gap-3">
                                                    <div className="flex flex-col gap-3">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                                                                <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/5" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col gap-3 pt-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800" />
                                                        <div className="w-2.5 h-8 rounded-full bg-slate-900/50 border border-white/5" />
                                                    </div>
                                                </div>
                                            )}
                                            {device.cameraType === "visor" && (
                                                <div className="w-[180px] sm:w-[220px] h-14 bg-slate-950/90 absolute left-[-32px] sm:left-[-40px] top-4 flex items-center justify-center gap-6 border-y border-white/5 shadow-xl backdrop-blur-md overflow-hidden">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
                                                            <div className="w-3 h-3 rounded-full bg-black/40" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Brand Logo */}
                                    <div className="mt-auto mb-20 flex flex-col items-center gap-1.5 opacity-10">
                                        <div className="w-6 h-6 rounded-full bg-white/20" />
                                        <span className="font-bold text-base tracking-[0.4em] uppercase">{device.brand}</span>
                                    </div>

                                    {/* Name & Series Label - High Visibility Dialog Style */}
                                    <div className="absolute bottom-12 left-0 right-0 flex justify-center px-4">
                                        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl px-4 py-2 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                                            <span className="text-xs sm:text-sm text-slate-900 font-extrabold uppercase tracking-widest block text-center">
                                                {device.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>


                {/* 2. THE FLOATING EXCHANGE ICON */}
                <div className="relative z-20 shrink-0">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-xl ring-8 ring-green-500/5"
                    >
                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </motion.div>
                </div>


                {/* 3. THE CASH STACK */}
                <div className="relative w-[140px] h-[250px] sm:w-[200px] sm:h-[300px] shrink-0">
                    <div className="relative w-full h-full pt-16">
                        <AnimatePresence>
                            {Array.from({ length: device.cardCount }).map((_, i) => (
                                <motion.div
                                    key={`${device.name}-${i}`}
                                    initial={{ y: 60, opacity: 0, scale: 0.8 }}
                                    animate={{
                                        y: i * -15,
                                        x: i * -5,
                                        opacity: 1,
                                        scale: 1,
                                        rotate: i * -3
                                    }}
                                    exit={{ y: -60, opacity: 0, scale: 0.8 }}
                                    transition={{
                                        delay: i * 0.08,
                                        type: "spring",
                                        stiffness: 80,
                                        damping: 15
                                    }}
                                    className="absolute inset-x-0 h-32 rounded-2xl shadow-xl border border-white/20 flex items-center justify-between px-6 overflow-hidden"
                                    style={{
                                        zIndex: 10 - i,
                                        background: i === 0
                                            ? 'linear-gradient(135deg, #10B981, #065f46)'
                                            : i === 1
                                                ? 'linear-gradient(135deg, #059669, #064e3b)'
                                                : 'linear-gradient(135deg, #047857, #064e3b)',
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]" />

                                    <div className="flex flex-col gap-1">
                                        <span className="text-white/60 text-[10px] font-black tracking-widest uppercase">FONZKART</span>
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-white font-black text-xl sm:text-2xl drop-shadow-lg z-10"
                                        >
                                            {device.value}
                                        </motion.span>
                                    </div>
                                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                                        <Banknote className="text-white/60 w-10 h-10 z-10" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Instant Tag */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                y: [0, -4, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-0 z-40 bg-yellow-400 text-black text-[11px] font-black px-5 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white"
                        >
                            <Zap className="w-4 h-4 fill-black" />
                            INSTANT CASH
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    )
}
