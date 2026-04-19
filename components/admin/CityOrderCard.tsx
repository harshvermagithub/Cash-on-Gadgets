'use client';
import { useState } from 'react';
import { toggleFeaturedCity, updateCityDisplayOrder } from '@/actions/admin';
import { Loader2, Star, ArrowUpDown } from 'lucide-react';

export default function CityOrderCard({ city, index }: { city: any, index: number }) {
    const [isFeatured, setIsFeatured] = useState(city.isFeatured);
    const [order, setOrder] = useState(city.displayOrder?.toString() || '0');
    const [loading, setLoading] = useState(false);

    const handleToggleFeatured = async () => {
        setLoading(true);
        try {
            await toggleFeaturedCity(city.id, !isFeatured);
            setIsFeatured(!isFeatured);
        } catch (error) {
            alert('Failed to update featured status');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrder = async () => {
        setLoading(true);
        try {
            await updateCityDisplayOrder(city.id, parseInt(order));
        } catch (error) {
            alert('Failed to update order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-2xl transition-all ${isFeatured ? 'bg-white shadow-sm border border-blue-100' : 'bg-transparent border border-transparent hover:bg-white/50'}`}>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground border">
                    {index + 1}
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-tight">{city.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isFeatured ? 'text-blue-500' : 'text-slate-400'}`}>
                            {isFeatured ? 'Featured Top' : 'Standard'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Order Input */}
                <div className="flex items-center gap-2 bg-muted/50 p-1 px-2 rounded-lg border">
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    <input 
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        onBlur={handleUpdateOrder}
                        className="w-10 bg-transparent border-none text-[11px] font-black outline-none text-center"
                    />
                </div>

                {/* Star Button */}
                <button
                    onClick={handleToggleFeatured}
                    disabled={loading}
                    className={`p-2 rounded-xl transition-all ${isFeatured ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />}
                </button>
            </div>
        </div>
    );
}
