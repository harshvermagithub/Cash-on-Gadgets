'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Banknote, CheckCircle2, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'

const PHONES = [
    {
        name: "iPhone 17",
        color: "#4a4a4b",
        cameraType: "triple"
    },
    {
        name: "S25 Ultra",
        color: "#2a2a2a",
        cameraType: "p-shaped"
    },
    {
        name: "Pixel 9",
        color: "#333333",
        cameraType: "visor"
    }
]

const CASH_VALUES = ["₹1,15,000", "₹1,00,000", "₹85,000", "₹45,000"]

export default function HowItWorks() {
    const [phoneIndex, setPhoneIndex] = useState(0)
    const [cashIndex, setCashIndex] = useState(0)

    useEffect(() => {
        const phoneTimer = setInterval(() => {
            setPhoneIndex((prev) => (prev + 1) % PHONES.length)
        }, 3000)

        const cashTimer = setInterval(() => {
            setCashIndex((prev) => (prev + 1) % CASH_VALUES.length)
        }, 2000)

        return () => {
            clearInterval(phoneTimer)
            clearInterval(cashTimer)
        }
    }, [])

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 font-semibold text-sm mb-4"
                    >
                        Simple Process
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Sell your device in 3 simple steps and get instant cash at your doorstep.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-12 z-0" />

                    {/* Step 1: Valuation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center space-y-6 group relative z-10"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Dynamic Phone Animation - Back View */}
                            <div className="relative w-32 h-56 bg-slate-900 rounded-[2rem] border-4 border-slate-800 shadow-2xl flex flex-col items-center overflow-hidden transition-colors duration-500"
                                style={{ backgroundColor: PHONES[phoneIndex].color }}>

                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={phoneIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full flex flex-col items-center pt-8"
                                    >
                                        {/* Camera Modules */}
                                        <div className="mb-4">
                                            {PHONES[phoneIndex].cameraType === "triple" && (
                                                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-2 grid grid-cols-2 gap-2 shadow-inner border border-white/5">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className={`${i === 3 ? 'col-span-2 mx-auto' : ''} w-6 h-6 rounded-full bg-black border border-slate-700`} />
                                                    ))}
                                                </div>
                                            )}
                                            {PHONES[phoneIndex].cameraType === "p-shaped" && (
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-5 h-5 rounded-full bg-black border border-slate-700" />
                                                        ))}
                                                    </div>
                                                    <div className="w-5 h-5 rounded-full bg-black border border-slate-700 mt-2" />
                                                </div>
                                            )}
                                            {PHONES[phoneIndex].cameraType === "visor" && (
                                                <div className="w-28 h-10 bg-black/80 rounded-full flex items-center justify-center gap-4 border border-white/10 shadow-lg">
                                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600" />
                                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Brand Logo Placeholder */}
                                        <div className="w-6 h-6 rounded-full bg-white/10 mt-auto mb-16" />

                                        {/* Phone Name Badge - Enhanced Visibility */}
                                        <div className="absolute bottom-6 bg-white shadow-xl px-4 py-2 rounded-full flex items-center gap-2 border border-slate-100 min-w-[120px] justify-center z-20">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            <span className="text-xs md:text-sm font-extrabold text-slate-900 whitespace-nowrap">{PHONES[phoneIndex].name}</span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white">1</div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">Get Device Valuation</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Answer a few questions about your phone's condition and get the best price quote instantly.
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 2: Pickup (Refined Rider) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center text-center space-y-6 group relative z-10"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative w-full h-full p-4">
                                <motion.div
                                    animate={{
                                        y: [-1, 1, -1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >

                                    {/* Road/Path */}
                                    <div className="absolute bottom-10 w-32 h-1 bg-slate-200 rounded-full" />

                                    {/* Animated Delivery Truck */}
                                    <motion.div
                                        animate={{
                                            x: [-10, 10, -10],
                                            y: [0, -2, 0]
                                        }}
                                        transition={{
                                            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                        className="relative z-10"
                                    >
                                        <div className="bg-green-100 p-4 rounded-2xl border-2 border-green-500 shadow-xl relative">
                                            <Truck className="w-12 h-12 text-green-600" />

                                            {/* Branding on Truck */}
                                            <div className="absolute -right-2 -top-2 bg-green-600 text-[8px] text-white font-bold px-1.5 py-0.5 rounded-md">
                                                FONZ
                                            </div>
                                        </div>

                                        {/* Speed Lines */}
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0], x: [10, -10] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="absolute top-1/2 -left-6 space-y-1"
                                        >
                                            <div className="w-4 h-0.5 bg-green-300 rounded-full" />
                                            <div className="w-6 h-0.5 bg-green-300 rounded-full ml-2" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Calendar/Date Badge */}
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-8 right-6 bg-white border border-slate-100 p-2 rounded-xl shadow-lg z-20"
                                    >
                                        <div className="text-[10px] font-bold text-slate-400 text-center leading-none mb-0.5">PICK</div>
                                        <div className="text-lg font-black text-slate-800 text-center leading-none">24</div>
                                    </motion.div>

                                    {/* Additional Speed Lines (Positioned Relative to Container) */}
                                    <motion.div
                                        animate={{ x: [-20, -60], opacity: [1, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                                        className="absolute bottom-1/2 left-4 w-12 h-0.5 bg-slate-200 rounded-full"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white">2</div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">Schedule Pickup</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Our verified "Fonzkart" agent will visit your location at your chosen time slot for inspection.
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 3: Get Paid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col items-center text-center space-y-6 group relative z-10"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-lime-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative">
                                {/* Rotating Glow */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-tr from-lime-400/20 to-transparent rounded-full blur-xl"
                                />

                                <motion.div
                                    key={cashIndex}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative z-10 flex flex-col items-center"
                                >
                                    <div className="relative">
                                        <Banknote className="w-24 h-24 text-lime-600 drop-shadow-xl" strokeWidth={1.5} />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white"
                                        >
                                            ₹
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="mt-4 bg-lime-100 text-lime-800 font-extrabold text-xl px-6 py-2 rounded-xl shadow-inner min-w-[140px]"
                                    >
                                        {CASH_VALUES[cashIndex]}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <div className="w-10 h-10 rounded-full bg-lime-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white">3</div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">Get Paid Instantly</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Money is transferred to your account instantly via UPI or Cash before our agent leaves.
                            </p>
                        </div>
                    </motion.div>
                </div >
            </div >
        </section >
    );
}


