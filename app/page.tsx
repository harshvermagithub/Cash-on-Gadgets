import { fetchBrands } from '@/actions/catalog';
import { HomeClient } from '@/components/HomeClient';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching to ensure fresh data since it's now dynamic


export default async function Home() {
    // Fetch critical data on the server with caching
    const brands = await fetchBrands('smartphone');

    // Fetch active cities mapped simply as string names
    const citiesObj = await prisma.city.findMany({
        where: { isActive: true },
        select: { name: true }
    });
    // Fetch display prices for the hero animation
    const displayPrices = await prisma.deviceDisplayPrice.findMany();

    return <HomeClient initialBrands={brands} activeCities={activeCities} displayPrices={displayPrices} />;
}
