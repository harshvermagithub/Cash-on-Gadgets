import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const count = await prisma.order.count({
            where: {
                riderId: null,
                status: { notIn: ['completed', 'failed'] }
            }
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Unassigned count API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
