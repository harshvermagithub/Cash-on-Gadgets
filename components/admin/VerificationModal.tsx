'use client';

import { useState, useEffect } from 'react';
import { X, IndianRupee, Camera, Smartphone, Package, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ChecklistWizard from '@/components/sell/ChecklistWizard';
import { calculatePrice } from '@/actions/priceCalculation';
import { findVariantByName } from '@/actions/catalog';

export default function VerificationModal({ order, onClose, onSubmit }: { order: any, onClose: () => void, onSubmit: (data: any) => void }) {
    const [step, setStep] = useState<'photos' | 'conditions' | 'imei' | 'summary'>('photos');
    const [images, setImages] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [imei, setImei] = useState('');
    const [answers, setAnswers] = useState<Record<string, unknown>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [finalPrice, setFinalPrice] = useState(order.price);
    const [basePrice, setBasePrice] = useState<number | null>(null);

    useEffect(() => {
        findVariantByName(order.device).then(v => {
            if (v) setBasePrice(v.basePrice);
        });
    }, [order.device]);

    const handleConditionComplete = async (newAnswers: Record<string, unknown>) => {
        setAnswers(newAnswers);
        setIsCalculating(true);
        try {
            const startPrice = basePrice || order.price;
            const calculated = await calculatePrice(startPrice, newAnswers, 'smartphone');
            setFinalPrice(calculated);
            setStep('imei');
        } catch {
            alert("Price calculation failed. Using current price.");
            setStep('imei');
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <div className="bg-background rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/10">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Verification Flow</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">
                                Step {step === 'photos' ? '1' : step === 'conditions' ? '2' : step === 'imei' ? '3' : '4'} of 4
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-muted flex">
                    <div className={`h-full bg-primary transition-all duration-500 ${
                        step === 'photos' ? 'w-1/4' : step === 'conditions' ? 'w-2/4' : step === 'imei' ? 'w-3/4' : 'w-full'
                    }`} />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {step === 'photos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-start gap-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                    <Camera className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Step 1: Device Photography</h4>
                                    <p className="text-xs text-muted-foreground">Capture front, back, and any physical damages clearly.</p>
                                </div>
                            </div>
                            <ImageUploader onUploadComplete={setImages} />
                            
                            <div className="pt-4">
                                <button
                                    onClick={() => setStep('conditions')}
                                    disabled={images.length === 0}
                                    className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                                >
                                    Proceed to Conditions <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'conditions' && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <div className="mb-6 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-4">
                                <AlertCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Step 2: Conditions Check</h4>
                                    <p className="text-xs text-muted-foreground">Re-evaluate the device conditions exactly as the customer did.</p>
                                </div>
                            </div>
                            <ChecklistWizard 
                                deviceInfo={{ name: order.device, variant: '', img: '' }}
                                category="smartphone"
                                onComplete={handleConditionComplete}
                            />
                        </div>
                    )}

                    {step === 'imei' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Step 3: IMEI Verification</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Dial *#06# on the device to get the IMEI number.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold pl-1 uppercase tracking-widest text-muted-foreground">IMEI Number</label>
                                    <input 
                                        type="text" 
                                        value={imei}
                                        onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))}
                                        className="w-full h-14 px-5 rounded-2xl border bg-card text-lg font-mono tracking-[0.2em] outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center"
                                        placeholder="15-digit IMEI"
                                    />
                                </div>

                                <div className="p-4 bg-muted/30 rounded-2xl border space-y-3 text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Or Scan Device Label</p>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="environment"
                                        className="hidden" 
                                        id="imei-capture"
                                        onChange={(e) => {
                                            alert("Image captured. Manual entry still required for verification accuracy.");
                                        }}
                                    />
                                    <label 
                                        htmlFor="imei-capture"
                                        className="w-full h-12 flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors text-xs font-bold text-primary"
                                    >
                                        <Camera className="w-4 h-4" /> Capture IMEI Label
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setStep('conditions')} className="px-6 h-14 border-2 rounded-2xl font-bold hover:bg-muted transition-all">Back</button>
                                <button
                                    onClick={() => setStep('summary')}
                                    disabled={imei.length < 15}
                                    className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                >
                                    Review Summary <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'summary' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-emerald-500/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-80">Final Calculated Price</p>
                                        <div className="text-5xl font-black mt-2">₹{finalPrice.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                        <IndianRupee className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/20 flex gap-4">
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">IMEI: {imei}</div>
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">{images.length} Photos</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold pl-1 text-muted-foreground uppercase tracking-widest">Verification Notes</label>
                                    <textarea 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full h-32 p-4 rounded-2xl border bg-card text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                        placeholder="Add any specific observations..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-background py-2">
                                <button onClick={() => setStep('imei')} className="px-6 h-14 border-2 rounded-2xl font-bold hover:bg-muted transition-all">Back</button>
                                <button 
                                    onClick={() => onSubmit({ images, notes, finalOffer: finalPrice, imei })}
                                    className="flex-1 h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                                >
                                    Submit for Approval <Check className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
