
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandSelector from './BrandSelector';
import ModelSelector from './ModelSelector';
import VariantSelector from './VariantSelector';
import QuotePreview from './QuotePreview';
import ChecklistWizard from './ChecklistWizard';
import FinalQuote from './FinalQuote';
import { Brand, Model, Variant } from '@/lib/store';

type Step = 'brand' | 'model' | 'variant' | 'quote_preview' | 'checklist' | 'final_quote';

interface SellWizardProps {
    initialBrands: Brand[];
}

export default function SellWizard({ initialBrands }: SellWizardProps) {
    const [step, setStep] = useState<Step>('brand');

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});

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
        setStep('quote_preview');
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'brand' && (
                    <motion.div key="brand" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <BrandSelector brands={initialBrands} onSelect={handleBrandSelect} />
                    </motion.div>
                )}

                {step === 'model' && selectedBrand && (
                    <motion.div key="model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ModelSelector
                            brandId={selectedBrand.id}
                            onSelect={handleModelSelect}
                            onBack={() => setStep('brand')}
                        />
                    </motion.div>
                )}

                {step === 'variant' && selectedModel && (
                    <motion.div key="variant" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <VariantSelector
                            modelId={selectedModel.id}
                            onSelect={handleVariantSelect}
                            onBack={() => setStep('model')}
                        />
                    </motion.div>
                )}

                {step === 'quote_preview' && selectedVariant && selectedBrand && selectedModel && (
                    <motion.div key="quote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <QuotePreview
                            basePrice={selectedVariant.basePrice}
                            deviceDetails={`${selectedBrand.name} ${selectedModel.name} (${selectedVariant.name})`}
                            onGetExactValue={() => setStep('checklist')}
                            onBack={() => setStep('variant')}
                        />
                    </motion.div>
                )}

                {step === 'checklist' && selectedModel && selectedVariant && (
                    <motion.div key="checklist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ChecklistWizard
                            deviceInfo={{ name: selectedModel.name, variant: selectedVariant.name, img: selectedModel.img }}
                            onComplete={(collectedAnswers) => {
                                setAnswers(collectedAnswers);
                                setStep('final_quote');
                            }}
                        />
                    </motion.div>
                )}

                {step === 'final_quote' && selectedModel && selectedVariant && (
                    <motion.div key="final" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <FinalQuote
                            basePrice={selectedVariant.basePrice}
                            answers={answers}
                            deviceInfo={{ name: selectedModel.name, variant: selectedVariant.name }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
