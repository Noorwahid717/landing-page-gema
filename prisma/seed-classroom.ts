import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏫 Seeding Classroom data...')

  // Create default classroom for GEMA
  const classroom = await prisma.classroom.upsert({
    where: { id: 'gema-classroom-1' },
    update: {},
    create: {
      id: 'gema-classroom-1',
      title: 'GEMA - Generasi Muda Informatika',
      slug: 'gema-classroom-1',
      description: 'Kelas ekstrakulikuler informatika SMA Wahidiyah Kediri. Belajar web development, programming, dan teknologi terkini.',
      teacherId: 'admin-gema-001'
    }
  })

  console.log('✅ Classroom created:', classroom)

  // Create additional classrooms
  const advancedClassroom = await prisma.classroom.upsert({
    where: { id: 'gema-advanced-1' },
    update: {},
    create: {
      id: 'gema-advanced-1',
      title: 'GEMA Advanced - Full Stack Development',
      slug: 'gema-advanced-1',
      description: 'Kelas lanjutan untuk siswa yang ingin mendalami full stack web development dengan React, Node.js, dan database.',
      teacherId: 'admin-gema-001'
    }
  })

  console.log('✅ Advanced Classroom created:', advancedClassroom)

  console.log('🎉 Classroom seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding classroom:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
