
import SellWizard from "@/components/sell/SellWizard";

export const metadata = {
    title: "Sell Your Phone - Fonzkart",
    description: "Select your device and get the best price.",
};

import { fetchBrands } from "@/actions/catalog";

export default async function SellPage() {
    const brands = await fetchBrands();
    return (
        <div className="container mx-auto py-10 px-4">
            <SellWizard initialBrands={brands} />
        </div>
    );
}
