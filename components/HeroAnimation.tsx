'use client'

import { motion } from 'framer-motion'
import { Smartphone, Banknote, RefreshCw, CheckCircle2, Zap } from 'lucide-react'

export default function HeroAnimation() {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-visible">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] -translate-x-10"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] translate-x-10"
                />
            </div>

            {/* Container for alignment - Using Flexbox for safer responsiveness */}
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8 md:gap-12 w-full max-w-2xl px-4">

                {/* 1. THE PHONE COMPONENT */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-[160px] h-[300px] sm:w-[180px] sm:h-[340px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl flex flex-col items-center overflow-hidden shrink-0"
                >
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-24 mx-auto z-20" />

                    {/* Screen Content */}
                    <div className="w-full h-full bg-gradient-to-b from-slate-800 via-slate-900 to-black pt-10 px-4 flex flex-col items-center relative">
                        {/* Animated Scan Line */}
                        <motion.div
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 right-0 h-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] z-10 opacity-70"
                        />

                        {/* Status Icon */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 border border-violet-500/30"
                        >
                            <Smartphone className="w-8 h-8 text-violet-400" />
                        </motion.div>

                        {/* Skeleton Text */}
                        <div className="space-y-3 w-full opacity-50">
                            <div className="h-2 bg-slate-600 rounded-full w-3/4 mx-auto" />
                            <div className="h-2 bg-slate-600 rounded-full w-1/2 mx-auto" />
                        </div>

                        {/* Pop-up Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mt-auto mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-2 w-full flex items-center gap-2 backdrop-blur-sm"
                        >
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-green-400 font-bold uppercase">Best Value</span>
                                <span className="text-white font-bold text-sm">₹25,000</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>


                {/* 2. THE FLOATING EXCHANGE ICON */}
                <div className="relative z-20 shrink-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-14 h-14 bg-white/90 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-black/5"
                    >
                        <RefreshCw className="w-6 h-6 text-black" />
                    </motion.div>
                </div>


                {/* 3. THE CASH STACK */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] shrink-0"
                >
                    <div className="relative w-full h-full">
                        {/* Cards Stack */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                drag
                                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                                className="absolute w-full h-24 rounded-xl shadow-xl border border-white/10 flex items-center justify-between px-4"
                                style={{
                                    top: i * 15,
                                    left: i * -5,
                                    zIndex: 3 - i,
                                    backgroundColor: i === 0 ? '#10B981' : i === 1 ? '#059669' : '#047857', // Tailwind green-500, 600, 700
                                    transform: `rotate(${i * -3}deg)`,
                                }}
                            >
                                <span className="text-white font-bold text-2xl">₹</span>
                                <Banknote className="text-white/80 w-8 h-8" />
                            </motion.div>
                        ))}

                        {/* Instant Tag */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -right-4 top-10 z-20 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                        >
                            <Zap className="w-3 h-3 fill-black" />
                            INSTANT
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
