'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBrands } from '@/actions/catalog';
import { ArrowRight, Smartphone, Tablet, Laptop, Watch, Gamepad2, Wrench, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/lib/store';

const CATEGORY_OPTIONS = [
    { id: 'smartphone', label: 'Phone', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'laptop', label: 'Laptop', icon: Laptop, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { id: 'smartwatch', label: 'Watch', icon: Watch, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'console', label: 'Console', icon: Gamepad2, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'repair-device', label: 'Repair', icon: Wrench, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
];

export function BrandRail() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

    useEffect(() => {
        fetchBrands('smartphone').then(setBrands);
    }, []);

    if (brands.length === 0) return null;

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Brands</span>
                    <Link href="/sell" className="text-xs font-medium text-green-500 flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-sides">
                    {brands.slice(0, 8).map((brand, i) => (
                        <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand)}
                            className="flex flex-col items-center gap-3 min-w-[180px] group focus:outline-none"
                        >
                            <div className="w-48 h-48 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center p-6 shadow-sm group-hover:border-green-500 transition-colors">
                                <div className="relative w-full h-full filter dark:invert-0">
                                    {brand.logo ? (
                                        <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                    ) : (
                                        <Smartphone className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                            </div>
                            <span className="text-sm font-bold text-center truncate w-full group-hover:text-green-500 transition-colors">
                                {brand.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Category Selection Modal */}
            <AnimatePresence>
                {selectedBrand && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBrand(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        {selectedBrand.logo ? (
                                            <Image src={selectedBrand.logo} alt={selectedBrand.name} fill className="object-contain" />
                                        ) : (
                                            <Smartphone className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Select Category</h3>
                                        <p className="text-xs text-muted-foreground">What {selectedBrand.name} device?</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedBrand(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-3 gap-4">
                                {CATEGORY_OPTIONS.map((option) => (
                                    <Link
                                        key={option.id}
                                        href={`/sell?category=${option.id}&brandId=${selectedBrand.id}`}
                                        className="flex flex-col items-center gap-2 group"
                                        onClick={() => setSelectedBrand(null)}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${option.bg} ${option.color}`}>
                                            <option.icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                                            {option.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
