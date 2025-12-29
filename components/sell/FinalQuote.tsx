
import { CheckCircle, Truck, Wallet, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from 'react';
import { placeOrder } from '@/actions/orders';
import { useRouter } from 'next/navigation';

interface FinalQuoteProps {
    basePrice: number;
    answers: Record<string, any>;
    deviceInfo: { name: string; variant: string };
}

export default function FinalQuote({ basePrice, answers, deviceInfo }: FinalQuoteProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    const router = useRouter();

    // Mock calculation logic
    let finalPrice = basePrice;
    if (answers.calls === false) finalPrice *= 0.8;
    if (answers.touch === false) finalPrice *= 0.7;
    if (answers.screen_original === false) finalPrice *= 0.9;
    if (answers.screen_defects?.length > 0) finalPrice -= (answers.screen_defects.length * 500);
    if (answers.functional_problems?.length > 0) finalPrice -= (answers.functional_problems.length * 300);
    if (answers.accessories?.includes('charger')) finalPrice += 200;
    if (answers.accessories?.includes('box')) finalPrice += 100;

    finalPrice = Math.floor(finalPrice);
    if (finalPrice < 0) finalPrice = 0;

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
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
                setLocationError('Unable to retrieve your location. Please enable location permissions.');
                setIsGettingLocation(false);
            }
        );
    };

    const handleSellNow = async () => {
        if (!address.trim()) {
            alert("Please enter your pickup address.");
            return;
        }
        if (!location) {
            alert("Please capture your exact location for pickup.");
            return;
        }

        setIsSubmitting(true);
        try {
            await placeOrder(deviceInfo.name, deviceInfo.variant, finalPrice, address, location, answers);
            router.push('/orders');
        } catch (error) {
            // If unauthorized, redirect to login
            router.push('/login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Best Price for your {deviceInfo.name}</h2>
                <p className="text-muted-foreground">Based on your condition report</p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/50 p-10 rounded-3xl border border-primary/20 text-center space-y-4 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your Offer</p>
                <div className="text-6xl font-extrabold text-foreground">
                    ₹{finalPrice.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Valid for 3 days</p>
            </div>

            {/* Address and Location Form */}
            <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Pickup Details
                </h3>

                <div className="space-y-3">
                    <label className="block text-sm font-medium">Pickup Address</label>
                    <textarea
                        className="w-full p-4 border rounded-xl bg-background min-h-[100px] focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                        placeholder="Enter your full address (House No, Street, Landmark, Pincode)..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium">Exact Location</label>
                    <button
                        onClick={handleGetLocation}
                        type="button"
                        className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${location
                            ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'border-primary/30 hover:border-primary hover:bg-primary/5'
                            }`}
                    >
                        {isGettingLocation ? (
                            <><Loader2 className="animate-spin w-5 h-5" /> Detecting location...</>
                        ) : location ? (
                            <><CheckCircle className="w-5 h-5" /> Location Captured Successfully</>
                        ) : (
                            <><MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" /> Detect My Location for Pickup</>
                        )}
                    </button>
                    {locationError && <p className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-lg">{locationError}</p>}
                    {location && (
                        <p className="text-xs text-muted-foreground text-center font-mono">
                            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-card border rounded-xl flex items-start gap-4">
                    <Truck className="w-8 h-8 text-primary" />
                    <div>
                        <h4 className="font-bold">Free Pickup</h4>
                        <p className="text-sm text-muted-foreground">Instant pickup from your doorstep.</p>
                    </div>
                </div>
                <div className="p-6 bg-card border rounded-xl flex items-start gap-4">
                    <Wallet className="w-8 h-8 text-primary" />
                    <div>
                        <h4 className="font-bold">Instant Cash</h4>
                        <p className="text-sm text-muted-foreground">Payment via UPI or Cash at pickup.</p>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSellNow}
                    disabled={isSubmitting || !address || !location}
                    className="w-full py-4 text-xl font-bold text-white bg-primary rounded-xl shadow-lg hover:bg-primary/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                    By clicking Confirm Order, you agree to our T&C. Login required to proceed.
                </p>
            </div>
        </div>
    );
}
