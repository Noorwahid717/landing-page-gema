import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Import broadcast function for real-time chat
async function broadcastToUsers(messageData: {
  message: string;
  senderName: string;
  sessionId?: string;
  createdAt: Date;
}) {
  try {
    // Import dynamically to avoid circular dependencies
    const { broadcastChatMessage } = await import('@/lib/chat-broadcast')
    
    broadcastChatMessage({
      type: 'admin_message',
      message: messageData.message,
      senderName: messageData.senderName,
      sessionId: messageData.sessionId,
      timestamp: messageData.createdAt
    })
  } catch (error) {
    console.log('Failed to broadcast admin reply:', error)
  }
}

// Import broadcast function for admin notifications
async function broadcastToAdmins(messageData: {
  id: string;
  message: string;
  senderName: string;
  sessionId?: string;
  timestamp: Date;
}) {
  try {
    // Import dynamically to avoid circular dependencies
    const { broadcastToClients } = await import('@/lib/notification-broadcast')
    
    broadcastToClients({
      type: 'admin_reply',
      message: 'Admin membalas pesan chat',
      data: {
        id: messageData.id,
        senderName: messageData.senderName,
        message: messageData.message,
        sessionId: messageData.sessionId,
        timestamp: messageData.timestamp
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.log('Failed to broadcast admin notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, adminName, sessionId } = body

    console.log('Admin reply received:', { message, adminName, sessionId })

    // Validasi input
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Simpan pesan admin ke database
    const adminMessage = await prisma.chatMessage.create({
      data: {
        message: message.trim(),
        senderName: adminName || 'Admin GEMA',
        senderEmail: 'admin@gema.com',
        senderType: 'admin',
        status: 'sent',
        sessionId: sessionId || null,
        createdAt: new Date()
      }
    })

    console.log('Admin message saved:', adminMessage.id)

    // Broadcast to users in the chat
    await broadcastToUsers({
      message: adminMessage.message,
      senderName: adminMessage.senderName,
      sessionId: sessionId,
      createdAt: adminMessage.createdAt
    })

    // Send notification to admins about the reply
    await broadcastToAdmins({
      id: adminMessage.id,
      message: adminMessage.message,
      senderName: adminMessage.senderName,
      sessionId: sessionId,
      timestamp: adminMessage.createdAt
    })

    console.log('Broadcasts sent')

    return NextResponse.json({
      success: true,
      message: 'Pesan admin terkirim',
      data: { 
        id: adminMessage.id,
        timestamp: adminMessage.createdAt 
      }
    })

  } catch (error) {
    console.error('Error sending admin message:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim pesan admin. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
