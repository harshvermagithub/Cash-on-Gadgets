
import { db } from "@/lib/store";
import VariantManager from "@/components/admin/VariantManager";

export default async function AdminVariantsPage() {
    const brands = db.getBrands();
    const models = db.getModels();
    const variants = db.getVariants();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Price Variants</h1>
            <VariantManager initialVariants={variants} brands={brands} models={models} />
        </div>
    );
}
