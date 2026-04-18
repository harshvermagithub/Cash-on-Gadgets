import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { X } from 'lucide-react';
import { getSession, isAdmin } from '@/lib/session';
import { redirect } from 'next/navigation';
import { addZonalHead } from '@/actions/admin';
import ZonalHeadUpgradeForm from '@/components/admin/ZonalHeadUpgradeForm';

export const dynamic = 'force-dynamic';

export default async function ZonalHeadsPage() {
    const session = await getSession();
    if (!session || !session.user || !isAdmin(session.user)) {
        redirect('/');
    }

    const zonalHeads = await prisma.user.findMany({
        where: { role: 'ZONAL_HEAD' },
        include: { managedCities: true },
        orderBy: { createdAt: 'desc' }
    });

    const allCities = await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });

    // Cities that don't have a manager yet
    const unmanagedCities = allCities.filter((city: any) => !city.managerId);

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Zonal Heads</h1>
                    <p className="text-muted-foreground mt-2">Manage area directors and assign them to multiple service cities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-bold mb-6">Register Zonal Head</h2>
                        <form action={async (data) => {
                            'use server';
                            // ... existing registration logic ...
                            const name = data.get('name') as string;
                            const email = data.get('email') as string;
                            const phone = data.get('phone') as string;
                            const password = data.get('password') as string;

                            if (name && email && password) {
                                const passwordHash = await bcrypt.hash(password, 10);
                                await prisma.user.create({
                                    data: {
                                        name,
                                        email,
                                        phone,
                                        passwordHash,
                                        role: 'ZONAL_HEAD'
                                    }
                                });
                                revalidatePath('/admin/zonal-heads');
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
                            <button type="submit" className="w-full h-10 mt-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                                Create New Zonal Head
                            </button>
                        </form>

                        <ZonalHeadUpgradeForm />
                    </div>
                </div>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    {zonalHeads.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                            <h3 className="text-lg font-medium text-foreground mb-1">No Zonal Heads Found</h3>
                            <p className="text-sm">Use the form to register directors and assign them to territories.</p>
                        </div>
                    ) : zonalHeads.map((zh: any) => (
                        <div key={zh.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold">{zh.name}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                                            Zonal Head
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                                        <span>{zh.email}</span>
                                        <span>•</span>
                                        <span>{zh.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Optional delete button could go here */}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {zh.managedCities.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No cities assigned yet.</p>
                                    ) : (
                                        zh.managedCities.map((city: any) => (
                                            <div key={city.id} className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium group">
                                                {city.name}
                                                <form action={async () => {
                                                    'use server';
                                                    await prisma.city.update({
                                                        where: { id: city.id },
                                                        data: { managerId: null }
                                                    });
                                                    revalidatePath('/admin/zonal-heads');
                                                }}>
                                                    <button type="submit" className="text-secondary-foreground/50 hover:text-secondary-foreground">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </form>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form action={async (data) => {
                                    'use server';
                                    const cityId = data.get('cityId') as string;
                                    if (cityId) {
                                        await prisma.city.update({
                                            where: { id: cityId },
                                            data: { managerId: zh.id }
                                        });
                                        revalidatePath('/admin/zonal-heads');
                                    }
                                }} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-muted/30 p-4 rounded-lg">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assign New City</label>
                                        <select
                                            name="cityId"
                                            className="w-full h-9 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background"
                                        >
                                            <option value="">Select a city to add...</option>
                                            {allCities
                                                .filter((c: any) => c.managerId !== zh.id)
                                                .map((city: any) => (
                                                    <option key={city.id} value={city.id}>
                                                        {city.name} {city.managerId ? '(Reassign from another ZH)' : ''}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 shrink-0">
                                        Add Territory
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
