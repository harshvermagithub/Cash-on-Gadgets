
import { variants } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowLeft, Smartphone } from "lucide-react";

interface VariantSelectorProps {
    onSelect: (variantId: string) => void;
    onBack: () => void;
}

export default function VariantSelector({ onSelect, onBack }: VariantSelectorProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Select Variant</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {variants.map((variant, index) => (
                    <motion.button
                        key={variant.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(variant.id)}
                        className="flex items-center gap-4 p-6 border rounded-xl bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <div className="p-3 bg-accent rounded-full group-hover:bg-primary/20 transition-colors">
                            <Smartphone className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="font-semibold text-lg">{variant.name}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
