
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySelector from './CategorySelector';
import BrandSelector from './BrandSelector';
import ModelSelector from './ModelSelector';
import VariantSelector from './VariantSelector';
import QuotePreview from './QuotePreview';
import ChecklistWizard from './ChecklistWizard';
import FinalQuote from './FinalQuote';
import { Brand, Model, Variant } from '@/lib/store';

type Step = 'category' | 'brand' | 'model' | 'variant' | 'quote_preview' | 'checklist' | 'final_quote';

interface SellWizardProps {
    initialBrands: Brand[];
    initialCategory?: string;
}

import { fetchBrands } from '@/actions/catalog';

export default function SellWizard({ initialBrands, initialCategory }: SellWizardProps) {
    // If a category is provided via info, we start at 'brand' selection (skipping category select)
    // Exception: If category is 'repair', we treat it as smartphone but set isRepair=true

    const resolveCategory = (cat?: string) => {
        if (!cat) return 'smartphone';
        if (cat === 'repair') return 'smartphone';
        return cat;
    };

    const resolvedCategory = resolveCategory(initialCategory);

    const [step, setStep] = useState<Step>(initialCategory ? 'brand' : 'category');
    const [category, setCategory] = useState<string>(resolvedCategory);
    const [isRepair, setIsRepair] = useState(initialCategory === 'repair');

    // We need to maintain local brands state in case category changes
    const [brands, setBrands] = useState<Brand[]>(initialBrands);

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});

    const handleCategorySelect = async (cat: string) => {
        let targetCategory = cat;
        if (cat === 'repair') {
            setIsRepair(true);
            targetCategory = 'smartphone'; // Default to smartphone repair for now
        } else {
            setIsRepair(false);
        }

        setCategory(targetCategory);

        // Fetch brands for the selected category
        const newBrands = await fetchBrands(targetCategory);
        setBrands(newBrands);
        setStep('brand');
    };

    const handleBrandSelect = (brand: Brand) => {
        setSelectedBrand(brand);
        setStep('model');
    };

    const handleModelSelect = (model: Model) => {
        setSelectedModel(model);
        setStep('variant');
    };

    const handleVariantSelect = (variant: Variant) => {
        setSelectedVariant(variant);
        if (isRepair) {
            setStep('checklist');
        } else {
            setStep('quote_preview');
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'category' && (
                    <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <CategorySelector onSelect={handleCategorySelect} />
                    </motion.div>
                )}

                {step === 'brand' && (
                    <motion.div key="brand" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <BrandSelector
                            brands={brands}
                            onSelect={handleBrandSelect}
                            onBack={() => setStep('category')}
                        />
                    </motion.div>
                )}

                {step === 'model' && selectedBrand && (
                    <motion.div key="model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ModelSelector
                            brandId={selectedBrand.id}
                            category={category}
                            onSelect={handleModelSelect}
                            onBack={() => setStep('brand')}
                        />
                    </motion.div>
                )}

                {step === 'variant' && selectedModel && (
                    <motion.div key="variant" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <VariantSelector
                            modelId={selectedModel?.id || ''}
                            category={category}
                            onSelect={handleVariantSelect}
                            onBack={() => setStep('model')}
                        />
                    </motion.div>
                )}

                {step === 'quote_preview' && selectedVariant && selectedBrand && selectedModel && (
                    <motion.div key="quote_preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <QuotePreview
                            basePrice={selectedVariant.basePrice}
                            deviceDetails={`${selectedBrand?.name} ${selectedModel.name} (${selectedVariant.name})`}
                            onGetExactValue={() => setStep('checklist')}
                            onBack={() => setStep('variant')}
                            isRepair={isRepair}
                        />
                    </motion.div>
                )}

                {step === 'checklist' && selectedModel && selectedVariant && (
                    <motion.div key="checklist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ChecklistWizard
                            deviceInfo={{ name: selectedModel.name, variant: selectedVariant.name, img: selectedModel.img }}
                            category={category}
                            onComplete={(collectedAnswers) => {
                                setAnswers(collectedAnswers);
                                setStep('final_quote');
                            }}
                        />
                    </motion.div>
                )}

                {step === 'final_quote' && selectedModel && selectedVariant && (
                    <motion.div key="final_quote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <FinalQuote
                            basePrice={selectedVariant.basePrice}
                            answers={answers}
                            deviceInfo={{
                                name: `${selectedBrand?.name} ${selectedModel.name}`,
                                variant: selectedVariant.name
                            }}
                            isRepair={isRepair}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
