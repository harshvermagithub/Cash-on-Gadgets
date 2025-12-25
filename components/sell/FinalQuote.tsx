
import { CheckCircle, Truck, Wallet, Loader2 } from "lucide-react";
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

    const handleSellNow = async () => {
        setIsSubmitting(true);
        try {
            await placeOrder(deviceInfo.name, deviceInfo.variant, finalPrice);
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

            <div className="pt-6">
                <button
                    onClick={handleSellNow}
                    disabled={isSubmitting}
                    className="w-full py-4 text-xl font-bold text-white bg-primary rounded-xl shadow-lg hover:bg-primary/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sell Now'}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                    By clicking Sell Now, you agree to our T&C. Login required to proceed.
                </p>
            </div>
        </div>
    );
}
