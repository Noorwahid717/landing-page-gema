import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verifikasi secret key
    if (body.secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('👥 Starting students seed...');

    // Hapus data students yang ada (opsional, untuk clean slate)
    await prisma.student.deleteMany();
    console.log('🗑️ Cleaned existing students');

    // Data siswa sample
    const studentsData = [
      {
        email: 'ahmad.fauzi@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Ahmad Fauzi',
        studentId: 'SW2024001',
        class: 'X MIPA 1',
        phone: '081234567890',
        address: 'Jl. Mawar No. 12, Kediri'
      },
      {
        email: 'siti.nurhaliza@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Siti Nurhaliza',
        studentId: 'SW2024002',
        class: 'X MIPA 1',
        phone: '081234567891',
        address: 'Jl. Melati No. 8, Kediri'
      },
      {
        email: 'budi.santoso@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Budi Santoso',
        studentId: 'SW2024003',
        class: 'X MIPA 2',
        phone: '081234567892',
        address: 'Jl. Anggrek No. 15, Kediri'
      },
      {
        email: 'dewi.sartika@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Dewi Sartika',
        studentId: 'SW2024004',
        class: 'X MIPA 2',
        phone: '081234567893',
        address: 'Jl. Cempaka No. 20, Kediri'
      },
      {
        email: 'rizky.pratama@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Rizky Pratama',
        studentId: 'SW2024005',
        class: 'XI IPA 1',
        phone: '081234567894',
        address: 'Jl. Dahlia No. 5, Kediri'
      },
      {
        email: 'maya.putri@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Maya Putri',
        studentId: 'SW2024006',
        class: 'XI IPA 1',
        phone: '081234567895',
        address: 'Jl. Teratai No. 18, Kediri'
      },
      {
        email: 'andi.wijaya@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Andi Wijaya',
        studentId: 'SW2024007',
        class: 'XI IPA 2',
        phone: '081234567896',
        address: 'Jl. Kenanga No. 25, Kediri'
      },
      {
        email: 'fatimah.zahra@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Fatimah Zahra',
        studentId: 'SW2024008',
        class: 'XI IPA 2',
        phone: '081234567897',
        address: 'Jl. Sakura No. 10, Kediri'
      },
      {
        email: 'muhammad.ikbal@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Muhammad Ikbal',
        studentId: 'SW2024009',
        class: 'XII IPA 1',
        phone: '081234567898',
        address: 'Jl. Flamboyan No. 7, Kediri'
      },
      {
        email: 'nuraini.fitri@student.smawahidiyah.sch.id',
        password: await bcrypt.hash('password123', 10),
        name: 'Nuraini Fitri',
        studentId: 'SW2024010',
        class: 'XII IPA 1',
        phone: '081234567899',
        address: 'Jl. Bougenville No. 22, Kediri'
      }
    ];

    // Insert students ke database
    console.log('👥 Creating students...');
    const createdStudents = [];

    for (const studentData of studentsData) {
      const student = await prisma.student.create({
        data: {
          email: studentData.email,
          password: studentData.password,
          fullName: studentData.name,
          studentId: studentData.studentId,
          class: studentData.class,
          phone: studentData.phone,
          address: studentData.address,
          status: 'active',
          isVerified: true // Set as verified for demo purposes
        }
      });
      createdStudents.push(student);
      console.log(`✅ Created: ${student.fullName} (${student.studentId})`);
    }

    console.log(`🎉 Successfully created ${createdStudents.length} students!`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdStudents.length} students`,
      data: {
        total: createdStudents.length,
        students: createdStudents.map(s => ({
          id: s.id,
          fullName: s.fullName,
          studentId: s.studentId,
          class: s.class,
          email: s.email
        }))
      }
    });

  } catch (error) {
    console.error('Seed students error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed students',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}