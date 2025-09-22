import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && 
        req.nextUrl.pathname !== '/admin/login') {
      
      // Check if user has admin role
      if (req.nextauth.token?.role !== 'SUPER_ADMIN' && req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For other admin routes, require token
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        
        // Allow access to non-admin routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
