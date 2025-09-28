'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  LogOut,
  FileText,
  GraduationCap,
  Target,
  Sparkles,
  User,
  ArrowLeft
} from 'lucide-react'

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<{
    id: string;
    studentId: string;
    fullName: string;
    class: string;
    email: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple check - if no student session, redirect to login
    // This is just a demo - in production you'd validate with server
    const urlParams = new URLSearchParams(window.location.search)
    const studentId = urlParams.get('student') || '052002'
    
    // Mock student data based on ID
    const mockStudent = {
      id: studentId,
      studentId: studentId,
      fullName: studentId === '052002' ? 'Ahmad Fadhil Rahman' : 'Siti Nur Aisyah',
      class: studentId === '052002' ? 'XII IPA 1' : 'XI IPS 2',
      email: `${studentId}@student.smawahidiyah.edu`
    }
    
    setStudent(mockStudent)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    // Simple logout - redirect to login
    window.location.href = '/student/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Beranda
              </Link>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Dashboard Siswa</h1>
                  <p className="text-sm text-gray-600">GEMA - SMA Wahidiyah Kediri</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{student?.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {student?.studentId} • {student?.class}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selamat Datang, {student?.fullName}! 🎉</h2>
              <p className="text-blue-100 mb-4">
                Kelas {student?.class} • NIS {student?.studentId}
              </p>
              <p className="text-blue-100">
                Platform pembelajaran digital untuk mengembangkan kemampuan teknologi dengan nilai-nilai pesantren.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/classroom"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 block group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Classroom</h3>
                  <p className="text-sm text-gray-600">Akses materi & tugas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Belajar teknologi dengan tutorial interaktif dan sistem feedback real-time.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/student/portfolio"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 block group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
                  <p className="text-sm text-gray-600">Kelola proyek Anda</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Upload dan showcase hasil karya teknologi dan programming Anda.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Progres Belajar</h3>
                  <p className="text-sm text-gray-600">Status pembelajaran</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tutorial Selesai</span>
                  <span className="font-medium text-green-600">3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Aktivitas Terbaru
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Menyelesaikan tutorial &ldquo;HTML & CSS Dasar&rdquo;
                </p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Memberikan feedback pada artikel &ldquo;JavaScript Functions&rdquo;
                </p>
                <p className="text-xs text-gray-500">1 hari yang lalu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Target className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Memulai proyek portfolio website
                </p>
                <p className="text-xs text-gray-500">3 hari yang lalu</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}