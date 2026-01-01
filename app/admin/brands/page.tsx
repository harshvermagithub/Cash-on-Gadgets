
import { db } from "@/lib/store";
import BrandManager from "@/components/admin/BrandManager";

export default async function AdminBrandsPage() {
    const brands = await db.getBrands();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Brands</h1>
            <BrandManager initialBrands={brands} />
        </div>
    );
}
