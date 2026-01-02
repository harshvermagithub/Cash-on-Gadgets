
'use client';

import { useState } from 'react';
import BrandManager from './BrandManager';
import ModelManager from './ModelManager';
import VariantManager from './VariantManager';
import PricingRulesManager from './PricingRulesManager';
import { Brand, Model, Variant, EvaluationRule } from '@/lib/store';

interface Props {
    category: string;
    brands: Brand[];
    models: Model[];
    variants: Variant[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules?: any[];
}

type Tab = 'brands' | 'models' | 'pricing';

export default function ClientCategoryManager({ category, brands, models, variants, rules }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('models'); // Default to models usually

    // Helper for display title
    const titleMap: Record<string, string> = {
        'smartphone': 'Smartphones',
        'tablet': 'Tablets',
        'smartwatch': 'Smartwatches',
        'laptop': 'Laptops',
        'console': 'Gaming Consoles',
        'tv': 'Smart TVs',
        'repair-device': 'Repair Devices'
    };

    const formatTitle = (slug: string) => {
        if (titleMap[slug]) return titleMap[slug];
        return slug.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const title = formatTitle(category);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Manage {title}</h1>

                {/* Tabs */}
                <div className="flex p-1 bg-muted rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('brands')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'brands'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Brands
                    </button>
                    <button
                        onClick={() => setActiveTab('models')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'models'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Models
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'pricing'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Pricing
                    </button>
                </div>
            </div>

            <div className="border rounded-xl p-6 bg-card min-h-[500px]">
                {activeTab === 'brands' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Brands</h2>
                            <p className="text-sm text-muted-foreground">Brands associated with {title}</p>
                        </div>
                        <BrandManager initialBrands={brands} category={category} />
                    </div>
                )}

                {activeTab === 'models' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Models</h2>
                            <p className="text-sm text-muted-foreground">Add or Edit {title} Models</p>
                        </div>
                        {/* We pass the category to ModelManager so it defaults new models to this category */}
                        <ModelManager
                            brands={brands}
                            initialModels={models}
                            preselectedCategory={category}
                        />
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Base Pricing</h2>
                                    <p className="text-sm text-muted-foreground">Manage base prices for {title}</p>
                                </div>
                            </div>
                            <VariantManager
                                brands={brands}
                                models={models}
                                initialVariants={variants}
                                preselectedCategory={category}
                            />
                        </div>

                        <div className="pt-8 border-t">
                            {/* Dynamic Pricing Rules */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">Condition Rules</h2>
                                <p className="text-sm text-muted-foreground">Configure deductions for specific defects.</p>
                            </div>
                            <PricingRulesManager category={category} initialRules={rules || []} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
