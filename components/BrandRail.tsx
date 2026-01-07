'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBrands } from '@/actions/catalog';
import { ArrowRight, Smartphone, Tablet, Laptop, Watch, Gamepad2, Wrench, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/lib/store';

const CATEGORY_OPTIONS = [
    { id: 'smartphone', label: 'Phone', icon: Smartphone, color: 'text-blue-500' },
    { id: 'laptop', label: 'Laptop', icon: Laptop, color: 'text-purple-500' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, color: 'text-pink-500' },
    { id: 'smartwatch', label: 'Watch', icon: Watch, color: 'text-orange-500' },
    { id: 'console', label: 'Console', icon: Gamepad2, color: 'text-indigo-500' },
];

const getBrandCategories = (brandName: string) => {
    const b = brandName.toLowerCase();
    const cats = ['smartphone'];

    // Tablets
    if (['apple', 'samsung', 'xiaomi', 'oneplus', 'lenovo', 'motorola', 'realme', 'google', 'honor', 'huawei', 'oppo', 'vivo'].includes(b)) {
        cats.push('tablet');
    }

    // Laptops
    if (['apple', 'samsung', 'xiaomi', 'lenovo', 'asus', 'hp', 'dell', 'acer', 'msi', 'microsoft', 'honor'].includes(b)) {
        cats.push('laptop');
    }

    // Watches - Skipping Apple as requested
    if (['samsung', 'xiaomi', 'oneplus', 'google', 'huawei', 'honor', 'motorola', 'noise', 'boat', 'fire-boltt'].includes(b)) {
        cats.push('smartwatch');
    }

    // Consoles
    if (['sony', 'microsoft', 'nintendo'].includes(b)) {
        cats.push('console');
    }

    return cats;
};

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

                <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-sides">
                    {brands.slice(0, 8).map((brand, i) => (
                        <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand)}
                            className="flex flex-col items-center gap-2 min-w-[90px] group focus:outline-none"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:border-green-500 transition-colors p-3">
                                <div className="relative w-full h-full">
                                    {brand.logo ? (
                                        <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                    ) : (
                                        <Smartphone className="w-8 h-8 text-slate-400" />
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
                            className="relative w-full max-w-sm bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 relative p-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center">
                                        {selectedBrand.logo ? (
                                            <Image src={selectedBrand.logo} alt={selectedBrand.name} fill className="object-contain p-1" />
                                        ) : (
                                            <Smartphone className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-black">Select Category</h3>
                                        <p className="text-sm text-slate-500 font-medium">For {selectedBrand.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedBrand(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-3 gap-4">
                                {CATEGORY_OPTIONS.filter(opt => getBrandCategories(selectedBrand.name).includes(opt.id)).map((option) => (
                                    <Link
                                        key={option.id}
                                        href={`/sell?category=${option.id}&brandId=${selectedBrand.id}`}
                                        className="flex flex-col items-center gap-2 group"
                                        onClick={() => setSelectedBrand(null)}
                                    >
                                        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all group-hover:scale-105 shadow-sm bg-white border-2 border-slate-100 ${option.color}`}>
                                            <option.icon className="w-14 h-14" />
                                        </div>
                                        <span className="text-sm font-bold text-black group-hover:text-primary transition-colors">
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
