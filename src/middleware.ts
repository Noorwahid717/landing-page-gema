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
      
      // If no token, redirect to login
      if (!token) {
        console.log('Middleware - No token, redirecting to admin login')
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Check if user has admin role and is admin type
      if ((token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') || token.userType !== 'admin') {
        console.log('Middleware - Invalid admin access:', token.role, token.userType)
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      
      console.log('Middleware - Admin access granted for role:', token.role)
    }
    
    // Check if user is trying to access student routes (except login/register/dashboard-simple)
    if (pathname.startsWith('/student') && 
        pathname !== '/student/login' && 
        pathname !== '/student/register' && 
        pathname !== '/student/dashboard-simple') {
      
      // If no token, redirect to student login
      if (!token) {
        console.log('Middleware - No token, redirecting to student login')
        const loginUrl = new URL('/student/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Check if user has student role and is student type
      if (token.role !== 'STUDENT' || token.userType !== 'student') {
        console.log('Middleware - Invalid student access:', token.role, token.userType)
        return NextResponse.redirect(new URL('/student/login', req.url))
      }
      
      console.log('Middleware - Student access granted')
    }
    
    // Redirect logged-in users from login pages to their respective dashboards
    if (pathname === '/admin/login' && token && token.userType === 'admin') {
      console.log('Middleware - Admin already logged in, redirecting to admin dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    
    if (pathname === '/student/login' && token && token.userType === 'student') {
      console.log('Middleware - Student already logged in, redirecting to student dashboard')
      return NextResponse.redirect(new URL('/student/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        console.log('Middleware authorized callback - Path:', pathname)
        console.log('Middleware authorized callback - Token exists:', !!token)
        
        // Always allow access to login, register pages, and dashboard-simple
        if (pathname === '/admin/login' || 
            pathname === '/student/login' || 
            pathname === '/student/register' ||
            pathname === '/student/dashboard-simple') {
          return true
        }
        
        // For admin routes, require valid admin token
        if (pathname.startsWith('/admin')) {
          const hasValidToken = !!token
          const hasValidRole = token?.role === 'SUPER_ADMIN' || token?.role === 'ADMIN'
          const hasValidType = token?.userType === 'admin'
          console.log('Middleware authorized callback - Admin check:', hasValidToken, hasValidRole, hasValidType)
          return hasValidToken && hasValidRole && hasValidType
        }
        
        // For student routes (except dashboard-simple), require valid student token
        if (pathname.startsWith('/student') && pathname !== '/student/dashboard-simple') {
          const hasValidToken = !!token
          const hasValidRole = token?.role === 'STUDENT'
          const hasValidType = token?.userType === 'student'
          console.log('Middleware authorized callback - Student check:', hasValidToken, hasValidRole, hasValidType)
          return hasValidToken && hasValidRole && hasValidType
        }
        
        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/student/:path*']
}
