import React from 'react';

export default function ReturnPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Return & Exchange Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
                <p className="leading-relaxed">
                    Fonzkart operates as a recommerce platform buying pre-owned smartphones, tablets, laptops, consoles, and smart TVs from consumers. Because our business model is focused on purchasing devices, our Return and Exchange Policy outlines the ownership transfer and return limitations of gadgets sold to us.
                </p>

                <h3 className="text-foreground font-semibold text-xl">1. Transfer of Ownership</h3>
                <p className="leading-relaxed">
                    Upon the receipt of payment at the doorstep, the ownership of the device transfers completely to Fonzkart. The seller agrees that they no longer hold any claims, rights, or interest in the device, its components, or any accessories handed over during pickup.
                </p>

                <h3 className="text-foreground font-semibold text-xl">2. Device Return Policy</h3>
                <p className="leading-relaxed">
                    Once a transaction is finalized (device picked up and payment received):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>No returns are allowed:</strong> You cannot request the return of your sold device once the pickup is complete.</li>
                    <li><strong>No exchanges are allowed:</strong> You cannot exchange a sold device for another gadget or buy it back from our executives at the doorstep.</li>
                </ul>

                <h3 className="text-foreground font-semibold text-xl">3. Permanent Data Deletion Warning</h3>
                <p className="leading-relaxed">
                    To protect your privacy, Fonzkart initiates a military-grade data erasure and factory reset on all purchased devices. 
                    <strong> This process is irreversible.</strong> We are not responsible for any personal data, photos, accounts, or configurations left on the device, and we cannot retrieve or recover any data for you once the device is handed over. 
                    Please ensure you have backed up all your data and removed your SIM card, memory cards, and cloud accounts (like iCloud, Google Account, or Samsung Account) before the pickup.
                </p>

                <h3 className="text-foreground font-semibold text-xl">4. Exceptional Disputes</h3>
                <p className="leading-relaxed">
                    In very rare cases where a dispute arises before the device reaches our regional testing facility (e.g. if the payment was reversed or failed post-departure), you must contact our dispute resolution desk within 24 hours at <span className="text-foreground">connect@fonzkart.in</span> or call <span className="text-foreground">+91 90603 36060</span>. We will investigate the transaction and, if verified, coordinate the resolution or return details.
                </p>
            </div>
        </div>
    );
}
