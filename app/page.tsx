
import { fetchBrands } from '@/actions/catalog';
import { HomeClient } from '@/components/HomeClient';

export const revalidate = 0; // Disable cache for immediate updates

export default async function Home() {
    // Fetch critical data on the server with caching
    const brands = await fetchBrands('smartphone');

    return <HomeClient initialBrands={brands} />;
}
