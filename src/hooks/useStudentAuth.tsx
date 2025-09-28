// Custom Student Authentication Hook
'use client'

import { useState, useEffect } from 'react'

interface StudentData {
  id: string
  studentId: string
  fullName: string
  email: string
  class: string | null
}

interface StudentSession {
  student: StudentData
  loginTime: string
  isAuthenticated: boolean
}

export function useStudentAuth() {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('gema_student_session')
      if (sessionData) {
        const session: StudentSession = JSON.parse(sessionData)
        
        // Check if session is still valid (24 hours)
        const loginTime = new Date(session.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24 && session.isAuthenticated) {
          setStudent(session.student)
          setIsAuthenticated(true)
        } else {
          // Session expired, clear it
          localStorage.removeItem('gema_student_session')
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('Error loading student session:', error)
      localStorage.removeItem('gema_student_session')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('gema_student_session')
    setStudent(null)
    setIsAuthenticated(false)
    window.location.href = '/student/login'
  }

  const updateSession = (studentData: StudentData) => {
    const session: StudentSession = {
      student: studentData,
      loginTime: new Date().toISOString(),
      isAuthenticated: true
    }
    localStorage.setItem('gema_student_session', JSON.stringify(session))
    setStudent(studentData)
    setIsAuthenticated(true)
  }

  return {
    student,
    isLoading,
    isAuthenticated,
    logout,
    updateSession
  }
}