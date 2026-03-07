import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

import PincodeInput from '@/components/admin/PincodeInput';

export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentUser) redirect('/login');

    const isZonalHead = currentUser.role === 'ZONAL_HEAD';

    const partners = await prisma.user.findMany({
        where: {
            role: 'PARTNER',
            ...(isZonalHead && currentUser.cityId ? { cityId: currentUser.cityId } : {})
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' }
    });

    const unassignedCities = await prisma.city.findMany({
        where: {
            isActive: true,
            ...(isZonalHead && currentUser.cityId ? { id: currentUser.cityId } : {})
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="p-6 md:p-10 space-y-8 h-[calc(100vh-theme(spacing.16))] overflow-y-auto w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">City Partners</h1>
                    <p className="text-muted-foreground mt-2">Manage city partners who manage local field executives (riders).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-bold mb-6">Register Partner</h2>
                        <form action={async (data) => {
                            'use server';
                            const name = data.get('name') as string;
                            const email = data.get('email') as string;
                            const phone = data.get('phone') as string;
                            const password = data.get('password') as string;
                            const cityId = data.get('cityId') as string;

                            if (name && email && password) {
                                const passwordHash = await bcrypt.hash(password, 10);

                                // Security: Zonal heads can only assign to their own city
                                const finalCityId = (currentUser.role === 'ZONAL_HEAD' && currentUser.cityId)
                                    ? currentUser.cityId
                                    : (cityId || null);

                                await prisma.user.create({
                                    data: {
                                        name,
                                        email,
                                        phone,
                                        passwordHash,
                                        role: 'PARTNER',
                                        cityId: finalCityId
                                    }
                                });
                                revalidatePath('/admin/partners');
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
                                <label className="block text-sm font-medium mb-1">Assign City</label>
                                <select name="cityId" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background">
                                    <option value="">Select an active city...</option>
                                    {unassignedCities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full h-10 mt-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                                Create Partner
                            </button>
                        </form>
                    </div>
                </div>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    {partners.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                            <h3 className="text-lg font-medium text-foreground mb-1">No Partners Found</h3>
                            <p className="text-sm">Use the form to register new city partners.</p>
                        </div>
                    ) : partners.map(p => (
                        <div key={p.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold">{p.name}</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                                        City Partner
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3">
                                    <span>{p.email}</span>
                                    <span>•</span>
                                    <span>{p.phone}</span>
                                </div>
                            </div>

                            <div className="w-full mt-4 sm:mt-0">
                                <form action={async (data) => {
                                    'use server';
                                    const newCityId = data.get('cityId') as string;
                                    const pincodesStr = data.get('pincodes') as string;
                                    const pincodes = pincodesStr ? pincodesStr.split(',').map((p: string) => p.trim()).filter(Boolean) : [];

                                    // Security check
                                    const finalCityId = (currentUser.role === 'ZONAL_HEAD' && currentUser.cityId)
                                        ? currentUser.cityId
                                        : (newCityId === 'none' ? null : newCityId);

                                    await prisma.user.update({
                                        where: { id: p.id },
                                        data: {
                                            cityId: finalCityId,
                                            pincodes
                                        }
                                    });
                                    revalidatePath('/admin/partners');
                                    revalidatePath('/admin/cities');
                                }} className="flex flex-col sm:flex-row gap-4 items-end sm:items-start bg-muted/20 p-3 rounded-lg">
                                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned City</label>
                                        <select
                                            name="cityId"
                                            defaultValue={p.cityId || 'none'}
                                            className="w-full sm:min-w-[160px] h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background"
                                        >
                                            <option value="none" className="italic text-muted-foreground">Unassigned</option>
                                            {unassignedCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <PincodeInput initialPincodes={p.pincodes || []} />
                                    <button type="submit" className="h-9 px-4 shrink-0 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 w-full sm:w-auto mt-2 sm:mt-0 sm:self-end text-center">Save Settings</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
