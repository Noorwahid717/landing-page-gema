import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: registrations
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const registration = await prisma.registration.create({
      data: {
        fullName: body.name,
        email: body.email,
        phone: body.phone,
        school: body.school,
        address: `${body.class} - ${body.school}`,
        program: 'GEMA',
        status: 'pending',
        notes: `Interest: ${body.interest}, Experience: ${body.experience}, Message: ${body.message || 'No message'}`
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dikirim! Kami akan menghubungi Anda segera.',
      data: registration
    })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim pendaftaran' },
      { status: 500 }
    )
  }
}
