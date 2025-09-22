import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch dashboard statistics
    const [
      totalContacts,
      totalRegistrations,
      pendingRegistrations,
      totalActivities,
      unreadContacts
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.registration.count(),
      prisma.registration.count({
        where: { status: 'PENDING' }
      }),
      prisma.activity.count({
        where: { isActive: true }
      }),
      prisma.contact.count({
        where: { status: 'unread' }
      })
    ])

    return NextResponse.json({
      totalContacts,
      totalRegistrations,
      pendingRegistrations,
      totalActivities,
      unreadContacts
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
