import React from 'react';

export default function CancellationPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Cancellation Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
                <p className="leading-relaxed">
                    At Fonzkart, we strive to make the process of selling your old gadgets as seamless and hassle-free as possible. We understand that plans can change, and you may need to cancel your scheduled pickup. Below is our cancellation policy for sell requests.
                </p>

                <h3 className="text-foreground font-semibold text-xl">1. Cancellation by the Customer</h3>
                <p className="leading-relaxed">
                    You can cancel your scheduled device pickup at any time before our pickup executive arrives at your doorstep. 
                    <strong> There are absolutely no cancellation fees or penalties</strong> for canceling a sell request.
                </p>

                <h3 className="text-foreground font-semibold text-xl">2. How to Cancel Your Booking</h3>
                <p className="leading-relaxed">
                    You can cancel your booking through any of the following methods:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Log in to your Fonzkart account, navigate to the dashboard, select your active order, and click "Cancel Pickup".</li>
                    <li>Contact our customer support team directly at <span className="text-foreground">+91 90603 36060</span> or email us at <span className="text-foreground">connect@fonzkart.in</span>.</li>
                    <li>Inform our pickup executive when they call you to confirm their arrival details.</li>
                </ul>

                <h3 className="text-foreground font-semibold text-xl">3. Automatic Cancellation (No-Show)</h3>
                <p className="leading-relaxed">
                    If our pickup executive arrives at your designated address at the scheduled time and is unable to contact you after multiple attempts (phone call and doorbell), they will wait for a maximum of 15 minutes. 
                    After this period, the pickup booking will be marked as "Unreachable" and automatically canceled. You will need to reschedule the pickup from your dashboard.
                </p>

                <h3 className="text-foreground font-semibold text-xl">4. Cancellation by Fonzkart</h3>
                <p className="leading-relaxed">
                    Fonzkart reserves the right to cancel any sell request under the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>If the designated pickup address falls outside of our operational service area (pincode verification failure).</li>
                    <li>If we detect duplicate bookings, fraudulent accounts, or suspicion of stolen/unauthorized gadgets.</li>
                    <li>In the event of severe weather conditions, local emergencies, or force majeure events that prevent safe travel for our executives.</li>
                </ul>
                <p className="leading-relaxed">
                    If Fonzkart cancels your order, you will be notified immediately via SMS, WhatsApp, or email.
                </p>
            </div>
        </div>
    );
}
