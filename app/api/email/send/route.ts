import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromAccount, to, subject, text } = body;

    if (!fromAccount || !to || !subject || !text) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const account = await prisma.emailAccount.findUnique({ where: { email: fromAccount } });
    if (!account) return NextResponse.json({ message: 'Account not found' }, { status: 404 });

    const transporter = nodemailer.createTransport({
      host: '82.208.22.226',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.email,
        pass: account.password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: account.email,
      to,
      subject,
      text,
    });

    // Optionally save to EmailMessage table for history
    await prisma.emailMessage.create({
      data: {
        from: account.email,
        to,
        subject,
        bodyText: text,
        isOutbound: true,
      }
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (e: any) {
    console.error("SMTP Error:", e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
