
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandSelector from './BrandSelector';
import ModelSelector from './ModelSelector';
import VariantSelector from './VariantSelector';
import QuotePreview from './QuotePreview';
import ChecklistWizard from './ChecklistWizard';
import FinalQuote from './FinalQuote';
import { brands, models, variants } from '@/lib/data';

type Step = 'brand' | 'model' | 'variant' | 'quote_preview' | 'checklist' | 'final_quote';

export default function SellWizard() {
    const [step, setStep] = useState<Step>('brand');

    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<string>('');
    const [answers, setAnswers] = useState<Record<string, unknown>>({});

    // Derived data
    const brandName = brands.find(b => b.id === selectedBrand)?.name || '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = ((models as any)[selectedBrand])?.find((m: any) => m.id === selectedModel);
    const variant = variants.find(v => v.id === selectedVariant);

    const handleBrandSelect = (id: string) => {
        setSelectedBrand(id);
        setStep('model');
    };

    const handleModelSelect = (id: string) => {
        setSelectedModel(id);
        setStep('variant');
    };

    const handleVariantSelect = (id: string) => {
        setSelectedVariant(id);
        setStep('quote_preview');
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'brand' && (
                    <motion.div key="brand" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <BrandSelector onSelect={handleBrandSelect} />
                    </motion.div>
                )}

                {step === 'model' && (
                    <motion.div key="model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ModelSelector
                            brandId={selectedBrand}
                            onSelect={handleModelSelect}
                            onBack={() => setStep('brand')}
                        />
                    </motion.div>
                )}

                {step === 'variant' && (
                    <motion.div key="variant" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <VariantSelector
                            onSelect={handleVariantSelect}
                            onBack={() => setStep('model')}
                        />
                    </motion.div>
                )}

                {step === 'quote_preview' && variant && (
                    <motion.div key="quote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <QuotePreview
                            basePrice={variant.basePrice}
                            deviceDetails={`${brandName} ${model?.name} (${variant.name})`}
                            onGetExactValue={() => setStep('checklist')}
                            onBack={() => setStep('variant')}
                        />
                    </motion.div>
                )}

                {step === 'checklist' && model && variant && (
                    <motion.div key="checklist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <ChecklistWizard
                            deviceInfo={{ name: model.name, variant: variant.name, img: model.img }}
                            onComplete={(collectedAnswers) => {
                                setAnswers(collectedAnswers);
                                setStep('final_quote');
                            }}
                        />
                    </motion.div>
                )}

                {step === 'final_quote' && model && variant && (
                    <motion.div key="final" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <FinalQuote
                            basePrice={variant.basePrice}
                            answers={answers}
                            deviceInfo={{ name: model.name, variant: variant.name }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
