import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import PincodeInput from '@/components/admin/PincodeInput';

export const dynamic = 'force-dynamic';

export default async function CitiesAdminPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isZonalHead = currentUser?.role === 'ZONAL_HEAD';

    const defaultCities = ['Madurai', 'Chennai', 'Coimbatore'];

    // Auto-seed default cities if they don't exist
    if (!isZonalHead) {
        for (const city of defaultCities) {
            await prisma.city.upsert({
                where: { name: city },
                update: {},
                create: { name: city, isActive: true }
            });
        }
    }

    const cities = await prisma.city.findMany({
        where: isZonalHead && currentUser?.cityId ? { id: currentUser.cityId } : {},
        include: {
            users: true
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{isZonalHead ? 'My Workspace' : 'Service Cities'}</h1>
                    <p className="text-muted-foreground mt-2">{isZonalHead ? 'View details of your assigned city territory.' : 'Manage cities and their service pincodes.'}</p>
                </div>
                {!isZonalHead && (
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
                            className="h-10 px-3 rounded-md border text-sm outline-none focus:border-primary bg-background"
                        />
                        <button type="submit" className="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">Add City</button>
                    </form>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
                {cities.map(city => {
                    const zonalHeads = city.users.filter(u => u.role === 'ZONAL_HEAD');
                    const partners = city.users.filter(u => u.role === 'PARTNER');

                    return (
                        <div key={city.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter">{city.name}</h3>
                                    <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Operational Territory</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${city.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {city.isActive ? 'Live' : 'Inactive'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Hierarchy Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Zonal Presence</h4>
                                        {zonalHeads.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {zonalHeads.map(zh => (
                                                    <div key={zh.id} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">{zh.name}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-muted-foreground italic">No Zonal Heads</div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Local Partners</h4>
                                        {partners.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {partners.map(p => (
                                                    <div key={p.id} className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">{p.name}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-muted-foreground italic">No Partners</div>
                                        )}
                                    </div>
                                </div>

                                {/* Pincode Management */}
                                <div className="bg-muted/30 p-5 rounded-2xl border border-muted-foreground/5 h-full">
                                    <form action={async (data) => {
                                        'use server';
                                        const pincodesStr = data.get('pincodes') as string;
                                        const pincodes = pincodesStr ? pincodesStr.split(',').map(p => p.trim()).filter(Boolean) : [];
                                        
                                        await prisma.city.update({
                                            where: { id: city.id },
                                            data: { pincodes }
                                        });
                                        revalidatePath('/admin/cities');
                                    }} className="flex flex-col h-full">
                                        <PincodeInput initialPincodes={city.pincodes || []} />
                                        <button type="submit" className="mt-4 w-full h-9 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                                            Update Service Areas
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {!isZonalHead && (
                                <form action={async () => {
                                    'use server';
                                    await prisma.city.update({
                                        where: { id: city.id },
                                        data: { isActive: !city.isActive }
                                    });
                                    revalidatePath('/admin/cities');
                                }} className="pt-4 border-t flex justify-between items-center">
                                    <div className="text-[10px] text-slate-400 font-medium italic">Safety Lock Enabled</div>
                                    <button type="submit" className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">
                                        Toggle Visibility
                                    </button>
                                </form>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
