import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin users
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.admin.upsert({
    where: { email: 'admin@smawahidiyah.edu' },
    update: {},
    create: {
      email: 'admin@smawahidiyah.edu',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN'
    }
  })

  await prisma.admin.upsert({
    where: { email: 'gema@smawahidiyah.edu' },
    update: {},
    create: {
      email: 'gema@smawahidiyah.edu',
      password: hashedPassword,
      name: 'GEMA Admin',
      role: 'ADMIN'
    }
  })

  // Create sample announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Pendaftaran GEMA Batch 2025 Dibuka!',
        content: 'Hai calon santri teknologi! Pendaftaran untuk program GEMA tahun 2025 sudah dibuka. Buruan daftar sebelum kuota penuh!',
        type: 'info'
      },
      {
        title: 'Workshop Gratis: Introduction to AI',
        content: 'Ikuti workshop gratis tentang pengenalan Artificial Intelligence. Terbuka untuk semua siswa SMA Wahidiyah.',
        type: 'success'
      },
      {
        title: 'Prestasi GEMA di Kompetisi Nasional',
        content: 'Selamat! Tim GEMA berhasil meraih juara 2 dalam kompetisi programming nasional. Bangga dengan pencapaian kalian!',
        type: 'success'
      }
    ]
  })

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        title: 'Workshop Web Development',
        description: 'Belajar membuat website modern dengan React dan Next.js dari dasar hingga deployment.',
        date: new Date('2024-12-15'),
        location: 'Lab Komputer SMA Wahidiyah',
        capacity: 30,
        registered: 25
      },
      {
        title: 'Coding Bootcamp Python',
        description: 'Intensive bootcamp belajar Python untuk pemula dengan project-based learning.',
        date: new Date('2024-12-20'),
        location: 'Aula SMA Wahidiyah',
        capacity: 50,
        registered: 45
      },
      {
        title: 'Kompetisi Mobile App Development',
        description: 'Lomba pengembangan aplikasi mobile untuk tingkat SMA se-Jawa Timur.',
        date: new Date('2024-12-25'),
        location: 'Gedung Serbaguna Kedunglo',
        capacity: 100,
        registered: 80
      }
    ]
  })

  // Create sample gallery items
  await prisma.gallery.createMany({
    data: [
      {
        title: 'Workshop Web Development 2024',
        description: 'Antusiasme peserta dalam workshop web development',
        imageUrl: '/images/gallery/workshop-1.jpg',
        category: 'workshop'
      },
      {
        title: 'Tim GEMA Juara Kompetisi',
        description: 'Moment penyerahan trophy juara kompetisi',
        imageUrl: '/images/gallery/competition-1.jpg',
        category: 'achievement'
      },
      {
        title: 'Kegiatan Coding Bootcamp',
        description: 'Suasana seru coding bootcamp Python',
        imageUrl: '/images/gallery/bootcamp-1.jpg',
        category: 'bootcamp'
      },
      {
        title: 'Presentasi Project Final',
        description: 'Siswa mempresentasikan project akhir',
        imageUrl: '/images/gallery/presentation-1.jpg',
        category: 'project'
      }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
