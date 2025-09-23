import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login test - Email:', email);
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Admin not found',
        email
      });
    }

    console.log('Found admin:', { id: admin.id, email: admin.email, role: admin.role });

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password);
    
    console.log('Password valid:', isPasswordValid);

    return NextResponse.json({
      success: isPasswordValid,
      message: isPasswordValid ? 'Login successful' : 'Invalid password',
      admin: isPasswordValid ? {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      } : null
    });
  } catch (error: any) {
    console.error('Login test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal error',
      error: error.message
    }, { status: 500 });
  }
}