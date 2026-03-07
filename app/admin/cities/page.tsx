import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function CitiesAdminPage() {
    const defaultCities = ['Madurai', 'Chennai', 'Coimbatore'];

    // Auto-seed default cities if they don't exist
    for (const city of defaultCities) {
        await prisma.city.upsert({
            where: { name: city },
            update: {},
            create: { name: city, isActive: true }
        });
    }

    const cities = await prisma.city.findMany({
        include: {
            users: true
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="p-6 md:p-10 space-y-8 h-[calc(100vh-theme(spacing.16))] overflow-y-auto w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Service Cities</h1>
                    <p className="text-muted-foreground mt-2">Manage the cities where Fonzkart operates and view assigned hierarchy logic.</p>
                </div>
                <form action={async (data) => {
                    'use server';
                    const name = data.get('cityName') as string;
                    if (name) {
                        await prisma.city.upsert({
                            where: { name },
                            update: { isActive: true },
                            create: { name, isActive: true }
                        });
                        revalidatePath('/admin/cities');
                    }
                }} className="flex items-center gap-2">
                    <input
                        name="cityName"
                        required
                        placeholder="e.g. Bangalore"
                        className="h-10 px-3 rounded-md border text-sm outline-none focus:border-primary"
                    />
                    <button type="submit" className="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">Add City</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map(city => {
                    const zonalHeads = city.users.filter(u => u.role === 'ZONAL_HEAD');
                    const partners = city.users.filter(u => u.role === 'PARTNER');

                    return (
                        <div key={city.id} className="bg-card border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">{city.name}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${city.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {city.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Zonal Heads ({zonalHeads.length})</h4>
                                    {zonalHeads.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {zonalHeads.map(zh => (
                                                <div key={zh.id} className="text-sm font-medium bg-secondary/30 px-2 py-1 rounded">{zh.name}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">No Zonal Heads Assigned</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">City Partners ({partners.length})</h4>
                                    {partners.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {partners.map(p => (
                                                <div key={p.id} className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">{p.name}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">No Partners Assigned</div>
                                    )}
                                </div>
                            </div>

                            <form action={async () => {
                                'use server';
                                await prisma.city.update({
                                    where: { id: city.id },
                                    data: { isActive: !city.isActive }
                                });
                                revalidatePath('/admin/cities');
                            }} className="mt-6 pt-4 border-t">
                                <button type="submit" className="text-sm text-muted-foreground hover:text-foreground font-medium w-full text-left transition-colors">
                                    Toggle Active Status
                                </button>
                            </form>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
