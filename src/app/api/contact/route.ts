import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Import broadcast function for real-time notifications
async function broadcastNewContact(contactData: {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  createdAt: Date;
}) {
  try {
    // Import dynamically to avoid circular dependencies
    const { broadcastToClients } = await import('@/app/api/notifications/sse/route')
    
    broadcastToClients({
      type: 'new_contact',
      message: 'Pesan baru diterima!',
      data: {
        id: contactData.id,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject || 'Pesan Umum',
        preview: contactData.message.substring(0, 100) + '...',
        timestamp: contactData.createdAt
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.log('Failed to broadcast notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validasi input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Simpan pesan ke database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || 'Pesan Umum',
        message,
        status: 'unread',
        createdAt: new Date()
      }
    })

    // Send real-time notification to admin
    await broadcastNewContact(contact)

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.',
      data: { id: contact.id }
    })

  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim pesan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

// GET untuk admin - mendapatkan semua pesan kontak
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const contacts = await prisma.contact.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data kontak' },
      { status: 500 }
    )
  }
}

// PATCH untuk admin - update status pesan
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    const { status, adminReply } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID pesan tidak ditemukan' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: status || 'read',
        adminReply: adminReply || null,
        repliedAt: adminReply ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Status pesan berhasil diupdate',
      data: contact
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate pesan' },
      { status: 500 }
    )
  }
}

// DELETE untuk admin - hapus pesan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID pesan tidak ditemukan' },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus pesan' },
      { status: 500 }
    )
  }
}
