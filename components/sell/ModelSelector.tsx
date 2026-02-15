'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import Image from "next/image";
import { Model } from '@/lib/store';
import { fetchModels } from '@/actions/catalog';
import SVGLoader from "@/components/ui/SVGLoader";

interface ModelSelectorProps {
    brandId: string;
    category?: string;
    onSelect: (model: Model) => void;
    onBack: () => void;
}

const EXCLUDED_MODELS = new Set([
    "iPhone 17", "iPhone 17 Air",
    "iPhone 16 Plus", "iPhone 16", "iPhone 16e", "iPhone 16 E",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone XS Max", "iPhone XS"
]);

// Helper Component for Image Fallback
const ModelImage = ({ src, alt, priority = false, scale = 1 }: { src: string, alt: string, priority?: boolean, scale?: number }) => {
    const [error, setError] = useState(false);

    // Validate URL format before rendering Next.js Image to prevent "Invalid URL" crash
    const isValid = useMemo(() => {
        if (!src) return false;
        try {
            if (src.startsWith('/') || src.startsWith('data:')) return true;
            new URL(src); // Check if valid absolute URL
            return true;
        } catch {
            return false;
        }
    }, [src]);

    if (!isValid || error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold text-gray-200">{alt.substring(0, 1)}</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-contain p-1 transition-transform duration-300"
            style={{ transform: `scale(${scale})` }}
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setError(true)}
        />
    );
};

export default function ModelSelector({ brandId, category, onSelect, onBack }: ModelSelectorProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSeries, setActiveSeries] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        fetchModels(brandId, category)
            .then(data => {
                if (mounted) {
                    setModels(data);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.error("Failed to fetch models:", err);
                if (mounted) setIsLoading(false);
            });

        return () => { mounted = false; };
    }, [brandId, category]);

    // Extract Series Logic
    const seriesList = useMemo(() => {
        const uniqueSeries = new Set<string>();
        models.forEach(m => {
            const name = m.name;
            if (name.includes('Galaxy S')) uniqueSeries.add('S Series');
            else if (name.includes('Galaxy A')) uniqueSeries.add('A Series');
            else if (name.includes('Galaxy M')) uniqueSeries.add('M Series');
            else if (name.includes('Galaxy F')) uniqueSeries.add('F Series');
            else if (name.includes('Galaxy Z')) uniqueSeries.add('Z Series');
            else if (name.includes('Galaxy Note')) uniqueSeries.add('Note Series');

            else if (name.toLowerCase().includes('iphone')) {
                if (name.toLowerCase().includes('air')) uniqueSeries.add('Air Series');

                const match = name.match(/iPhone\s+(\d+)/i);
                if (match) {
                    uniqueSeries.add(`${match[1]} Series`);
                }

                if (name.toLowerCase().includes('iphone x')) uniqueSeries.add('X Series');
                if (name.toLowerCase().includes('se')) uniqueSeries.add('SE Series');
            }

            else if (name.includes('Redmi Note')) uniqueSeries.add('Redmi Note');
            else if (name.includes('Pixel')) uniqueSeries.add('Pixel Series');
            else if (name.includes('Nord')) uniqueSeries.add('Nord Series');
            else if (name.includes('Reno')) uniqueSeries.add('Reno Series');
        });

        const list = Array.from(uniqueSeries).sort((a, b) => {
            // Custom Sort for iPhones
            // Air -> Numbers Desc -> X -> SE
            if (a === 'Air Series') return -1;
            if (b === 'Air Series') return 1;

            const numA = parseInt(a);
            const numB = parseInt(b);

            if (!isNaN(numA) && !isNaN(numB)) return numB - numA; // Descending
            if (!isNaN(numA)) return -1; // Numbers first
            if (!isNaN(numB)) return 1;

            if (a === 'X Series') return -1; // X after numbers
            if (b === 'X Series') return 1;

            if (a === 'SE Series') return -1; // SE after X ? Or X after SE? usually X is better?
            if (b === 'SE Series') return 1;

            return a.localeCompare(b);
        });

        return list.length > 1 ? list : [];
    }, [models]);

    // Filter Models
    const filteredModels = useMemo(() => {
        return models.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeSeries) {
                const name = m.name.toLowerCase();

                // iPhone filters
                if (activeSeries === 'Air Series') return name.includes('air');
                if (activeSeries.includes('Series') && !isNaN(parseInt(activeSeries))) {
                    // "17 Series" -> check if contains "17"
                    // Be careful: "17" vs "17 Pro". Both contain 17.
                    // But "iPhone 1" shouldn't match "iPhone 13". 
                    // Regex boundary?
                    const num = parseInt(activeSeries);
                    return name.match(new RegExp(`iphone\\s+${num}\\b`, 'i'));
                }
                if (activeSeries === 'X Series') return name.includes('iphone x');
                if (activeSeries === 'SE Series') return name.includes('se');

                // Other Series
                if (activeSeries === 'S Series') return m.name.includes('Galaxy S');
                if (activeSeries === 'A Series') return m.name.includes('Galaxy A');
                if (activeSeries === 'M Series') return m.name.includes('Galaxy M');
                if (activeSeries === 'F Series') return m.name.includes('Galaxy F');
                if (activeSeries === 'Z Series') return m.name.includes('Galaxy Z');
                if (activeSeries === 'Note Series') return m.name.includes('Galaxy Note');

                if (activeSeries === 'Redmi Note') return m.name.includes('Redmi Note');
                if (activeSeries === 'Pixel Series') return m.name.includes('Pixel');
                if (activeSeries === 'Nord Series') return m.name.includes('Nord');
                if (activeSeries === 'Reno Series') return m.name.includes('Reno');
            }

            return true;
        });
    }, [models, searchTerm, activeSeries]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold">Select Model</h2>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search your model (e.g. iPhone 13, S23)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Series Filters */}
                {seriesList.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Choose by series</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveSeries(null)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${!activeSeries
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card hover:bg-accent border-border'
                                    }`}
                            >
                                All
                            </button>
                            {seriesList.map(series => (
                                <button
                                    key={series}
                                    onClick={() => setActiveSeries(series === activeSeries ? null : series)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${activeSeries === series
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-card hover:bg-accent border-border'
                                        }`}
                                >
                                    {series}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <SVGLoader className="bg-transparent backdrop-blur-none w-full" />
                </div>
            ) : filteredModels.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No models found</p>
                    <p className="text-sm">Try searching for something else</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredModels.map((model, index) => (
                        <motion.button
                            key={model.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(model)}
                            className="flex flex-col items-center justify-between p-4 border rounded-xl bg-white text-black hover:border-primary hover:shadow-lg transition-all text-center h-full group"
                        >
                            <div className="relative w-full aspect-[2/3] mb-4 flex items-center justify-center bg-white rounded-lg transition-colors overflow-hidden">
                                <ModelImage
                                    src={model.img}
                                    alt={model.name}
                                    priority={index < 8}
                                    scale={EXCLUDED_MODELS.has(model.name) ? 1 : 1.35}
                                />
                            </div>
                            <span className="font-semibold text-sm line-clamp-2">{model.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
