import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Client } from 'ssh2';

const prisma = new PrismaClient();

async function execSSH(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        let out = '';
        stream.on('close', (code: any, signal: any) => {
          conn.end();
          resolve(out);
        }).on('data', (data: any) => {
          out += data;
        }).stderr.on('data', (data: any) => {
          out += data;
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect({
      host: '82.208.22.226',
      port: 22,
      username: 'root',
      password: 'Noumaan@Raihaan5'
    });
  });
}

export async function GET() {
  try {
    const accounts = await prisma.emailAccount.findMany({
      select: { email: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ accounts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    if (!email.includes('@')) {
      email = `${email}@fonzkart.in`;
    }

    // 1. Create locally in our db
    await prisma.emailAccount.create({
      data: {
        email,
        password,
      }
    });

    // 2. SSH into VPS and configure docker-mailserver account
    try {
      await execSSH(`docker exec mailserver setup email add ${email} '${password}'`);
    } catch (e) {
      console.warn("SSH command failed, likely because of SSH creds or mailserver container missing, but account saved locally:", e);
    }

    return NextResponse.json({ success: true, email });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
