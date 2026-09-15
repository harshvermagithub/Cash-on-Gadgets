'use client';

import React, { useState } from 'react';
import { updateDeviceDisplayPrice } from '@/actions/admin';
import {
    Loader2,
    Save,
    Check,
    Smartphone,
    Laptop,
    Tablet,
    Watch,
    Camera,
    Sparkles,
    Banknote
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    phones: Smartphone,
    laptops: Laptop,
    tablets: Tablet,
    watches: Watch,
    cameras: Camera
};

export default function BannerPriceCard({ price }: { price: any }) {
    const [val, setVal] = useState(price.displayPrice || '');
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const Icon = CATEGORY_ICONS[price.categoryKey] || Banknote;

    const handleUpdate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!val.trim()) return;

        setSaving(true);
        setErrorMsg(null);
        try {
            const res = await updateDeviceDisplayPrice(
                price.id || price.categoryKey,
                val.trim(),
                price.categoryKey,
                price.categoryName
            );
            if (res && res.success) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
            } else {
                setErrorMsg('Could not save price. Please try again.');
            }
        } catch (error: any) {
            setErrorMsg(error?.message || 'Error updating price');
        } finally {
            setSaving(false);
        }
    };

    const isDirty = val.trim() !== (price.displayPrice || '').trim();

    return (
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-foreground leading-tight">{price.categoryName}</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mt-0.5">
                            Key: {price.categoryKey}
                        </p>
                    </div>
                </div>

                {/* Live Card Preview Badge */}
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        FonzKart Pay Preview
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xs mt-1">
                        <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                        <span>{val || '₹0'}</span>
                    </span>
                </div>
            </div>

            {/* Price Edit Input */}
            <form onSubmit={handleUpdate} className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder="e.g. ₹1,29,000+ or ₹95,000"
                        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving || !isDirty}
                    className={`h-10 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                        savedSuccess
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isDirty
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-95'
                            : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                    }`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : savedSuccess ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Updated!</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Price</span>
                        </>
                    )}
                </button>
            </form>

            {errorMsg && (
                <p className="text-[11px] font-semibold text-destructive">{errorMsg}</p>
            )}
        </div>
    );
}
