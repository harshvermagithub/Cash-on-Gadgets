import { AlertTriangle, Smartphone, FileText, Clock, Box } from 'lucide-react';

interface OrderDetailsProps {
    order: {
        device: string;
        price: number;
        answers?: any;
    };
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const answers = (typeof order.answers === 'string')
        ? JSON.parse(order.answers)
        : (order.answers || {});

    // Normalize logic for older data if necessary

    const sections = [
        { label: 'Physical Condition', value: answers.physical_condition, icon: <Smartphone className="w-4 h-4" /> },
        { label: 'Body Condition', value: answers.body_condition, icon: <Smartphone className="w-4 h-4" /> },
        { label: 'Warranty Period', value: answers.warranty, icon: <Clock className="w-4 h-4" /> },
        { label: 'Original Bill', value: answers.bill, icon: <FileText className="w-4 h-4" /> },
        { label: 'Screen Type', value: answers.screen_type, icon: <Smartphone className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-xl border">
                <h3 className="font-bold text-lg mb-1">{order.device}</h3>
                <div className="text-2xl font-mono font-bold text-green-600">₹{order.price.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections.map((s, i) => (
                    s.value && (
                        <div key={i} className="p-3 border rounded-lg bg-card">
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                {s.icon} {s.label}
                            </div>
                            <div className="font-semibold capitalize text-sm">
                                {String(s.value).replace(/_/g, ' ')}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Functional Issues */}
            {answers.functional_issues && answers.functional_issues.length > 0 ? (
                <div className="p-4 border rounded-xl bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <div className="text-sm text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Reported Issues
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {answers.functional_issues.map((issue: string) => (
                            <span key={issue} className="px-3 py-1.5 bg-white dark:bg-red-950/30 border border-gray-200 dark:border-red-800/50 rounded-lg text-sm font-bold text-gray-900 dark:text-red-200 shadow-sm capitalize">
                                {issue.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                    <div className="text-sm text-green-700 dark:text-green-400 font-bold flex items-center gap-2">
                        <CheckCircleIcon /> No Functional Issues Reported
                    </div>
                </div>
            )}

            {/* Accessories */}
            {answers.accessories && answers.accessories.length > 0 && (
                <div className="p-4 border rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-3 flex items-center gap-2">
                        <Box className="w-4 h-4" /> Accessories Included
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {answers.accessories.map((acc: string) => (
                            <span key={acc} className="px-3 py-1.5 bg-white dark:bg-blue-950/30 border border-gray-200 dark:border-blue-800/50 rounded-lg text-sm font-bold text-gray-900 dark:text-blue-200 shadow-sm capitalize">
                                {acc.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2 w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
    )
}
