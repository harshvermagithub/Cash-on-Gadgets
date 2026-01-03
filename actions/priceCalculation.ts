'use server';

import { db } from '@/lib/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function calculatePrice(basePrice: number, answers: Record<string, any>, category: string = 'smartphone') {
    let finalPrice = basePrice;

    // Fetch rules
    const rules = await db.getEvaluationRules(category);

    if (rules.length === 0) {
        // Fallback to legacy hardcoded logic if no rules are set in DB
        // This ensures the app still works reasonably until Admin configures it.

        if (answers.calls === false) finalPrice *= 0.8;
        if (answers.touch === false) finalPrice *= 0.7;
        if (answers.screen_original === false) finalPrice *= 0.9;

        // Screen Condition Deductions
        const screen = answers.physical_condition as string;
        if (screen === 'good') finalPrice -= basePrice * 0.10;
        else if (screen === 'average') finalPrice -= basePrice * 0.20;
        else if (screen === 'below_average') finalPrice -= basePrice * 0.40;

        // Body Condition Deductions
        const body = answers.body_condition as string;
        if (body === 'good') finalPrice -= basePrice * 0.07;
        else if (body === 'average') finalPrice -= basePrice * 0.14;
        else if (body === 'below_average') finalPrice -= basePrice * 0.35;

        // Functional Problems (4% per issue)
        const problems = answers.functional_problems as string[] | undefined;
        if (problems && problems.length > 0) {
            finalPrice -= (basePrice * 0.04 * problems.length);
        }

        // Warranty (Bonus)
        const warranty = answers.warranty as string;
        if (warranty === '3_months') finalPrice += basePrice * 0.05;
        else if (warranty === '6_months') finalPrice += basePrice * 0.07;
        else if (warranty === '9_months') finalPrice += basePrice * 0.08;
        else if (warranty === '12_months') finalPrice += basePrice * 0.10;

        // Original Bill (Deduction if missing)
        const bill = answers.bill as string;
        if (bill === 'no') finalPrice -= basePrice * 0.15;

        const accessories = answers.accessories as string[] | undefined;
        if (accessories?.includes('charger')) finalPrice += 200;
        if (accessories?.includes('box')) finalPrice += 100;
    } else {
        // Apply DB Rules
        for (const rule of rules) {
            const answer = answers[rule.questionKey];

            // Boolean check
            if (typeof answer === 'boolean') {
                // If rule.answerKey is "false" and answer is false, applied.
                if (String(answer) === rule.answerKey) {
                    applyRule(rule);
                }
            }
            // Array check (multi-select)
            else if (Array.isArray(answer)) {
                if (answer.includes(rule.answerKey)) {
                    applyRule(rule);
                }
            }
        }
    }

    function applyRule(rule: any) {
        if (rule.deductionAmount !== 0) {
            finalPrice -= rule.deductionAmount;
        }
        if (rule.deductionPercent !== 0) {
            // Percent of Base or Final?
            // Usually Base Price is standard reference.
            finalPrice -= (basePrice * (rule.deductionPercent / 100));
        }
    }

    return Math.max(0, Math.floor(finalPrice));
}
