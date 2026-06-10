import React from 'react';

export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Refund & Transaction Reversal Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
                <p className="leading-relaxed">
                    At Fonzkart, we operate as a recommerce platform buying old and used gadgets from customers. Since we buy devices from you rather than selling them to you, our "Refund Policy" governs transaction reversals, payment clearances, and doorstep price evaluations.
                </p>

                <h3 className="text-foreground font-semibold text-xl">1. Finality of Transaction</h3>
                <p className="leading-relaxed">
                    Once our pickup executive has inspected your device, verified its condition, and processed your payment at your doorstep, the transaction is marked as complete. 
                    <strong> Completed transactions are final, and the device cannot be returned to you, nor can the payout be refunded to Fonzkart.</strong>
                </p>

                <h3 className="text-foreground font-semibold text-xl">2. Re-Quotes and Rejected Quotes</h3>
                <p className="leading-relaxed">
                    The initial quote provided on our website is based on the details you input regarding the gadget's condition. If the doorstep physical evaluation reveals discrepancies (e.g. scratches, internal screen issues, battery degradation, missing parts, or incorrect model details), our executive will offer an adjusted quote (a "Re-Quote").
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>If you accept the Re-Quote, we will disburse the adjusted amount immediately.</li>
                    <li>If you reject the Re-Quote, the transaction will be canceled on the spot, and our executive will return your device to you immediately. There are no fees for this.</li>
                </ul>

                <h3 className="text-foreground font-semibold text-xl">3. Delayed or Failed Electronic Payouts</h3>
                <p className="leading-relaxed">
                    We initiate payments instantly at the doorstep via UPI or Bank Transfer (IMPS). In rare cases of technical or banking network failures:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>If a payment fails or gets stuck in a "pending" status, our executive will wait for a short duration while we verify with our payment gateway.</li>
                    <li>If the transaction does not clear within 10 minutes, the executive will return your device, and the order will be rescheduled or cancelled until the banking issue is resolved.</li>
                    <li>If you receive a notification of a successful payment but it is not credited to your bank account, please contact our support desk immediately at <span className="text-foreground">connect@fonzkart.in</span> with the reference ID. We will resolve it with our bank within 24 to 48 hours.</li>
                </ul>

                <h3 className="text-foreground font-semibold text-xl">4. Reversal Requests post-Pickup</h3>
                <p className="leading-relaxed">
                    Once the device is loaded into our transportation system and our executive departs, it undergoes a secure data wiping and factory reset process. For security, privacy, and data protection reasons, we cannot reverse a transaction or retrieve a device once it has left your premises.
                </p>
            </div>
        </div>
    );
}
