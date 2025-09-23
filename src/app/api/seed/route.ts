import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Security check - only allow seeding in development or with secret key
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get('secret')
    
    if (secretKey !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@smawahidiyah.edu' }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      })
    }

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

    // Create sample data (only if they don't exist)
    const existingAnnouncements = await prisma.announcement.count()
    if (existingAnnouncements === 0) {
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
          }
        ]
      })
    }

    const existingActivities = await prisma.activity.count()
    if (existingActivities === 0) {
      await prisma.activity.createMany({
        data: [
          {
            title: 'Workshop Web Development',
            description: 'Belajar membuat website modern dengan React dan Next.js dari dasar hingga deployment.',
            date: new Date('2025-01-15'),
            location: 'Lab Komputer SMA Wahidiyah',
            capacity: 30,
            registered: 25
          },
          {
            title: 'Coding Bootcamp Python',
            description: 'Intensive bootcamp belajar Python untuk pemula dengan project-based learning.',
            date: new Date('2025-01-20'),
            location: 'Aula SMA Wahidiyah',
            capacity: 50,
            registered: 45
          }
        ]
      })
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully!',
      admins: [
        {
          email: 'admin@smawahidiyah.edu',
          password: 'admin123',
          role: 'SUPER_ADMIN'
        },
        {
          email: 'gema@smawahidiyah.edu', 
          password: 'admin123',
          role: 'ADMIN'
        }
      ]
    })

  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}