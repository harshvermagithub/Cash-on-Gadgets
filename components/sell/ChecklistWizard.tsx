
import { useState } from 'react';
import { questionnaireSteps } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, XCircle, AlertTriangle, CheckCircle2, Smartphone } from 'lucide-react';
import * as Icons from 'lucide-react';
import Image from 'next/image';

interface ChecklistWizardProps {
    deviceInfo: { name: string; variant: string; img: string };
    category?: string;
    onComplete: (answers: Record<string, unknown>) => void;
}

export default function ChecklistWizard({ deviceInfo, category, onComplete }: ChecklistWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const steps = (questionnaireSteps as any)[category || 'smartphone'] || (questionnaireSteps as any)['smartphone'];
    const currentStep = steps[currentStepIndex];

    const handleAnswer = (key: string, value: unknown) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            onComplete(answers);
        }
    };

    const renderIcon = (iconName: string) => {
        // Handle explicit Lucide icon names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent = (Icons as any)[iconName];
        if (IconComponent) {
            return <IconComponent className="w-8 h-8" />; // Increased size for better visibility
        }

        // Handle case-insensitive or snake_case conversion if needed, though we will try to use direct names in data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const PascalCase = iconName.split(/_| /).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent2 = (Icons as any)[PascalCase];
        if (IconComponent2) {
            return <IconComponent2 className="w-8 h-8" />;
        }

        // Fallback
        return <AlertTriangle className="w-8 h-8" />;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 bg-card border rounded-2xl p-6 md:p-10 shadow-sm">
                <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
                <p className="text-muted-foreground mb-8">{currentStep.subtitle}</p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {currentStep.questions && currentStep.questions.map((q: { id: string; text: string; subtext: string }) => (
                            <div key={q.id} className="space-y-3">
                                <h3 className="font-semibold text-lg">{q.text}</h3>
                                <p className="text-sm text-muted-foreground">{q.subtext}</p>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => handleAnswer(q.id, true)}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${answers[q.id] === true ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:border-primary/50'}`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(q.id, false)}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${answers[q.id] === false ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:border-primary/50'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        ))}

                        {(currentStep.type === 'multi-select' || currentStep.type === 'multi-select-grid' || currentStep.type === 'single-select') && (
                            <div className={`grid gap-4 ${currentStep.type === 'multi-select-grid' || currentStep.type === 'single-select' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                                {currentStep.options?.map((opt: { id: string; label: string; description?: string; icon?: string }) => {
                                    const isMulti = currentStep.type !== 'single-select';
                                    const isSelected = isMulti
                                        ? (answers[currentStep.id] as string[])?.includes(opt.id)
                                        : answers[currentStep.id] === opt.id;

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                if (isMulti) {
                                                    const current = (answers[currentStep.id] as string[]) || [];
                                                    const updated = current.includes(opt.id)
                                                        ? current.filter((id: string) => id !== opt.id)
                                                        : [...current, opt.id];
                                                    handleAnswer(currentStep.id, updated);
                                                } else {
                                                    // Single select behavior: Toggle off if clicked again? Or just select. usually just select.
                                                    handleAnswer(currentStep.id, opt.id);
                                                    // Optionally auto-advance? User didn't ask.
                                                }
                                            }}
                                            className={`relative flex flex-col items-start text-left p-6 border-2 rounded-xl transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-input hover:border-primary/50 hover:shadow-sm'}`}
                                        >
                                            <div className="flex w-full items-start gap-4">
                                                <div className={`p-3 rounded-full flex-shrink-0 ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                                                    <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                                                        {opt.icon ? renderIcon(opt.icon) : (isMulti ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />)}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`block font-bold text-lg mb-1 ${isSelected ? 'text-primary' : ''}`}>{opt.label}</span>
                                                    {/* Render Description if available */}
                                                    {opt.description && (
                                                        <span className="text-sm text-muted-foreground leading-snug block">{opt.description}</span>
                                                    )}
                                                </div>
                                                {isSelected && <div className="text-primary"><CheckCircle2 className="w-6 h-6" /></div>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex justify-between items-center">
                    {currentStepIndex > 0 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold px-4 py-2 transition-colors rounded-lg hover:bg-muted"
                        >
                            <Icons.ArrowLeft className="w-5 h-5" /> Back
                        </button>
                    ) : <div></div>}
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                    >
                        Continue <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Sidebar Summary */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-card border rounded-2xl p-6 sticky top-24">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                        <div className="w-16 h-20 relative bg-white dark:bg-muted rounded overflow-hidden flex items-center justify-center">
                            {deviceInfo.img && (deviceInfo.img.startsWith('/') || deviceInfo.img.startsWith('http')) ? (
                                <Image src={deviceInfo.img} alt={deviceInfo.name} fill className="object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-400">{deviceInfo.name[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{deviceInfo.name}</h3>
                            <p className="text-xs text-muted-foreground">{deviceInfo.variant}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Device Evaluation</h4>

                        {/* Physical Condition Summary */}
                        {(answers.physical_condition as string) && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Physical Condition</p>
                                <div className="text-sm font-medium text-primary flex items-center gap-2">
                                    <Icons.Smartphone className="w-4 h-4" />
                                    {steps.find((s: any) => s.id === 'physical_condition')?.options?.find((o: any) => o.id === answers.physical_condition)?.label as string}
                                </div>
                            </div>
                        )}

                        {/* Body Condition Summary */}
                        {(answers.body_condition as string) && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body Condition</p>
                                <div className="text-sm font-medium text-primary flex items-center gap-2">
                                    <Icons.Shield className="w-4 h-4" />
                                    {steps.find((s: any) => s.id === 'body_condition')?.options?.find((o: any) => o.id === answers.body_condition)?.label as string}
                                </div>
                            </div>
                        )}

                        {/* Functional Issues Summary */}
                        {(answers.functional_issues as string[] | undefined) && (answers.functional_issues as string[]).length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Functional Problems</p>
                                <ul className="text-sm space-y-1">
                                    {(answers.functional_issues as string[]).map((issueId: string) => {
                                        const label = (steps.find((s: any) => s.id === 'functional_issues')?.options?.find((o: any) => o.id === issueId)?.label || issueId) as string;
                                        return (
                                            <li key={issueId} className="text-red-500 flex gap-2"><Icons.AlertCircle className="w-4 h-4" /> {label}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Old/Other Categories Fallback (Tablet/etc using Boolean) */}
                        {category !== 'smartphone' && (
                            <div className="space-y-2">
                                <ul className="text-sm space-y-2">
                                    {answers.power === false && <li className="text-red-500 flex gap-2"><Icons.XCircle className="w-4 h-4" /> Power Issue</li>}
                                    {answers.screen === false && <li className="text-red-500 flex gap-2"><Icons.XCircle className="w-4 h-4" /> Screen Issue</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
