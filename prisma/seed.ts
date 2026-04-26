import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt' // Importing bcrypt for password hashing

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      firstName: 'System',
      lastName: 'Admin',
      gender: 'N/A',
      birthdate: new Date('1990-01-01'),
      password: hashedPassword,
      utype: 'admin',
    },
  })

  const hashedUserPassword = await bcrypt.hash('user123', 10)
  
  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      gender: 'M',
      birthdate: new Date('1995-05-15'),
      password: hashedUserPassword,
      utype: 'User',
    },
  })

  console.log({ admin, user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })