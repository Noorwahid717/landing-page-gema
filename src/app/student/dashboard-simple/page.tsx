'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { studentAuth } from '@/lib/student-auth'
import {
  BookOpen,
  Upload,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  FileText,
  GraduationCap,
  Target,
  Sparkles,
  User,
  ArrowLeft
} from 'lucide-react'

// Types
interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: string
  maxSubmissions: number
  submissionCount: number
  instructions: string[]
}

interface Submission {
  id: string
  assignmentId: string
  fileName: string
  filePath: string
  submittedAt: string
  studentId: string
  studentName: string
  status: string
  isLate: boolean
  grade?: number
  feedback?: string
}

interface AssignmentWithSubmissions extends Assignment {
  submissions: Submission[]
}

// Roadmap Types
interface RoadmapChecklistItem {
  id: string;
  text?: string;
  label?: string;
  helpText?: string;
}

interface RoadmapMaterial {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'tutorial' | 'documentation';
}

interface RoadmapActivityGroup {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  items: RoadmapChecklistItem[];
  materials?: RoadmapMaterial[];
}

interface RoadmapStage {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  icon?: string;
  color?: string;
  estimatedDuration?: string;
  skills?: string[];
  overview?: string[];
  activityGroups?: RoadmapActivityGroup[];
}

interface RoadmapProgressState {
  groups: Record<string, Record<string, boolean>>;
  reflection: string;
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<{
    id: string;
    studentId: string;
    fullName: string;
    class: string;
    email: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('assignments')
  
  // Assignments State
  const [assignments, setAssignments] = useState<AssignmentWithSubmissions[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  
  // Roadmap State
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([])
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, RoadmapProgressState>>({})
  const [roadmapStudentId, setRoadmapStudentId] = useState<string>('')
  const [roadmapStudentName, setRoadmapStudentName] = useState<string>('')

  // Roadmap utility functions
  const createEmptyProgress = (stages: RoadmapStage[]): Record<string, RoadmapProgressState> => {
    const progress: Record<string, RoadmapProgressState> = {};
    
    if (!Array.isArray(stages)) {
      console.warn('createEmptyProgress: stages is not an array', stages);
      return progress;
    }
    
    stages.forEach((stage) => {
      const groups: Record<string, Record<string, boolean>> = {};
      stage.activityGroups?.forEach((group) => {
        groups[group.id] = group.items.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {});
      });

      progress[stage.id] = {
        groups,
        reflection: ""
      };
    });
    return progress;
  };

  // Fetch assignments
  const fetchAssignments = useCallback(async (currentStudentId: string) => {
    try {
      setAssignmentsLoading(true)

      const response = await fetch('/api/classroom/assignments')
      const result = response.ok ? await response.json() : null
      const assignmentsPayload: Assignment[] = 
        result?.success && Array.isArray(result.data) ? result.data : []

      // For dashboard-simple, we don't need submissions since it's complex
      // Just show assignments status as "not submitted" by default
      const normalizedAssignments: AssignmentWithSubmissions[] = assignmentsPayload.map(
        (assignment: Assignment) => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          subject: assignment.subject,
          dueDate: assignment.dueDate,
          status: assignment.status,
          maxSubmissions: assignment.maxSubmissions,
          submissionCount: assignment.submissionCount,
          instructions: assignment.instructions ?? [],
          submissions: [] // Keep empty for now - students can upload via assignment detail page
        })
      )

      setAssignments(normalizedAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setAssignmentsLoading(false)
    }
  }, [])

  // Fetch roadmap stages
  const fetchRoadmapStages = async () => {
    try {
      const response = await fetch('/api/roadmap/stages');
      if (response.ok) {
        const result = await response.json();
        const stagesArray = result.success && Array.isArray(result.data) ? result.data : [];
        console.log('Fetched roadmap stages:', stagesArray);
        
        setRoadmapStages(stagesArray);
        setRoadmapProgress(createEmptyProgress(stagesArray));
      } else {
        console.error('Failed to fetch roadmap stages:', response.status);
        setRoadmapStages([]);
      }
    } catch (error) {
      console.error('Error fetching roadmap stages:', error);
      setRoadmapStages([]);
    }
  };

  // Check authentication and load student data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // First, check if student is authenticated
        const session = studentAuth.getSession()
        
        if (!session) {
          console.log('No student session found, redirecting to login')
          const currentUrl = window.location.pathname + window.location.search
          window.location.href = `/student/login?redirect=${encodeURIComponent(currentUrl)}`
          return
        }
        
        console.log('Student session found:', session)
        
        // Set student data from session
        const studentData = {
          id: session.id,
          studentId: session.studentId,
          fullName: session.fullName,
          class: session.class,
          email: session.email
        }
        setStudent(studentData)
        setRoadmapStudentId(studentData.studentId)
        setRoadmapStudentName(studentData.fullName)
        
        // Fetch assignments and roadmap
        fetchAssignments(studentData.studentId)
        fetchRoadmapStages()
        setLoading(false)
        
      } catch (error) {
        console.error('Student auth error:', error)
        // Redirect to login on any error
        const currentUrl = window.location.pathname + window.location.search
        window.location.href = `/student/login?redirect=${encodeURIComponent(currentUrl)}`
      }
    }
    
    checkAuthAndLoadData()
  }, [])

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || roadmapStages.length === 0 || !roadmapStudentId) return;

    try {
      const stored = localStorage.getItem(`gema-roadmap-${roadmapStudentId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          progress: Record<string, RoadmapProgressState>;
        };
        
        const base = createEmptyProgress(roadmapStages);
        if (parsed.progress) {
          Object.entries(parsed.progress).forEach(([stageId, stageProgress]) => {
            const baseStage = base[stageId];
            if (!baseStage) return;

            const mergedGroups: Record<string, Record<string, boolean>> = { ...baseStage.groups };
            Object.entries(baseStage.groups).forEach(([groupId, items]) => {
              const savedGroup = stageProgress.groups?.[groupId];
              if (!savedGroup) return;

              mergedGroups[groupId] = Object.keys(items).reduce<Record<string, boolean>>((acc, itemId) => {
                acc[itemId] = savedGroup[itemId] ?? items[itemId];
                return acc;
              }, {});
            });

            base[stageId] = {
              groups: mergedGroups,
              reflection: stageProgress.reflection ?? ""
            };
          });
        }
        setRoadmapProgress(base);
      }
    } catch (error) {
      console.error('Failed to load roadmap progress', error);
    }
  }, [roadmapStudentId, roadmapStages]);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !roadmapStudentId || Object.keys(roadmapProgress).length === 0) return;

    const payload = {
      studentId: roadmapStudentId,
      studentName: roadmapStudentName,
      progress: roadmapProgress,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`gema-roadmap-${roadmapStudentId}`, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to save roadmap progress', error);
    }
  }, [roadmapProgress, roadmapStudentId, roadmapStudentName])

  // Assignment utilities
  const getAssignmentStatus = (assignment: AssignmentWithSubmissions) => {
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()
    const submitted = assignment.submissions.length > 0
    
    if (submitted) return { status: 'submitted', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle }
    if (dueDate < now) return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle }
    return { status: 'pending', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Roadmap handlers
  const handleItemCheck = (stageId: string, groupId: string, itemId: string, checked: boolean) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        groups: {
          ...prev[stageId]?.groups,
          [groupId]: {
            ...prev[stageId]?.groups?.[groupId],
            [itemId]: checked
          }
        }
      }
    }));
  };

  const handleReflectionChange = (stageId: string, reflection: string) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        reflection
      }
    }));
  };

  const getStageStats = (stageId: string) => {
    const stage = roadmapStages.find(s => s.id === stageId);
    if (!stage) return { completed: 0, total: 0, percentage: 0 };

    const progress = roadmapProgress[stageId];
    if (!progress) return { completed: 0, total: getTotalItems(stage), percentage: 0 };

    let completed = 0;
    let total = 0;

    stage.activityGroups?.forEach(group => {
      group.items.forEach(item => {
        total++;
        if (progress.groups?.[group.id]?.[item.id]) {
          completed++;
        }
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getTotalItems = (stage: RoadmapStage): number => {
    return stage.activityGroups?.reduce((acc, group) => acc + group.items.length, 0) ?? 0;
  };

  const handleLogout = () => {
    // Clear roadmap progress on logout
    if (roadmapStudentId) {
      localStorage.removeItem(`gema-roadmap-${roadmapStudentId}`)
    }
    
    // Clear student session
    studentAuth.clearSession()
    
    // Redirect to login
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
          {/* Classroom Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => setActiveTab('assignments')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Classroom</h3>
                <p className="text-sm text-gray-600">Akses materi & tugas</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Belajar teknologi dengan tutorial interaktif dan sistem feedback real-time
            </p>
          </motion.div>

          {/* Portfolio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => window.location.href = '/student/portfolio'}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Portfolio</h3>
                <p className="text-sm text-gray-600">Kelola proyek Anda</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Upload dan showcase hasil karya teknologi dan programming Anda
            </p>
          </motion.div>

          {/* Progress Belajar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => setActiveTab('roadmap')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Progress Belajar</h3>
                <p className="text-sm text-gray-600">Status pembelajaran</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-purple-600">3/5</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Tutorial Selesai</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Aktivitas Terbaru Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Sample Recent Activities */}
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Menyelesaikan tutorial &ldquo;HTML & CSS Dasar&rdquo;</h4>
                  <p className="text-sm text-gray-600 mt-1">2 jam yang lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Memberikan feedback pada artikel &ldquo;JavaScript Functions&rdquo;</h4>
                  <p className="text-sm text-gray-600 mt-1">1 hari yang lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Memulai proyek portfolio website</h4>
                  <p className="text-sm text-gray-600 mt-1">3 hari yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Assignments
                </div>
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'roadmap'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Roadmap
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'assignments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutorial Assignments</h3>
                {assignmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat assignments...</p>
                  </div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {assignment.subject}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              assignment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : assignment.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {assignment.status === 'completed' ? 'Selesai' : 
                               assignment.status === 'in_progress' ? 'Berlangsung' : 'Belum Mulai'}
                            </span>
                            <Link
                              href={`/student/assignments/${assignment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Lihat →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Belum ada assignments tersedia</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'roadmap' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Roadmap</h3>
                {roadmapStages && roadmapStages.length > 0 ? (
                  <div className="space-y-6">
                    {roadmapStages.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-blue-500 text-white' :
                              index === 1 ? 'bg-green-500 text-white' :
                              index === 2 ? 'bg-yellow-500 text-white' :
                              'bg-gray-300 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{stage.title}</h4>
                              <p className="text-sm text-gray-600">{stage.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {getStageStats(stage.id).completed}/{getTotalItems(stage)}
                            </div>
                            <div className="text-xs text-gray-500">Items</div>
                          </div>
                        </div>

                        {stage.activityGroups && stage.activityGroups.length > 0 && (
                          <div className="space-y-4">
                            {stage.activityGroups.map((group) => (
                              <div key={group.id} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-800 mb-3">{group.title}</h5>
                                <div className="space-y-2">
                                  {group.items.map((item) => {
                                    const isCompleted = roadmapProgress[stage.id]?.groups?.[group.id]?.[item.id] || false;
                                    return (
                                      <div key={item.id} className="flex items-center gap-3">
                                        <button
                                          onClick={() => handleItemCheck(stage.id, group.id, item.id, !isCompleted)}
                                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isCompleted 
                                              ? 'bg-green-500 border-green-500 text-white' 
                                              : 'border-gray-300 hover:border-green-400'
                                          }`}
                                        >
                                          {isCompleted && <CheckCircle className="w-3 h-3" />}
                                        </button>
                                        <span className={`text-sm ${
                                          isCompleted ? 'text-gray-600 line-through' : 'text-gray-800'
                                        }`}>
                                          {item.text || item.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Roadmap pembelajaran akan tersedia segera</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}