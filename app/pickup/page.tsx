
'use client';

import { useState } from 'react';
import { loginExecutive, onboardExecutive } from '@/actions/executive';
import { Smartphone, Loader2, ArrowRight } from 'lucide-react';

export default function PickupLoginPage() {
    const [step, setStep] = useState<'phone' | 'password' | 'onboard'>('phone');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [riderId, setRiderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Import onboardExecutive locally to avoid server/client boundary issues if needed, 
    // but better to import at top. Assuming 'onboardExecutive' is imported at top.
    // wait, I need to look at if I imported it. I only imported loginExecutive.

    const handleCheckPhone = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await loginExecutive(phone);
            if (res?.needsOnboarding && res.id) {
                setRiderId(res.id);
                setStep('onboard');
            } else if (res?.error) {
                // Phone not found or other error
                if (res.error === 'Password required') {
                    // This won't happen here as we didn't send password, 
                    // but loginExecutive logic above returns needsOnboarding if pw null.
                    // If pw NOT null, and we didn't send pw, it returns 'Password required'.
                    setStep('password');
                } else {
                    setError(res.error);
                }
            }
        } catch {
            console.error('Error in phone check');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await loginExecutive(phone, password);
            if (res?.error) setError(res.error);
        } catch {
            // Success redirect throws
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="bg-white dark:bg-card border rounded-2xl shadow-xl overflow-hidden p-8 space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        {step === 'phone' ? 'Executive Login' : step === 'onboard' ? 'Setup Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-muted-foreground">
                        {step === 'phone' ? 'Enter your registered mobile number.' :
                            step === 'onboard' ? 'Create a password to secure your account.' :
                                'Enter your password to continue.'}
                    </p>
                </div>

                {step === 'phone' && (
                    <form onSubmit={handleCheckPhone} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 border rounded-xl bg-background text-lg"
                                placeholder="+91 9876543210"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive font-center text-center">{error}</p>}
                        <button disabled={isLoading} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-xl bg-background text-lg"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive font-center text-center">{error}</p>}
                        <button disabled={isLoading} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                        </button>
                        <button type='button' onClick={() => setStep('phone')} className="w-full text-sm text-muted-foreground hover:underline">Back</button>
                    </form>
                )}

                {step === 'onboard' && (
                    <OnboardForm riderId={riderId} />
                )}
            </div>
        </div>
    );
}


function OnboardForm({ riderId }: { riderId: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        setIsLoading(true);
        try {
            await onboardExecutive(riderId, password);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Create Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-background text-lg"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-background text-lg"
                    required
                />
            </div>
            {error && <p className="text-sm text-destructive font-center text-center">{error}</p>}
            <button disabled={isLoading} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
            </button>
        </form>
    )
}
