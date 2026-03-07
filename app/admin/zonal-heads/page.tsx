import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export default async function ZonalHeadsPage() {
    const zonalHeads = await prisma.user.findMany({
        where: { role: 'ZONAL_HEAD' },
        include: { city: true },
        orderBy: { createdAt: 'desc' }
    });

    const unassignedCities = await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="p-6 md:p-10 space-y-8 h-[calc(100vh-theme(spacing.16))] overflow-y-auto w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Zonal Heads</h1>
                    <p className="text-muted-foreground mt-2">Manage area directors and assign them to specific service cities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-bold mb-6">Register Zonal Head</h2>
                        <form action={async (data) => {
                            'use server';
                            const name = data.get('name') as string;
                            const email = data.get('email') as string;
                            const phone = data.get('phone') as string;
                            const password = data.get('password') as string;
                            const cityId = data.get('cityId') as string;

                            if (name && email && password) {
                                const passwordHash = await bcrypt.hash(password, 10);
                                await prisma.user.create({
                                    data: {
                                        name,
                                        email,
                                        phone,
                                        passwordHash,
                                        role: 'ZONAL_HEAD',
                                        cityId: cityId || null
                                    }
                                });
                                revalidatePath('/admin/zonal-heads');
                                revalidatePath('/admin/cities');
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input name="name" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input name="email" type="email" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input name="phone" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Temporary Password</label>
                                <input name="password" type="password" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assign City (Optional)</label>
                                <select name="cityId" className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background">
                                    <option value="">Leave Unassigned for now</option>
                                    {unassignedCities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full h-10 mt-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                                Create Zonal Head
                            </button>
                        </form>
                    </div>
                </div>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    {zonalHeads.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                            <h3 className="text-lg font-medium text-foreground mb-1">No Zonal Heads Found</h3>
                            <p className="text-sm">Use the form to register directors and assign them to territories.</p>
                        </div>
                    ) : zonalHeads.map(zh => (
                        <div key={zh.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold">{zh.name}</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-secondary-foreground uppercase tracking-wider">
                                        Zonal Head
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3">
                                    <span>{zh.email}</span>
                                    <span>•</span>
                                    <span>{zh.phone}</span>
                                </div>
                            </div>

                            <div className="min-w-[200px] shrink-0">
                                <form action={async (data) => {
                                    'use server';
                                    const newCityId = data.get('cityId') as string;
                                    await prisma.user.update({
                                        where: { id: zh.id },
                                        data: { cityId: newCityId === 'none' ? null : newCityId }
                                    });
                                    revalidatePath('/admin/zonal-heads');
                                    revalidatePath('/admin/cities');
                                }} className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Territory</label>
                                    <div className="flex gap-2">
                                        <select 
                                            name="cityId" 
                                            defaultValue={zh.cityId || 'none'} 
                                            className="flex-1 h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background"
                                        >
                                            <option value="none" className="italic text-muted-foreground">Unassigned</option>
                                            {unassignedCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="h-9 px-3 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:bg-secondary/80">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
