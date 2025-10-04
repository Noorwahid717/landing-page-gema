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

  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId }
  })

  if (!classroom) {
    return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
  }

  const liveSessionDelegate = ensureLiveSessionDelegate(prisma)

  const existingLiveSession = await liveSessionDelegate.findFirst({
    where: {
      classroomId,
      status: 'live'
    }
  })

  if (existingLiveSession) {
    return NextResponse.json(
      { error: 'Live session already active', session: existingLiveSession },
      { status: 400 }
    )
  }

  const liveSession = await liveSessionDelegate.create({
    data: {
      classroomId,
      status: 'live',
      startsAt: new Date()
    }
  })

  return NextResponse.json({ session: liveSession })
}
