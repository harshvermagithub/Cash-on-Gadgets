const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Brand Priorities...");

    // Explicit Rank Map
    const ranks = {
        'Apple': 1,
        'Samsung': 2,
        'OnePlus': 3,
        'Xiaomi': 4,
        'Oppo': 5,
        'Vivo': 6,
        'Google': 7,
        'Realme': 8,
        'Motorola': 9,
        'Nothing': 10
    };

    const brands = await prisma.brand.findMany();

    for (const b of brands) {
        let p = 100; // Default lower priority
        if (ranks[b.name]) {
            p = ranks[b.name];
        } else if (ranks[b.name.trim()]) {
            p = ranks[b.name.trim()];
        }

        if (b.priority !== p) {
            await prisma.brand.update({
                where: { id: b.id },
                data: { priority: p }
            });
            console.log(`Updated ${b.name}: ${b.priority} -> ${p}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
