import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    console.log('Middleware - Path:', pathname)
    console.log('Middleware - Token exists:', !!token)
    console.log('Middleware - Token role:', token?.role)
    
    // Check if user is trying to access admin routes (except login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      
      // If no token, redirect to login
      if (!token) {
        console.log('Middleware - No token, redirecting to login')
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Check if user has admin role
      if (token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') {
        console.log('Middleware - Invalid role:', token.role, 'redirecting to login')
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      
      console.log('Middleware - Access granted for role:', token.role)
    }
    
    // If user is logged in and tries to access login page, redirect to dashboard
    if (pathname === '/admin/login' && token) {
      console.log('Middleware - User already logged in, redirecting to dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        console.log('Middleware authorized callback - Path:', pathname)
        console.log('Middleware authorized callback - Token exists:', !!token)
        
        // Always allow access to login page
        if (pathname === '/admin/login') {
          return true
        }
        
        // For admin routes, require valid token with proper role
        if (pathname.startsWith('/admin')) {
          const hasValidToken = !!token
          const hasValidRole = token?.role === 'SUPER_ADMIN' || token?.role === 'ADMIN'
          console.log('Middleware authorized callback - Valid token:', hasValidToken)
          console.log('Middleware authorized callback - Valid role:', hasValidRole)
          return hasValidToken && hasValidRole
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
