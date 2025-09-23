import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && 
        req.nextUrl.pathname !== '/admin/login') {
      
      console.log('Middleware - Token:', req.nextauth.token)
      console.log('Middleware - Role:', req.nextauth.token?.role)
      
      // Check if user has admin role
      if (req.nextauth.token?.role !== 'SUPER_ADMIN' && 
          req.nextauth.token?.role !== 'ADMIN') {
        console.log('Middleware - Unauthorized, redirecting to login')
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
          console.log('Middleware authorized - Token exists:', !!token)
          console.log('Middleware authorized - Token role:', token?.role)
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
