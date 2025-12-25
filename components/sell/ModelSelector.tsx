
import { models } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface ModelSelectorProps {
    brandId: string;
    onSelect: (modelId: string) => void;
    onBack: () => void;
}

interface Model {
    id: string;
    name: string;
    img: string;
}

export default function ModelSelector({ brandId, onSelect, onBack }: ModelSelectorProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const brandModels: Model[] = (models as any)[brandId] || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Select your Model</h2>
            </div>

            {brandModels.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No models found for this brand in our database yet.
                    <br />
                    (Try Xiaomi or Apple for demo)
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {brandModels.map((model, index) => (
                        <motion.button
                            key={model.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(model.id)}
                            className="flex flex-col items-center justify-center p-4 border rounded-xl bg-card hover:border-primary hover:shadow-lg transition-all text-center"
                        >
                            <div className="relative w-24 h-32 mb-4">
                                <Image src={model.img} alt={model.name} fill className="object-contain" />
                            </div>
                            <span className="font-medium text-sm">{model.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
