import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fromAccount = formData.get('fromAccount') as string;
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const text = formData.get('text') as string;

    if (!fromAccount || !to || !subject || !text) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const attachments = [];
    const files = formData.getAll('attachments') as File[];
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type
      });
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
      attachments,
    });

    // Optionally save to EmailMessage table for history
    await prisma.emailMessage.create({
      data: {
        messageId: info.messageId,
        from: account.email,
        to,
        subject,
        bodyText: text,
        isOutbound: true,
        receivedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (e: any) {
    console.error("SMTP Error:", e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
