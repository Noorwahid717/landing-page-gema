import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { ensureLiveSessionDelegate } from '@/lib/prisma-delegates'
import { authOptions } from '@/lib/auth-config'

export async function POST(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean)
  const classroomIndex = segments.indexOf('classroom')
  const classroomId = classroomIndex !== -1 ? segments[classroomIndex + 1] : undefined

  const session = await getServerSession(authOptions)

  // Check if user is admin (either ADMIN or SUPER_ADMIN role)
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  if (!session || !isAdmin) {
    console.log('Unauthorized access attempt:', { 
      hasSession: !!session, 
      role: session?.user?.role,
      userType: session?.user?.userType 
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!classroomId) {
    return NextResponse.json({ error: 'Classroom id is required' }, { status: 400 })
  }

  const { sessionId, recordingUrl }: { sessionId?: string; recordingUrl?: string | null } =
    await request.json()

  if (!sessionId) {
    return NextResponse.json({ error: 'Session id is required' }, { status: 400 })
  }

  const liveSessionDelegate = ensureLiveSessionDelegate(prisma)

  const liveSession = await liveSessionDelegate.findUnique({
    where: { id: sessionId }
  })

  if (!liveSession || liveSession.classroomId !== classroomId) {
    return NextResponse.json({ error: 'Live session not found' }, { status: 404 })
  }

  const updatedSession = await liveSessionDelegate.update({
    where: { id: sessionId },
    data: {
      status: 'ended',
      endsAt: new Date(),
      recordingUrl: recordingUrl ?? liveSession.recordingUrl ?? null
    }
  })

  return NextResponse.json({ session: updatedSession })
}
