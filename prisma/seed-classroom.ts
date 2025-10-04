import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CLASSROOMS = [
  {
    id: 'gema-classroom-1',
    title: 'GEMA - Generasi Muda Informatika',
    slug: 'gema-classroom-1',
    description:
      'Kelas ekstrakulikuler informatika SMA Wahidiyah Kediri. Belajar web development, programming, dan teknologi terkini.',
    teacherId: 'admin-gema-001'
  },
  {
    id: 'gema-advanced-1',
    title: 'GEMA Advanced - Full Stack Development',
    slug: 'gema-advanced-1',
    description:
      'Kelas lanjutan untuk siswa yang ingin mendalami full stack web development dengan React, Node.js, dan database.',
    teacherId: 'admin-gema-001'
  }
]

async function main() {
  console.log('🏫 Seeding Classroom data...')

  const seededClassrooms = await Promise.all(
    CLASSROOMS.map((classroom) =>
      prisma.classroom.upsert({
        where: { id: classroom.id },
        update: {
          title: classroom.title,
          slug: classroom.slug,
          description: classroom.description,
          teacherId: classroom.teacherId
        },
        create: classroom
      })
    )
  )

  for (const classroom of seededClassrooms) {
    console.log(`✅ Classroom ready: ${classroom.id} – ${classroom.title}`)
  }

  console.log('🎉 Classroom seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding classroom:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
