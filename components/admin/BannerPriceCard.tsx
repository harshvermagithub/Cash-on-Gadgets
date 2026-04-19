'use client';
import { useState } from 'react';
import { updateDeviceDisplayPrice } from '@/actions/admin';
import { Loader2, Save, Banknote } from 'lucide-react';

export default function BannerPriceCard({ price }: { price: any }) {
    const [val, setVal] = useState(price.displayPrice);
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await updateDeviceDisplayPrice(price.id, val);
        } catch (error) {
            alert('Error updating price');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Banknote className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm leading-none mb-1">{price.categoryName}</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{price.categoryKey}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="h-9 px-3 rounded-lg border bg-background text-sm font-bold outline-none focus:border-emerald-500 w-24 transition-colors"
                />
                <button
                    onClick={handleUpdate}
                    disabled={saving || val === price.displayPrice}
                    className="h-9 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all disabled:opacity-20 flex items-center justify-center min-w-[40px]"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
