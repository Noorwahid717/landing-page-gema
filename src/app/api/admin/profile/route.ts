import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email parameter required'
      }, { status: 400 })
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: admin
    })

  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Name must be at least 2 characters long'
      }, { status: 400 })
    }

    // Update admin profile
    const updatedAdmin = await prisma.admin.update({
      where: { email },
      data: {
        name: name.trim()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedAdmin,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating admin profile:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({
        success: false,
        error: 'Admin not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}