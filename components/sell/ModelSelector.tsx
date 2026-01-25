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

// Helper Component for Image Fallback
const ModelImage = ({ src, alt }: { src: string, alt: string }) => {
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
            className="object-contain p-2"
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

            else if (name.includes('iPhone')) {
                // specific iphone grouping can be tricky, maybe just don't group or simple groups
                if (name.includes('SE')) uniqueSeries.add('SE Series');
                else if (name.match(/iPhone \d/)) uniqueSeries.add('Number Series');
            }

            else if (name.includes('Redmi Note')) uniqueSeries.add('Redmi Note');
            else if (name.includes('Pixel')) uniqueSeries.add('Pixel Series');
            else if (name.includes('Nord')) uniqueSeries.add('Nord Series');
            else if (name.includes('Reno')) uniqueSeries.add('Reno Series');
        });

        const list = Array.from(uniqueSeries).sort();
        return list.length > 1 ? list : []; // Only show filters if multiple series exist
    }, [models]);

    // Filter Models
    const filteredModels = useMemo(() => {
        return models.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeSeries) {
                if (activeSeries === 'S Series') return m.name.includes('Galaxy S');
                if (activeSeries === 'A Series') return m.name.includes('Galaxy A');
                if (activeSeries === 'M Series') return m.name.includes('Galaxy M');
                if (activeSeries === 'F Series') return m.name.includes('Galaxy F');
                if (activeSeries === 'Z Series') return m.name.includes('Galaxy Z');
                if (activeSeries === 'Note Series') return m.name.includes('Galaxy Note');

                if (activeSeries === 'SE Series') return m.name.includes('SE');
                if (activeSeries === 'Number Series') return m.name.match(/iPhone \d/) || (m.name.includes('OnePlus') && !m.name.includes('Nord'));

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
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        <button
                            onClick={() => setActiveSeries(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${!activeSeries
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card hover:bg-accent border-border'
                                }`}
                        >
                            All Models
                        </button>
                        {seriesList.map(series => (
                            <button
                                key={series}
                                onClick={() => setActiveSeries(series === activeSeries ? null : series)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeSeries === series
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card hover:bg-accent border-border'
                                    }`}
                            >
                                {series}
                            </button>
                        ))}
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
                            className="flex flex-col items-center justify-between p-4 border rounded-xl bg-card hover:border-primary hover:shadow-lg transition-all text-center h-full group"
                        >
                            <div className="relative w-full aspect-[3/4] mb-4 flex items-center justify-center bg-accent/5 rounded-lg group-hover:bg-accent/10 transition-colors">
                                <ModelImage src={model.img} alt={model.name} />
                            </div>
                            <span className="font-semibold text-sm line-clamp-2">{model.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
