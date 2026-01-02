import { db } from "@/lib/store";
import { Layers, Smartphone, Tag, ShoppingCart, PlusCircle } from "lucide-react";
import Link from 'next/link';

export default async function AdminDashboard() {
    const brands = await db.getBrands();
    const models = await db.getModels();
    const variants = await db.getVariants();
    // Orders are separate but nice to see
    // const orders = db.getOrders(..); // Need to get all orders, store logic only gets by user currently.

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Brands</p>
                        <h3 className="text-3xl font-bold">{brands.length}</h3>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-lg">
                        <Layers className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Models</p>
                        <h3 className="text-3xl font-bold">{models.length}</h3>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
                        <Tag className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Price Variants</p>
                        <h3 className="text-3xl font-bold">{variants.length}</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/category/smartphone" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            Manage Smartphones
                        </div>
                        <p className="text-sm text-muted-foreground">Manage brands, models, and pricing for smartphones.</p>
                    </Link>
                    <Link href="/admin/category/tablet" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <PlusCircle className="w-5 h-5 text-green-600" />
                            Manage Tablets
                        </div>
                        <p className="text-sm text-muted-foreground">Manage brands, models, and pricing for tablets.</p>
                    </Link>
                    <Link href="/admin/category/laptop" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <PlusCircle className="w-5 h-5 text-purple-600" />
                            Manage Laptops
                        </div>
                        <p className="text-sm text-muted-foreground">Manage brands, models, and pricing for laptops.</p>
                    </Link>
                    <Link href="/admin/riders" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <PlusCircle className="w-5 h-5 text-orange-600" />
                            Manage Executives
                        </div>
                        <p className="text-sm text-muted-foreground">Add and manage delivery partners and executives.</p>
                    </Link>
                    <Link href="/admin/orders" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <ShoppingCart className="w-5 h-5 text-indigo-600" />
                            View Orders
                        </div>
                        <p className="text-sm text-muted-foreground">Track orders and assign riders for pickup.</p>
                    </Link>
                </div>
            </div>
        </div>
    );

}
