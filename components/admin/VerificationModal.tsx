'use client';

import { useState } from 'react';
import { X, Calculator, IndianRupee, Camera } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function VerificationModal({ order, onClose, onSubmit }: { order: any, onClose: () => void, onSubmit: (data: any) => void }) {
    const [images, setImages] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [recalculatedPrice, setRecalculatedPrice] = useState<number | null>(null);
    const [customPrice, setCustomPrice] = useState<string>('');
    const [showRecalculate, setShowRecalculate] = useState(false);
    
    const handleRecalculate = () => {
        // Mock recalculation popup/logic
        setShowRecalculate(true);
    };

    const confirmRecalculatedPrice = () => {
        const val = parseInt(customPrice);
        if (!isNaN(val) && val > 0) {
            setRecalculatedPrice(val);
            setShowRecalculate(false);
        }
    };

    const finalOffer = recalculatedPrice !== null ? recalculatedPrice : order.price;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
                    <h3 className="font-bold text-lg">Physical Verification</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Device Photographs
                        </h4>
                        <p className="text-xs text-muted-foreground mb-4">Please take clear pictures of the front, back, and any reported defects.</p>
                        <ImageUploader onUploadComplete={setImages} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2 uppercase tracking-wide text-muted-foreground">Verification Notes & Findings</h4>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-24 p-3 rounded-lg border text-sm outline-none focus:border-primary bg-background resize-none"
                            placeholder="Describe any mismatches from the customer's reported condition..."
                        />
                    </div>

                    <div className="bg-muted/30 border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-sm font-semibold">Final Offered Price</h4>
                                <p className="text-xs text-muted-foreground">Original: ₹{order.price.toLocaleString()}</p>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                ₹{finalOffer.toLocaleString()}
                            </div>
                        </div>

                        {!showRecalculate && recalculatedPrice === null && (
                            <button 
                                onClick={handleRecalculate}
                                className="w-full py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-secondary/80"
                            >
                                <Calculator className="w-4 h-4" /> Recalculate Price
                            </button>
                        )}
                        
                        {showRecalculate && (
                            <div className="mt-3 p-3 bg-card border rounded-lg space-y-3 animate-in slide-in-from-top-2">
                                <label className="text-xs font-semibold">Enter Revised Device Value (₹)</label>
                                <div className="flex relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <input 
                                        type="number" 
                                        value={customPrice}
                                        onChange={(e) => setCustomPrice(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3 rounded-md border text-sm outline-none focus:border-primary bg-background"
                                        placeholder="e.g. 18000"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowRecalculate(false)} className="flex-1 py-2 border rounded-md text-sm font-medium hover:bg-muted">Cancel</button>
                                    <button onClick={confirmRecalculatedPrice} className="flex-1 py-2 bg-primary text-white rounded-md text-sm font-bold">Apply Price</button>
                                </div>
                            </div>
                        )}
                        
                        {recalculatedPrice !== null && !showRecalculate && (
                           <div className="flex justify-end gap-2 mt-2">
                               <button onClick={() => setRecalculatedPrice(null)} className="text-xs underline text-muted-foreground hover:text-foreground">Reset to Original</button>
                           </div>
                        )}
                    </div>

                </div>
                
                <div className="p-4 border-t sticky bottom-0 bg-background/95 backdrop-blur z-10 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 font-semibold text-sm rounded-lg hover:bg-muted">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSubmit({ images, notes, finalOffer })}
                        disabled={images.length === 0}
                        className="px-5 py-2.5 font-bold text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        Submit for Verification
                    </button>
                </div>
            </div>
        </div>
    );
}
