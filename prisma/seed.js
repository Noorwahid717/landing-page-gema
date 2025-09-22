const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123!@#', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@smawahidiyah.edu' },
    update: {},
    create: {
      email: 'admin@smawahidiyah.edu',
      name: 'Administrator GEMA',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample settings
  const settings = await prisma.settings.upsert({
    where: { key: 'site_title' },
    update: {},
    create: {
      key: 'site_title',
      value: 'GEMA - Generasi Muda Informatika'
    }
  })

  console.log('✅ Settings created:', settings.key)

  // Create sample activity
  const activity = await prisma.activity.create({
    data: {
      title: 'Workshop Web Development',
      description: 'Belajar membuat website dengan HTML, CSS, dan JavaScript untuk pemula.',
      date: new Date('2024-12-20'),
      location: 'Lab Komputer SMA Wahidiyah',
      capacity: 30,
      registered: 15,
      isActive: true
    }
  })

  console.log('✅ Sample activity created:', activity.title)

  console.log('🎉 Database seeded successfully!')
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
