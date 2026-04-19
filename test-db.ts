import { prisma } from './lib/db';

async function testDb() {
    try {
        console.log("Testing DB connection...");
        const count = await prisma.emailMessage.count();
        console.log("Current count:", count);

        console.log("Creating test message...");
        const msg = await prisma.emailMessage.create({
            data: {
                from: 'test@fonzkart.in',
                to: 'dev@fonzkart.in',
                subject: 'Test Message ' + new Date().toISOString(),
                bodyText: 'This is a test message to verify database writes.',
                isOutbound: true
            }
        });
        console.log("Successfully created test message with ID:", msg.id);

        const newCount = await prisma.emailMessage.count();
        console.log("New count:", newCount);

        process.exit(0);
    } catch (e) {
        console.error("Database test failed:", e);
        process.exit(1);
    }
}

testDb();
