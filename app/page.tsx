import { fetchBrands } from '@/actions/catalog';
import { HomeClient } from '@/components/HomeClient';
import { prisma } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour to reduce Vercel function invocations

export default async function Home() {
    // Fetch critical data on the server with caching
    const brands = await fetchBrands('smartphone');

    // Fetch active cities mapped simply as string names
    const citiesObj = await prisma.city.findMany({
        where: { isActive: true },
        select: { name: true }
    });
    const activeCities = citiesObj.map(c => c.name);

    return <HomeClient initialBrands={brands} activeCities={activeCities} />;
}
