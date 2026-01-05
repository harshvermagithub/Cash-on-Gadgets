
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' });

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return NextResponse.json({ user });
    } catch (e) {
        return NextResponse.json({ error: String(e) });
    }
}
