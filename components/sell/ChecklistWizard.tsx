
import { useState } from 'react';
import { questionnaireSteps } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, XCircle, AlertTriangle, CheckCircle2, Smartphone } from 'lucide-react';
import * as Icons from 'lucide-react';
import Image from 'next/image';

interface ChecklistWizardProps {
    deviceInfo: { name: string; variant: string; img: string };
    onComplete: (answers: Record<string, unknown>) => void;
}

export default function ChecklistWizard({ deviceInfo, onComplete }: ChecklistWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const currentStep = questionnaireSteps[currentStepIndex];

    const handleAnswer = (key: string, value: unknown) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (currentStepIndex < questionnaireSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            onComplete(answers);
        }
    };

    const renderIcon = (iconName: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent = (Icons as any)[iconName.replace(/_([a-z])/g, (g: any) => g[1].toUpperCase())];
        if (IconComponent) {
            return <IconComponent className="w-6 h-6" />;
        }
        return <Smartphone className="w-6 h-6" />;
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
                        {currentStep.questions && currentStep.questions.map((q: any) => (
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

                        {(currentStep.type === 'multi-select' || currentStep.type === 'multi-select-grid') && (
                            <div className={`grid gap-4 ${currentStep.type === 'multi-select-grid' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                                {currentStep.options?.map((opt: any) => {
                                    const isSelected = answers[currentStep.id]?.includes(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                const current = answers[currentStep.id] || [];
                                                const updated = current.includes(opt.id)
                                                    ? current.filter((id: string) => id !== opt.id)
                                                    : [...current, opt.id];
                                                handleAnswer(currentStep.id, updated);
                                            }}
                                            className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all h-full ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                                        >
                                            <div className={`mb-3 p-3 rounded-full ${isSelected ? 'bg-white' : 'bg-accent'}`}>
                                                <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                                                    {opt.icon ? renderIcon(opt.icon) : <Smartphone className="w-6 h-6" />}
                                                </span>
                                            </div>
                                            <span className={`text-sm font-medium text-center ${isSelected ? 'text-primary' : ''}`}>{opt.label}</span>
                                            {isSelected && <div className="absolute top-2 right-2 text-primary"><CheckCircle2 className="w-5 h-5" /></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                    >
                        Continue <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Sidebar Summary */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-card border rounded-2xl p-6 sticky top-24">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                        <div className="w-16 h-20 relative bg-white rounded overflow-hidden">
                            <Image src={deviceInfo.img} alt={deviceInfo.name} fill className="object-contain" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{deviceInfo.name}</h3>
                            <p className="text-xs text-muted-foreground">{deviceInfo.variant}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Device Evaluation</h4>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Functional Status</p>
                            <ul className="text-sm space-y-2">
                                {answers.calls === false && <li className="text-red-500 flex gap-2"><XCircle className="w-4 h-4" /> Calls not working</li>}
                                {answers.touch === false && <li className="text-red-500 flex gap-2"><XCircle className="w-4 h-4" /> Touch faulty</li>}
                                {answers.screen_original === true && <li className="text-green-600 flex gap-2"><Check className="w-4 h-4" /> Original Screen</li>}
                                {Object.keys(answers).length === 0 && <li className="text-muted-foreground italic">Pending...</li>}
                            </ul>
                        </div>

                        {answers.screen_defects?.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Physical Defects</p>
                                <ul className="text-sm space-y-1">
                                    {answers.screen_defects.map((def: string) => (
                                        <li key={def} className="text-amber-600 flex gap-2"><AlertTriangle className="w-4 h-4" /> {def.replace('_', ' ')}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
