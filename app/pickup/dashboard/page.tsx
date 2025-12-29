
import { getExecutiveSession, getExecutiveOrders } from '@/actions/executive';
import { redirect } from 'next/navigation';
import OrderList from './OrderList';

export const dynamic = 'force-dynamic';

export default async function ExecutiveDashboard() {
    const executive = await getExecutiveSession();
    if (!executive) {
        redirect('/pickup');
    }

    const orders = await getExecutiveOrders();

    return <OrderList orders={orders} executiveName={executive.name} />;
}
