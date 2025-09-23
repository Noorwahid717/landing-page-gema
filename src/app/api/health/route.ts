import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Simple query to test database
    const adminCount = await prisma.admin.count();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      adminCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}