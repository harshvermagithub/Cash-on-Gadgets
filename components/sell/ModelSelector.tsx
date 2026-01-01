
'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { Model } from '@/lib/store';
import { fetchModels } from '@/actions/catalog';

interface ModelSelectorProps {
    brandId: string;
    category?: string;
    onSelect: (model: Model) => void;
    onBack: () => void;
}

export default function ModelSelector({ brandId, category, onSelect, onBack }: ModelSelectorProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Select your Model</h2>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : models.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No models found for this brand in our database yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {models.map((model, index) => (
                        <motion.button
                            key={model.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(model)}
                            className="flex flex-col items-center justify-center p-4 border rounded-xl bg-card hover:border-primary hover:shadow-lg transition-all text-center"
                        >
                            <div className="relative w-24 h-32 mb-4 flex items-center justify-center">
                                {model.img && (model.img.startsWith('/') || model.img.startsWith('http')) ? (
                                    <Image src={model.img} alt={model.name} fill className="object-contain" />
                                ) : (
                                    <span className="text-3xl font-bold text-gray-400">{model.name[0]}</span>
                                )}
                            </div>
                            <span className="font-medium text-sm">{model.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
