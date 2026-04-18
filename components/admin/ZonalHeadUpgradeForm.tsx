
'use client';

import { useState } from 'react';
import { addZonalHead } from '@/actions/admin';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ZonalHeadUpgradeForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const result = await addZonalHead(email);
            if (result.success) {
                alert(`Successfully granted Zonal Head role to ${email}`);
                setEmail('');
                router.refresh();
            } else {
                alert(result.error || 'Failed to grant role. Ensure the email is registered.');
            }
        } catch (err) {
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Upgrade Existing User</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-muted-foreground">Grant Zonal Head role to a registered user.</p>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">User Email</label>
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        required 
                        placeholder="user@email.com" 
                        className="w-full h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" 
                    />
                </div>
                <button 
                    disabled={isLoading || !email}
                    type="submit" 
                    className="w-full h-9 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold hover:bg-secondary/80 transition-colors mt-2 flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Grant Zonal Head Access
                </button>
            </form>
        </div>
    );
}
