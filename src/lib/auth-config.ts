import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

const isProduction = process.env.NODE_ENV === 'production'

const resolveCookieDomain = () => {
  if (!isProduction) {
    return undefined
  }

  const domainFromEnv = process.env.NEXTAUTH_COOKIE_DOMAIN
  if (domainFromEnv) {
    return domainFromEnv
  }

  const urlFromEnv = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL

  if (!urlFromEnv) {
    return undefined
  }

  try {
    const hostname = new URL(urlFromEnv).hostname

    // Avoid setting cookie domain for localhost or invalid hostnames
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.localhost')
    ) {
      return undefined
    }

    return hostname
  } catch (error) {
    console.error('Failed to resolve cookie domain from URL:', urlFromEnv, error)
    return undefined
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/admin/login', // Custom admin login page
  },
  providers: [
    // Admin Login Provider
    CredentialsProvider({
      id: 'admin',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!admin) {
          return null
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          admin.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          userType: 'admin'
        }
      }
    }),
    // Student Login Provider
    CredentialsProvider({
      id: 'student',
      name: 'Student Login',
      credentials: {
        studentId: { label: 'Student ID', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.studentId || !credentials?.password) {
          return null
        }

        const student = await prisma.student.findUnique({
          where: {
            studentId: credentials.studentId
          }
        })

        if (!student || student.status !== 'active') {
          return null
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          student.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.student.update({
          where: { id: student.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: student.id,
          email: student.email,
          name: student.fullName,
          studentId: student.studentId,
          class: student.class || undefined,
          role: 'STUDENT',
          userType: 'student'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        domain: resolveCookieDomain()
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.userType = user.userType
        token.studentId = user.studentId
        token.class = user.class
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string // Use actual user ID, not JWT sub
        session.user.role = token.role as string
        session.user.userType = token.userType as string
        session.user.studentId = token.studentId as string
        session.user.class = token.class as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect - url:', url, 'baseUrl:', baseUrl)
      
      // Always redirect to the provided callback URL if it's within our domain
      if (url.startsWith(baseUrl)) {
        console.log('Using provided callback URL:', url)
        return url
      }
      
      // Handle relative paths
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`
        console.log('Converting relative URL to full URL:', fullUrl)
        return fullUrl
      }
      
      // Default redirect for admin after successful login
      if (url === baseUrl) {
        console.log('Default admin redirect to dashboard')
        return `${baseUrl}/admin/dashboard`
      }
      
      // For unknown or external URLs, redirect to homepage
      console.log('Fallback to homepage for URL:', url)
      return baseUrl
    }
  }
}
