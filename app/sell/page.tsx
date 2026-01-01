
import SellWizard from "@/components/sell/SellWizard";

export const metadata = {
    title: "Sell Your Phone - Fonzkart",
    description: "Select your device and get the best price.",
};

import { fetchBrands } from "@/actions/catalog";

export default async function SellPage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const category = searchParams.category;
    const brands = await fetchBrands(category);
    return (
        <div className="container mx-auto py-10 px-4">
            <SellWizard key={category} initialBrands={brands} initialCategory={category} />
        </div>
    );
}
