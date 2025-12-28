
import { motion } from "framer-motion";
import Image from "next/image";
import { Brand } from "@/lib/store";

interface BrandSelectorProps {
    brands: Brand[];
    onSelect: (brand: Brand) => void;
}

export default function BrandSelector({ brands, onSelect }: BrandSelectorProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Select your Brand</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {brands.map((brand, index) => (
                    <motion.button
                        key={brand.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(brand)}
                        className="flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:border-primary hover:shadow-lg transition-all aspect-square group"
                    >
                        <div className="relative w-16 h-16 mb-4 transition-all">
                            <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                        </div>
                        <span className="font-medium">{brand.name}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
