'use client';

import { useActionState, Suspense } from 'react';
import { verifyEmailSignup } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';
import { Loader2, MailCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailForm() {
    const [state, action, isPending] = useActionState(verifyEmailSignup, null);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="email" value={email} />

            <div className="p-3 bg-primary/10 text-primary text-sm rounded-lg text-center font-medium">
                We sent a 6-digit verification code to <b>{email}</b>.
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Enter 6-digit Code</label>
                <input
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="w-full h-12 px-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center font-mono text-xl tracking-[0.5em] transition-all"
                    placeholder="------"
                />
            </div>

            {state?.error && (
                <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg text-center">
                    {state.error}
                </div>
            )}

            <button
                disabled={isPending}
                className="w-full h-12 mt-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
                {isPending ? <Loader2 className="animate-spin" /> : 'Verify Account'}
            </button>
        </form>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-accent/20 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/10 p-3 rounded-xl mb-4">
                        <MailCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-muted-foreground text-center mt-2">
                        Complete your sign up by entering the verification code.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
                    <VerifyEmailForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
