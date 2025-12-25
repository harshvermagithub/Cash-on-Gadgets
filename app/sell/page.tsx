
import SellWizard from "@/components/sell/SellWizard";

export const metadata = {
    title: "Sell Your Phone - Cash On Gadgets",
    description: "Select your device and get the best price.",
};

export default function SellPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <SellWizard />
        </div>
    );
}
