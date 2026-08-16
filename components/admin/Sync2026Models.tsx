'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Sync2026Models() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [logOutput, setLogOutput] = useState('');

    const handleSync = async () => {
        setIsLoading(true);
        setStatus('idle');
        setLogOutput('');
        try {
            const res = await fetch('/api/fix-data');
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setLogOutput(data.log || 'Database synced successfully!');
            } else {
                setStatus('error');
                setLogOutput(data.error || 'Failed to sync database.');
            }
        } catch (err: any) {
            setStatus('error');
            setLogOutput(err.message || 'An error occurred during sync.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-card dark:bg-white/[0.03] dark:backdrop-blur-xl border border-border dark:border-white/10 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold">Sync 2026 Smartphone Catalog Database</h3>
                    <p className="text-sm text-muted-foreground">
                        Populates and updates 56 newly launched 2026 models from Samsung, Redmi, Realme, POCO, and Vivo.
                    </p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Syncing...' : 'Sync 2026 Models'}
                </button>
            </div>

            {status === 'success' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Sync Successful!</p>
                        <p className="mt-1 text-xs whitespace-pre-wrap max-h-[150px] overflow-y-auto bg-black/5 dark:bg-black/20 p-2 rounded font-mono">
                            {logOutput}
                        </p>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-300 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Sync Failed</p>
                        <p className="mt-1 text-xs font-mono">{logOutput}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
