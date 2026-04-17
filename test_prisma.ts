import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkEmails() {
    const accs = await prisma.emailAccount.findMany();
    console.log("Email Accounts:", accs);
    const msgs = await prisma.emailMessage.findMany({ select: { subject: true, from: true, to: true, isOutbound: true }});
    console.log("Email Messages:", msgs);
}
checkEmails().finally(() => prisma.$disconnect());
