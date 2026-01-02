'use client';

import { useState } from 'react';
import { questionnaireSteps } from '@/lib/data';
import { upsertEvaluationRule } from '@/actions/admin';
import { EvaluationRule } from '@/lib/store';
import { Loader2, Save } from 'lucide-react';

interface Props {
    category: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialRules: any[];
}

export default function PricingRulesManager({ category, initialRules }: Props) {
    // Flatten steps to get all configurable items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const steps = (questionnaireSteps as any)[category] || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rules, setRules] = useState<any[]>(initialRules);
    const [savingId, setSavingId] = useState<string | null>(null);

    const getRule = (qKey: string, aKey: string) => {
        return rules.find(r => r.questionKey === qKey && r.answerKey === aKey);
    };

    const handleSave = async (qKey: string, aKey: string, label: string, amount: number, percent: number) => {
        const id = `${qKey}-${aKey}`;
        setSavingId(id);
        try {
            await upsertEvaluationRule({
                category,
                questionKey: qKey,
                answerKey: aKey,
                label,
                deductionAmount: parseInt(amount.toString()),
                deductionPercent: parseFloat(percent.toString())
            });
            // Ideally we re-fetch or optimistically update. 
            // Since we passed initialRules, we should update local state to reflect 'saved' status or values if changed.
            // For now, we just stop loading. The inputs are uncontrolled or controlled?
            // Let's make inputs controlled by a local state copy or just derive?
            // If derived, we can't type easily.
            // I'll assume optimistically it saved.
        } catch (error) {
            console.error(error);
            alert('Failed to save rule');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold">Deduction Rules</h3>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="p-3">Condition</th>
                            <th className="p-3">Answer / Option</th>
                            <th className="p-3 w-32">Deduction (₹)</th>
                            <th className="p-3 w-24">Deduction (%)</th>
                            <th className="p-3 w-16">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {steps.map((step: any) => (
                            <>
                                {/* Boolean Questions */}
                                {step.questions?.map((q: any) => (
                                    <RuleRow
                                        key={q.id}
                                        category={category}
                                        qId={q.id}
                                        aId="false" // Usually deduction applies if answer is "No" (false) for functionality
                                        // Wait, for 'calls', answer 'true' is good. 'false' is bad.
                                        // For 'screen_original', 'true' is good. 'false' is bad.
                                        // So we configure rule for "false".
                                        qLabel={q.text}
                                        aLabel="No / Faulty"
                                        initialRule={getRule(q.id, 'false')}
                                        onSave={handleSave}
                                    />
                                ))}

                                {/* Multi-Select Options */}
                                {step.options?.map((opt: any) => (
                                    <RuleRow
                                        key={opt.id}
                                        category={category}
                                        qId={step.id} // The step ID acts as the question ID (e.g. screen_defects)
                                        aId={opt.id} // The option ID (e.g. cracked_screen)
                                        qLabel={step.title}
                                        aLabel={opt.label}
                                        initialRule={getRule(step.id, opt.id)}
                                        onSave={handleSave}
                                    />
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-muted-foreground">
                * Percentages apply to the Base Price. Fixed amounts are deducted after percentage.
                Positive values mean DEDUCTION.
            </p>
        </div>
    );
}

function RuleRow({ category, qId, aId, qLabel, aLabel, initialRule, onSave }: any) {
    const [amount, setAmount] = useState(initialRule?.deductionAmount || 0);
    const [percent, setPercent] = useState(initialRule?.deductionPercent || 0);
    const [isDirty, setIsDirty] = useState(false);

    // Reset if initialRule changes (e.g. refetch)
    // useEffect(() => {
    //      setAmount(initialRule?.deductionAmount || 0);
    //      setPercent(initialRule?.deductionPercent || 0);
    // }, [initialRule]);

    const handleSave = async () => {
        await onSave(qId, aId, aLabel, amount, percent);
        setIsDirty(false);
    };

    return (
        <tr className="hover:bg-muted/50 transition-colors">
            <td className="p-3 font-medium text-muted-foreground w-1/3">
                <span className="line-clamp-1" title={qLabel}>{qLabel}</span>
            </td>
            <td className="p-3 w-1/3">
                <span className="font-semibold">{aLabel}</span>
            </td>
            <td className="p-3">
                <input
                    type="number"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setIsDirty(true); }}
                    className="w-full p-2 border rounded bg-background"
                />
            </td>
            <td className="p-3">
                <input
                    type="number"
                    value={percent}
                    onChange={e => { setPercent(e.target.value); setIsDirty(true); }}
                    className="w-full p-2 border rounded bg-background"
                    step="0.1"
                />
            </td>
            <td className="p-3">
                {isDirty && (
                    <button
                        onClick={handleSave}
                        className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        title="Save Rule"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                )}
            </td>
        </tr>
    );
}
