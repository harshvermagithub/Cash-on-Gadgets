import { NextResponse } from 'next/server';
import { execSSH } from '@/lib/ssh';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cmd = searchParams.get('cmd');
        const token = searchParams.get('token');
        
        if (token !== 'a57c91b6192d04a60032e1966') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        if (!cmd) {
            return NextResponse.json({ error: 'Missing cmd' }, { status: 400 });
        }
        
        console.log("Terminal executing command via SSH:", cmd);
        const result = await execSSH(cmd);
        return NextResponse.json({ result });
    } catch (error: any) {
        console.error("Terminal SSH exec failed:", error);
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
