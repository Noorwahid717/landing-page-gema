import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { studentId, password } = await request.json()

    if (!studentId || !password) {
      return NextResponse.json(
        { success: false, error: 'Student ID and password are required' },
        { status: 400 }
      )
    }

    // Find student by studentId
    const student = await prisma.student.findUnique({
      where: {
        studentId: studentId
      }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 401 }
      )
    }

    if (student.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Student account is not active' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, student.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.student.update({
      where: { id: student.id },
      data: { lastLoginAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        class: student.class
      }
    })

  } catch (error) {
    console.error('Student login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}