import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { addPartner } from '@/actions/admin';

import PincodeInput from '@/components/admin/PincodeInput';

export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const currentUser: any = await prisma.user.findUnique({ 
        where: { id: session.user.id },
        include: { managedCities: true }
    });
    if (!currentUser) redirect('/login');

    const isZonalHead = currentUser.role === 'ZONAL_HEAD';
    const managedCityIds = isZonalHead ? (currentUser.managedCities || []).map((c: any) => c.id) : [];

    const partners = await prisma.user.findMany({
        where: {
            role: 'PARTNER',
            ...(isZonalHead ? { cityId: { in: managedCityIds } } : {})
        },
        include: { city: true },
        orderBy: { name: 'asc' }
    });

    const cities = await prisma.city.findMany({
        include: { users: true }
    });

    const availableCities = await prisma.city.findMany({
        where: {
            isActive: true,
            ...(isZonalHead ? { id: { in: managedCityIds } } : {})
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Partners</h1>
                    <p className="text-muted-foreground mt-2">Manage partners who manage local field executives (riders).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-bold mb-6">Register Partner</h2>
                        <form action={async (data) => {
                            'use server';
                            // ... existing registration logic ...
                            const name = data.get('name') as string;
                            const email = data.get('email') as string;
                            const phone = data.get('phone') as string;
                            const password = data.get('password') as string;
                            const cityId = data.get('cityId') as string;

                            if (name && email && password) {
                                const passwordHash = await bcrypt.hash(password, 10);

                                // Security: Zonal heads can only assign to cities they manage
                                const finalCityId = isZonalHead
                                    ? (managedCityIds.includes(cityId) ? cityId : null)
                                    : (cityId || null);

                                if (isZonalHead && !finalCityId) {
                                    // Could add error handling here
                                    return;
                                }

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
                                <input name="name" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input name="email" type="email" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input name="phone" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Temporary Password</label>
                                <input name="password" type="password" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assign City</label>
                                <select name="cityId" required className="w-full h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background">
                                    <option value="">Select a city...</option>
                                    {availableCities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full h-10 mt-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                                Create New Partner
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Upgrade Existing User</h3>
                            <form action={async (data) => {
                                'use server';
                                const email = data.get('email') as string;
                                if (email) {
                                    const res = await addPartner(email);
                                    if (!res.success) {
                                         // Error handling
                                    }
                                    revalidatePath('/admin/partners');
                                }
                            }} className="space-y-3">
                                <p className="text-xs text-muted-foreground">Grant Partner role to a registered user.</p>
                                <input name="email" type="email" required placeholder="user@email.com" className="w-full h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background" />
                                <button type="submit" className="w-full h-9 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold hover:bg-secondary/80 transition-colors">
                                    Grant Partner Access
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    {partners.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                            <h3 className="text-lg font-medium text-foreground mb-1">No Partners Found</h3>
                            <p className="text-sm">Use the form to register new partners.</p>
                        </div>
                    ) : partners.map(p => (
                        <div key={p.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col xl:flex-row xl:items-start justify-between gap-4 w-full overflow-hidden">
                            <div className="shrink-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold truncate max-w-[200px] sm:max-w-[300px]">{p.name}</h3>
                                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                                        Partner
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <span className="truncate max-w-[200px] sm:max-w-none">{p.email}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="truncate">{p.phone}</span>
                                </div>
                            </div>

                            <div className="w-full xl:w-auto flex-1 min-w-0 mt-2 xl:mt-0">
                                <form action={async (data) => {
                                    'use server';
                                    const newCityId = data.get('cityId') as string;
                                    const pincodesStr = data.get('pincodes') as string;
                                    const pincodes = pincodesStr ? pincodesStr.split(',').map((p: string) => p.trim()).filter(Boolean) : [];

                                    // Security check: Zonal heads can only assign to cities they manage
                                    const finalCityId = isZonalHead
                                        ? (managedCityIds.includes(newCityId) ? newCityId : p.cityId)
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
                                }} className="flex flex-col sm:flex-row gap-4 items-start bg-muted/20 p-4 rounded-lg w-full">
                                    <div className="flex flex-col gap-1 w-full sm:w-[180px] shrink-0">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned City</label>
                                        <select
                                            name="cityId"
                                            defaultValue={p.cityId || 'none'}
                                            className="w-full h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background shrink-0"
                                        >
                                            <option value="none" className="italic text-muted-foreground">Unassigned</option>
                                            {availableCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full min-w-0">
                                        <PincodeInput initialPincodes={p.pincodes || []} />
                                    </div>
                                    <button type="submit" className="h-9 px-4 shrink-0 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 w-full sm:w-auto mt-2 sm:mt-0 sm:self-end text-center flex-none">Save Settings</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
