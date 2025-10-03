import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

export async function POST(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean)
  const classroomIndex = segments.indexOf('classroom')
  const classroomId = classroomIndex !== -1 ? segments[classroomIndex + 1] : undefined

  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
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

  const existingLiveSession = await prisma.liveSession.findFirst({
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

  const liveSession = await prisma.liveSession.create({
    data: {
      classroomId,
      status: 'live',
      startsAt: new Date()
    }
  })

  return NextResponse.json({ session: liveSession })
}
