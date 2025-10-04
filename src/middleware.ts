import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    console.log('Middleware - Path:', pathname)
    console.log('Middleware - Token exists:', !!token)
    console.log('Middleware - Token role:', token?.role)
    console.log('Middleware - User type:', token?.userType)
    
    // Check if user is trying to access admin routes (except login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const userRole = typeof token?.role === 'string' ? token.role.toUpperCase() : ''
      const userType = typeof token?.userType === 'string' ? token.userType : undefined

      // If no token, redirect to login
      if (!token) {
        console.log('Middleware - No token, redirecting to admin login')
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(loginUrl)
      }

      // Check if user has admin role and is admin type
      if ((userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') || userType !== 'admin') {
        console.log('Middleware - Invalid admin access:', token?.role, token?.userType)
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }

      console.log('Middleware - Admin access granted for role:', userRole)
    }
    
    // Allow all student routes to bypass NextAuth - they use custom authentication
    if (pathname.startsWith('/student')) {
      console.log('Middleware - Student route access allowed (custom auth)')
      return NextResponse.next()
    }
    
    // Redirect logged-in users from login pages to their respective dashboards
    if (pathname === '/admin/login' && token && token.userType === 'admin') {
      console.log('Middleware - Admin already logged in, redirecting to admin dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    
    // No automatic redirect for student login - they use custom session management
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        console.log('Middleware authorized callback - Path:', pathname)
        console.log('Middleware authorized callback - Token exists:', !!token)
        
        // Always allow access to login and register pages
        if (pathname === '/admin/login' || 
            pathname === '/student/login' || 
            pathname === '/student/register') {
          return true
        }
        
        // Allow all student routes (they have custom authentication)
        if (pathname.startsWith('/student')) {
          console.log('Middleware authorized callback - Student route allowed (custom auth)')
          return true
        }
        
        // For admin routes, require valid admin token
        if (pathname.startsWith('/admin')) {
          const hasValidToken = !!token
          const userRole = typeof token?.role === 'string' ? token.role.toUpperCase() : ''
          const hasValidRole = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'
          const hasValidType = token?.userType === 'admin'
          console.log('Middleware authorized callback - Admin check:', hasValidToken, hasValidRole, hasValidType)
          return hasValidToken && hasValidRole && hasValidType
        }
        
        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
