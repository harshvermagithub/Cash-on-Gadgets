import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Enabling Realtime for Notification table...');
  try {
    // 1. Enable replication for the table
    await prisma.$executeRawUnsafe(`ALTER TABLE "Notification" REPLICA IDENTITY FULL;`);
    
    // 2. Add table to supabase_realtime publication (if using Supabase)
    try {
        await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";`);
        console.log('Successfully added to supabase_realtime publication.');
    } catch (e: any) {
        console.log('Publication note:', e.message);
    }

    console.log('Database optimization complete!');
  } catch (error) {
    console.error('Error during optimization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
