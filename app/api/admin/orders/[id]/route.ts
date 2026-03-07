import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !['SUPER_ADMIN', 'ADMIN', 'ZONAL_HEAD', 'PARTNER'].includes(session.user?.role || '')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Wait for context params resolution
        const resolvedParams = await context.params;
        const id = resolvedParams.id;

        const { action } = await request.json();

        if (action === 'approve_verification') {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) return new NextResponse('Not found', { status: 404 });

            await prisma.order.update({
                where: { id },
                data: {
                    status: 'picked_up',
                    price: order.offeredPrice || order.price // Commit the offered price
                }
            });
            return NextResponse.json({ success: true });
        } else if (action === 'reject_verification') {
            // Send back to the rider
            await prisma.order.update({
                where: { id },
                data: {
                    status: 'assigned',
                    verificationImages: [],
                    offeredPrice: null,
                    riderAnswers: null
                }
            });
            return NextResponse.json({ success: true });
        }

        return new NextResponse('Invalid action', { status: 400 });
    } catch (error: any) {
        console.error('Order API error:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
