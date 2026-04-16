import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'harsh@sk.com'
    const password = 'Harsh@sk123'
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: { 
            role: 'SUPER_ADMIN' 
        },
        create: {
            email,
            name: 'Harsh Super Admin',
            passwordHash,
            role: 'SUPER_ADMIN'
        }
    })

    console.log(`\n✅ Super Admin setup successfully!`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)
    console.log(`Temporary Password: ${password}`)
    console.log(`\nPlease login at /login and change your password.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
