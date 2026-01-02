
import { CheckCircle, Truck, Wallet, Loader2, MapPin, Calendar, Clock, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from 'react';
import { placeOrder } from '@/actions/orders';
import { calculatePrice } from '@/actions/priceCalculation';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface FinalQuoteProps {
    basePrice: number;
    answers: Record<string, unknown>;
    deviceInfo: { name: string; variant: string };
    isRepair?: boolean;
    user?: any;
    category?: string;
    onRecalculate?: () => void;
}

type BookingStep = 'contact' | 'quote' | 'address' | 'schedule';

export default function FinalQuote({ basePrice, answers, deviceInfo, isRepair, user, category, onRecalculate }: FinalQuoteProps) {
    // If repair, start at address. Else if user logged in, skip contact and go to quote. Else contact.
    const [bookingStep, setBookingStep] = useState<BookingStep>(
        isRepair ? 'address' : (user ? 'quote' : 'contact')
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ... existing state code ...

    // ... existing calculation code ... (lines 41-76)

    // (Keeping existing code hidden by diff, I will just target the specific blocks or use REPLACE if easier.
    // Since the file is large, I should touch only the interface and render block.
    // But replace_file_content works on blocks.)

    // Actually, I'll update the Interface first.

    // Form Data
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedDate, setSelectedDate] = useState<number>(0); // 0 to 3 index
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [isExpress, setIsExpress] = useState(false);

    // UI States
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const router = useRouter();

    // -------------------------------------------------------------------------
    // PRICE CALCULATION LOGIC
    // -------------------------------------------------------------------------
    const [finalPrice, setFinalPrice] = useState(0);
    const [isCalculating, setIsCalculating] = useState(true);

    useEffect(() => {
        setIsCalculating(true);
        calculatePrice(basePrice, answers, category || 'smartphone')
            .then(price => {
                setFinalPrice(price);
                setIsCalculating(false);
            })
            .catch(err => {
                console.error(err);
                setIsCalculating(false);
            });
    }, [basePrice, answers, category]);

    // -------------------------------------------------------------------------
    // DATE GENERATION (Next 4 days)
    // -------------------------------------------------------------------------
    const dates = Array.from({ length: 4 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            fullDate: d.toISOString()
        };
    });

    const timeSlots = [
        "10:00 AM - 02:00 PM",
        "03:00 PM - 07:00 PM"
    ];

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported');
            setIsGettingLocation(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setIsGettingLocation(false);
            },
            (error) => {
                console.error(error);
                setLocationError('Permission denied or unavailable.');
                setIsGettingLocation(false);
            }
        );
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        try {
            const finalAnswers = {
                ...answers,
                phone,
                scheduledDate: dates[selectedDate].fullDate,
                scheduledSlot: selectedSlot,
                isExpress
            };

            await placeOrder(deviceInfo.name, deviceInfo.variant, finalPrice, address, location, finalAnswers);
            router.push('/orders');
        } catch {
            // Backup redirect flow if placeOrder fails (e.g. auth)
            router.push('/login');
        } finally {
            setIsSubmitting(false);
        }
    };

    // -------------------------------------------------------------------------
    // RENDER: STEP 1 - CONTACT
    // -------------------------------------------------------------------------
    if (bookingStep === 'contact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto py-12 space-y-8"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Almost there!</h2>
                    <p className="text-muted-foreground">Enter your number to unlock your device value.</p>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mobile Number</label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center px-4 bg-muted rounded-xl border font-mono text-muted-foreground">
                                +91
                            </div>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 p-4 border rounded-xl bg-background focus:ring-2 focus:ring-primary/50 outline-none text-lg tracking-widest"
                                placeholder="98765 43210"
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setBookingStep('quote')}
                        disabled={phone.length < 10}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        See Best Price <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-center text-muted-foreground">
                        We respect your privacy. No spam guaranteed.
                    </p>
                </div>
            </motion.div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: STEP 2 - QUOTE
    // -------------------------------------------------------------------------
    if (bookingStep === 'quote') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto py-10 space-y-8"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Best Price for your {deviceInfo.name}</h2>
                    <p className="text-muted-foreground">Based on your condition report</p>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/50 p-10 rounded-[2.5rem] border border-primary/20 text-center space-y-4 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />

                    <p className="text-sm font-bold uppercase tracking-widest text-primary/80">Your Final Offer</p>
                    <div className="text-7xl font-black text-foreground tracking-tight flex items-center justify-center gap-2">
                        {isCalculating ? <Loader2 className="w-16 h-16 animate-spin text-primary" /> : `₹${finalPrice.toLocaleString()}`}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium bg-white/50 inline-block px-4 py-1 rounded-full">
                        Price valid for 3 days
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setBookingStep('address')}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Book Free Pickup <Truck className="w-6 h-6" />
                    </button>
                    <button
                        onClick={onRecalculate || (() => router.back())}
                        className="w-full py-3 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                        Recalculate Value
                    </button>
                </div>
            </motion.div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: STEP 3 - ADDRESS
    // -------------------------------------------------------------------------
    if (bookingStep === 'address') {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="max-w-xl mx-auto py-8 space-y-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setBookingStep('quote')} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Pickup Location</h2>
                </div>

                <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Pickup Address</label>
                        <textarea
                            className="w-full p-4 border rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="House No, Street Area, Landmark, City, Pincode..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Pin Location</label>
                        <button
                            onClick={handleGetLocation}
                            type="button"
                            className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${location
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-primary/30 hover:border-primary hover:bg-primary/5'
                                }`}
                        >
                            {isGettingLocation ? (
                                <><Loader2 className="animate-spin w-5 h-5" /> Detecting location...</>
                            ) : location ? (
                                <><CheckCircle className="w-5 h-5 fill-green-200" /> Location Captured</>
                            ) : (
                                <><MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" /> Detect My Location</>
                            )}
                        </button>
                        {locationError && <p className="text-destructive text-sm text-center">{locationError}</p>}
                    </div>
                </div>

                <button
                    onClick={() => setBookingStep('schedule')}
                    disabled={!address || !location}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Continue to Schedule <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: STEP 4 - SCHEDULE
    // -------------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="max-w-xl mx-auto py-8 space-y-6"
        >
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setBookingStep('address')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold">Schedule Pickup</h2>
            </div>

            <div className="space-y-6">

                {/* Date Selection */}
                <div className={`space-y-3 transition-opacity ${isExpress ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Select Date
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {dates.map((d, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedDate(i);
                                    setIsExpress(false);
                                }}
                                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${selectedDate === i
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20'
                                    : 'border-border bg-card hover:bg-accent'
                                    }`}
                            >
                                <span className="text-xs opacity-80">{d.day}</span>
                                <span className="text-lg font-bold">{d.date}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Slot Selection */}
                <div className={`space-y-3 transition-opacity ${isExpress ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Select Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => {
                                    setSelectedSlot(slot);
                                    setIsExpress(false);
                                }}
                                className={`p-4 rounded-xl border text-sm font-semibold transition-all ${selectedSlot === slot
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                    : 'border-border bg-card hover:bg-accent'
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground font-medium">OR</span>
                    </div>
                </div>

                {/* Express Pickup Option */}
                <div
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${isExpress ? 'border-amber-400 bg-amber-50 shadow-md transform scale-[1.02]' : 'border-border bg-card hover:border-amber-200 opacity-90'
                        }`}
                    onClick={() => {
                        const newState = !isExpress;
                        setIsExpress(newState);
                        if (newState) setSelectedSlot(''); // Clear slot when enabling express
                    }}
                >
                    {isExpress && <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-bl-xl">SELECTED</div>}
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isExpress ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-foreground">Express Pickup</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground line-through">₹50</span>
                                    <span className="text-sm font-bold text-green-600">FREE</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Pickup within 3 hours</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isExpress ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                            {isExpress && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting || (!selectedSlot && !isExpress)}
                className="w-full py-4 text-xl font-bold text-white bg-green-600 rounded-xl shadow-lg hover:bg-green-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Pickup'}
            </button>
            <p className="text-center text-xs text-muted-foreground pb-8">
                By confirming, you agree to our Terms of Service
            </p>
        </motion.div>
    );
}
