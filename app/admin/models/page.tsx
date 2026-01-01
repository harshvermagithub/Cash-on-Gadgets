
import { db } from "@/lib/store";
import ModelManager from "@/components/admin/ModelManager";

export default async function AdminModelsPage() {
    const brands = await db.getBrands();
    const models = await db.getModels();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Models</h1>
            <ModelManager initialModels={models} brands={brands} />
        </div>
    );
}
