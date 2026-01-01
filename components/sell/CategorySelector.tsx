
import { Smartphone, Tablet, Watch, Gamepad2, Tv, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategorySelectorProps {
    onSelect: (category: string) => void;
}

const categories = [
    { id: 'smartphone', name: 'Smartphone', icon: Smartphone, available: true },
    { id: 'tablet', name: 'Tablet', icon: Tablet, available: true },
    { id: 'watch', name: 'Smartwatch', icon: Watch, available: true },
    { id: 'console', name: 'Gaming Console', icon: Gamepad2, available: true },
    { id: 'tv', name: 'Smart TV', icon: Tv, available: true },
    { id: 'repair', name: 'Repair Device', icon: Wrench, available: true },
];

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">What would you like to sell?</h2>
                <p className="text-muted-foreground">Select a category to proceed</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(cat.id)}
                        className={`flex flex-col items-center justify-center p-8 bg-card border hover:border-primary/50 hover:bg-accent/50 rounded-2xl transition-all group`}
                    >
                        <div className={`p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors mb-4`}>
                            <cat.icon className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-lg">{cat.name}</h3>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// Fixed the typo in the JSX logic above during file creation
