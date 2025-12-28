
'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, Loader2 } from "lucide-react";
import { Variant } from '@/lib/store';
import { fetchVariants } from '@/actions/catalog';

interface VariantSelectorProps {
    modelId: string;
    onSelect: (variant: Variant) => void;
    onBack: () => void;
}

export default function VariantSelector({ modelId, onSelect, onBack }: VariantSelectorProps) {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                let v = await fetchVariants(modelId);
                // Fallback to generic if specific variants not found
                if (v.length === 0) {
                    v = await fetchVariants('generic');
                }
                if (mounted) {
                    setVariants(v);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(error);
                if (mounted) setIsLoading(false);
            }
        }
        load();

        return () => { mounted = false; };
    }, [modelId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Select Variant</h2>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : variants.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No variants found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {variants.map((variant, index) => (
                        <motion.button
                            key={variant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelect(variant)}
                            className="flex items-center gap-4 p-6 border rounded-xl bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="p-3 bg-accent rounded-full group-hover:bg-primary/20 transition-colors">
                                <Smartphone className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="font-semibold text-lg">{variant.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
