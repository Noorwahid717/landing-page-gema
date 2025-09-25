import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import type { Student as PrismaStudent } from '@prisma/client'

type SafeStudent = Omit<PrismaStudent, 'password'>

const sanitizeStudent = ({ password: _password, ...rest }: PrismaStudent): SafeStudent => {
  void _password
  return rest
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const classFilter = searchParams.get('class') || undefined
    const verifiedParam = searchParams.get('verified') || undefined

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (classFilter && classFilter !== 'all') {
      where.class = classFilter
    }

    if (verifiedParam === 'true' || verifiedParam === 'false') {
      where.isVerified = verifiedParam === 'true'
    }

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        studentId: true,
        fullName: true,
        email: true,
        class: true,
        phone: true,
        address: true,
        parentName: true,
        parentPhone: true,
        status: true,
        isVerified: true,
        joinedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      studentId,
      fullName,
      email,
      password,
      class: studentClass,
      phone,
      address,
      parentName,
      parentPhone,
      status,
      isVerified
    } = await request.json()

    const sanitizedStudentId = typeof studentId === 'string' ? studentId.trim() : ''
    const sanitizedFullName = typeof fullName === 'string' ? fullName.trim() : ''
    const sanitizedEmail = typeof email === 'string' ? email.trim() : ''

    if (!sanitizedStudentId || !sanitizedFullName || !sanitizedEmail || !password) {
      return NextResponse.json(
        { error: 'Student ID, name, email, and password are required' },
        { status: 400 }
      )
    }

    const existingStudentId = await prisma.student.findUnique({
      where: { studentId: sanitizedStudentId }
    })

    if (existingStudentId) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 400 }
      )
    }

    const existingEmail = await prisma.student.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const student = await prisma.student.create({
      data: {
        studentId: sanitizedStudentId,
        fullName: sanitizedFullName,
        email: sanitizedEmail,
        password: hashedPassword,
        class: typeof studentClass === 'string' ? studentClass.trim() || null : studentClass ?? null,
        phone: typeof phone === 'string' ? phone.trim() || null : phone ?? null,
        address: typeof address === 'string' ? address.trim() || null : address ?? null,
        parentName: typeof parentName === 'string' ? parentName.trim() || null : parentName ?? null,
        parentPhone: typeof parentPhone === 'string' ? parentPhone.trim() || null : parentPhone ?? null,
        status: status || 'active',
        isVerified: typeof isVerified === 'boolean' ? isVerified : true
      }
    })

    return NextResponse.json(sanitizeStudent(student), { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      studentId,
      email,
      password,
      class: studentClass,
      fullName,
      phone,
      address,
      parentName,
      parentPhone,
      status,
      isVerified
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const sanitizedStudentId = typeof studentId === 'string' ? studentId.trim() : undefined
    const sanitizedEmail = typeof email === 'string' ? email.trim() : undefined

    if (sanitizedStudentId) {
      const existingStudentId = await prisma.student.findFirst({
        where: {
          studentId: sanitizedStudentId,
          NOT: { id }
        }
      })

      if (existingStudentId) {
        return NextResponse.json(
          { error: 'Student ID already exists' },
          { status: 400 }
        )
      }
    }

    if (sanitizedEmail) {
      const existingEmail = await prisma.student.findFirst({
        where: {
          email: sanitizedEmail,
          NOT: { id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    const dataToUpdate: Record<string, unknown> = {}

    if (typeof sanitizedStudentId !== 'undefined') {
      dataToUpdate.studentId = sanitizedStudentId
    }

    if (typeof sanitizedEmail !== 'undefined') {
      dataToUpdate.email = sanitizedEmail
    }

    if (typeof fullName !== 'undefined') {
      dataToUpdate.fullName =
        typeof fullName === 'string' ? fullName.trim() : fullName
    }

    if (typeof status !== 'undefined') {
      dataToUpdate.status = status
    }

    if (typeof isVerified !== 'undefined') {
      dataToUpdate.isVerified =
        typeof isVerified === 'string' ? isVerified === 'true' : isVerified
    }

    if (typeof studentClass !== 'undefined') {
      dataToUpdate.class =
        typeof studentClass === 'string' ? studentClass.trim() || null : studentClass
    }

    if (typeof phone !== 'undefined') {
      dataToUpdate.phone =
        typeof phone === 'string' ? phone.trim() || null : phone
    }

    if (typeof address !== 'undefined') {
      dataToUpdate.address =
        typeof address === 'string' ? address.trim() || null : address
    }

    if (typeof parentName !== 'undefined') {
      dataToUpdate.parentName =
        typeof parentName === 'string' ? parentName.trim() || null : parentName
    }

    if (typeof parentPhone !== 'undefined') {
      dataToUpdate.parentPhone =
        typeof parentPhone === 'string' ? parentPhone.trim() || null : parentPhone
    }

    if (password) {
      dataToUpdate.password = await hashPassword(password)
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: dataToUpdate,
    })

    return NextResponse.json(sanitizeStudent(updatedStudent))
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
