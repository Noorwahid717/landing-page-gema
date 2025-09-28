// Student Authentication Session Management
export interface StudentSession {
  id: string
  studentId: string
  fullName: string
  class: string
  email: string
  loginTime: number
}

const STORAGE_KEY = 'gema-student-session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const studentAuth = {
  // Save student session
  setSession: (student: Omit<StudentSession, 'loginTime'>) => {
    const session: StudentSession = {
      ...student,
      loginTime: Date.now()
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      console.log('Student session saved:', session.studentId)
    }
  },

  // Get current session
  getSession: (): StudentSession | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      
      const session: StudentSession = JSON.parse(stored)
      
      // Check if session is expired
      if (Date.now() - session.loginTime > SESSION_DURATION) {
        console.log('Student session expired')
        studentAuth.clearSession()
        return null
      }
      
      return session
    } catch (error) {
      console.error('Error reading student session:', error)
      return null
    }
  },

  // Check if student is logged in
  isAuthenticated: (): boolean => {
    return studentAuth.getSession() !== null
  },

  // Clear session
  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Student session cleared')
    }
  },

  // Require authentication - redirect to login if not authenticated
  requireAuth: (redirectTo?: string) => {
    if (!studentAuth.isAuthenticated()) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''
      const loginUrl = `/student/login${redirectTo || currentUrl ? `?redirect=${encodeURIComponent(redirectTo || currentUrl)}` : ''}`
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl
      }
      return false
    }
    return true
  }
}

// Student authentication check hook for client components
export const useStudentAuth = () => {
  if (typeof window === 'undefined') return null
  
  const session = studentAuth.getSession()
  return session
}