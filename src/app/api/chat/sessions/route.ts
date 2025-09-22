import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Mendapatkan semua active sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')
    
    console.log('Sessions API called with:', { status, assignedTo })
    
    const sessions = await prisma.chatSession.findMany({
      where: {
        ...(status && status !== 'all' && { status }),
        ...(assignedTo && { assignedTo })
      },
      orderBy: [
        { status: 'asc' }, // waiting first, then active, then closed
        { lastMessage: 'desc' }
      ]
    })

    console.log('Found sessions:', sessions.length)

    // Get message counts and latest message for each session
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const messageCount = await prisma.chatMessage.count({
          where: { sessionId: session.id }
        })
        
        const unreadCount = await prisma.chatMessage.count({
          where: { 
            sessionId: session.id,
            senderType: 'user',
            status: { in: ['sent', 'delivered'] }
          }
        })

        const lastMessage = await prisma.chatMessage.findFirst({
          where: { sessionId: session.id },
          orderBy: { createdAt: 'desc' }
        })

        return {
          ...session,
          messageCount,
          unreadCount,
          lastMessageText: lastMessage?.message || null,
          lastMessageTime: lastMessage?.createdAt || session.lastMessage
        }
      })
    )

    console.log('Sessions with details:', sessionsWithDetails.length)

    return NextResponse.json({
      success: true,
      data: sessionsWithDetails
    })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data sesi chat' },
      { status: 500 }
    )
  }
}

// POST - Assign session to admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, adminId, adminName, action } = body

    if (action === 'assign') {
      const updatedSession = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          assignedTo: adminId,
          status: 'active',
          updatedAt: new Date()
        }
      })

      // Add system message about assignment
      await prisma.chatMessage.create({
        data: {
          message: `Chat ini telah ditangani oleh ${adminName}`,
          senderName: 'System',
          senderEmail: 'system@gema.com',
          senderType: 'admin',
          status: 'delivered',
          sessionId: sessionId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Sesi berhasil ditugaskan',
        data: updatedSession
      })
    }

    if (action === 'close') {
      const updatedSession = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          status: 'closed',
          updatedAt: new Date()
        }
      })

      // Add system message about closure
      await prisma.chatMessage.create({
        data: {
          message: 'Chat ini telah ditutup oleh admin',
          senderName: 'System',
          senderEmail: 'system@gema.com',
          senderType: 'admin',
          status: 'delivered',
          sessionId: sessionId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Sesi berhasil ditutup',
        data: updatedSession
      })
    }

    if (action === 'transfer') {
      const { newAdminId, newAdminName } = body
      
      const updatedSession = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          assignedTo: newAdminId,
          updatedAt: new Date()
        }
      })

      // Add system message about transfer
      await prisma.chatMessage.create({
        data: {
          message: `Chat ini telah dipindahkan ke ${newAdminName}`,
          senderName: 'System',
          senderEmail: 'system@gema.com',
          senderType: 'admin',
          status: 'delivered',
          sessionId: sessionId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Sesi berhasil dipindahkan',
        data: updatedSession
      })
    }

    return NextResponse.json(
      { error: 'Action tidak valid' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error managing chat session:', error)
    return NextResponse.json(
      { error: 'Gagal mengelola sesi chat' },
      { status: 500 }
    )
  }
}

// PATCH - Update session properties
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, priority, tags, notes } = body

    const updatedSession = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        ...(priority && { priority }),
        ...(tags !== undefined && { tags }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Sesi berhasil diupdate',
      data: updatedSession
    })
  } catch (error) {
    console.error('Error updating chat session:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate sesi chat' },
      { status: 500 }
    )
  }
}
