
'use client';

import { useState, useEffect } from 'react';
import { getDeviceDisplayPrices, updateDeviceDisplayPrice } from '@/actions/admin';
import { Loader2, Save, Banknote } from 'lucide-react';

export default function PricesPage() {
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const data = await getDeviceDisplayPrices();
            setPrices(data);
        } catch (error) {
            console.error('Failed to fetch prices', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, newPrice: string) => {
        setSavingId(id);
        try {
            const res = await updateDeviceDisplayPrice(id, newPrice);
            if (res.success) {
                // Success
                setPrices(prev => prev.map(p => p.id === id ? { ...p, displayPrice: newPrice } : p));
            } else {
                alert('Failed to update price');
            }
        } catch (error) {
            alert('Error updating price');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Banner Prices</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage the estimated cash values shown in the homepage hero animation.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {prices.map((price) => (
                    <div key={price.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{price.categoryName}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{price.categoryKey}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                                defaultValue={price.displayPrice}
                                id={`price-${price.id}`}
                                className="h-10 px-4 rounded-lg border bg-background outline-none focus:border-primary transition-colors flex-1 sm:w-48"
                                placeholder="e.g. ₹129k+"
                            />
                            <button
                                onClick={() => {
                                    const val = (document.getElementById(`price-${price.id}`) as HTMLInputElement).value;
                                    handleUpdate(price.id, val);
                                }}
                                disabled={savingId === price.id}
                                className="h-10 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                            >
                                {savingId === price.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-white/5 border border-dashed rounded-xl">
                <p className="text-xs text-muted-foreground italic">
                    Note: These values are for display purposes only and do not affect the actual evaluation logic. Changes are reflected instantly on the website.
                </p>
            </div>
        </div>
    );
}
