'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface ImeiScannerProps {
    onDetected: (imei1: string, imei2?: string) => void;
    onClose: () => void;
}

export default function ImeiScanner({ onDetected, onClose }: ImeiScannerProps) {
    const [scannedResult, setScannedResult] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const scannerId = "imei-reader";
        
        const config = { 
            fps: 10, 
            qrbox: { width: 300, height: 150 },
            aspectRatio: 1.0 
        };

        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        const imeiMatch = decodedText.match(/\d{15}/);
                        if (imeiMatch) {
                            const foundImei = imeiMatch[0];
                            setScannedResult(prev => {
                                if (prev.includes(foundImei)) return prev;
                                return [...prev, foundImei];
                            });
                        }
                    },
                    () => {}
                );
            } catch (err) {
                console.error("Scanner start error:", err);
                setError("Camera access denied or not available. Please ensure HTTPS is used.");
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(e => console.error("Cleanup error", e));
            }
        };
    }, []);

    const handleConfirm = () => {
        if (scannedResult.length > 0) {
            onDetected(scannedResult[0], scannedResult[1]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 text-primary rounded-xl">
                        <Camera className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">IMEI Barcode Scanner</h3>
                        <p className="text-xs text-muted-foreground">Scan the barcode on device label or box</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="relative flex-1 rounded-3xl overflow-hidden border-2 border-white/20 ">
                <div id="imei-reader" className="w-full h-full"></div>
                
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                    <div className="w-full h-full border-2 border-primary/50 relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_10px_rgba(16,185,129,1)] animate-scan"></div>
                    </div>
                </div>

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-8 text-center flex-col gap-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="font-bold text-lg">{error}</p>
                        <button onClick={onClose} className="px-8 py-3 bg-white text-black rounded-2xl font-bold">Close Scanner</button>
                    </div>
                )}
            </div>

            <div className="mt-6">
                {scannedResult.length > 0 ? (
                    <div className="bg-white/10 p-6 rounded-3xl space-y-4 animate-in slide-in-from-bottom-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary flex justify-between items-center">
                            <span>Detected Numbers</span>
                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{scannedResult.length}</span>
                        </p>
                        <div className="space-y-2">
                            {scannedResult.map((res, i) => (
                                <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-primary/20">
                                    <span className="font-mono text-lg tracking-[0.1em] text-white font-bold">{res}</span>
                                    <div className="p-1 bg-primary text-black rounded-full">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handleConfirm}
                            className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            Confirm & Auto-fill <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        {!error && (
                            <>
                                <div className="flex items-center gap-3 text-primary/80 animate-pulse">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="font-black text-sm uppercase tracking-widest">Searching for Barcode...</span>
                                </div>
                                <p className="text-xs text-white/30 text-center max-w-[200px]">Align the IMEI barcode within the frame</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes scanAnimation {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    position: absolute;
                    animation: scanAnimation 2s ease-in-out infinite;
                }
                #imei-reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
