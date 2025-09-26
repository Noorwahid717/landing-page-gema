'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
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
  ListChecks,
  ClipboardList
} from 'lucide-react'
import type {
  AssignmentWithSubmissions,
  ClassroomAssignmentResponse,
  ClassroomSubmissionResponse
} from '@/types/classroom'

type ApiResponse<T> = {
  success?: boolean
  data?: T
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

function StudentDashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState<AssignmentWithSubmissions[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('assignments')
  
  // Roadmap State
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([])
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, RoadmapProgressState>>({})
  const [roadmapStudentId, setRoadmapStudentId] = useState<string>('')
  const [roadmapStudentName, setRoadmapStudentName] = useState<string>('')

  const createEmptyProgress = (stages: RoadmapStage[]): Record<string, RoadmapProgressState> => {
    const progress: Record<string, RoadmapProgressState> = {};
    
    // Safety check: pastikan stages adalah array
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

  const fetchRoadmapStages = async () => {
    try {
      const response = await fetch('/api/roadmap/stages');
      if (response.ok) {
        const result = await response.json();
        
        // API mengembalikan { success: true, data: [] }
        const stagesArray = result.success && Array.isArray(result.data) ? result.data : [];
        console.log('Fetched roadmap stages:', stagesArray);
        
        setRoadmapStages(stagesArray);
        setRoadmapProgress(createEmptyProgress(stagesArray));
      } else {
        console.error('Failed to fetch roadmap stages:', response.status);
        setRoadmapStages([]); // Set empty array sebagai fallback
      }
    } catch (error) {
      console.error('Error fetching roadmap stages:', error);
      setRoadmapStages([]); // Set empty array sebagai fallback
    }
  };

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/classroom/assignments')
      const result: ApiResponse<ClassroomAssignmentResponse[]> | null =
        response.ok ? await response.json() : null
      const assignmentsPayload: ClassroomAssignmentResponse[] =
        result?.success && Array.isArray(result.data) ? result.data : []

      let studentSubmissions: ClassroomSubmissionResponse[] = []
      if (session?.user?.id) {
        try {
          const submissionsResponse = await fetch(
            `/api/classroom/submissions?studentId=${encodeURIComponent(session.user.id)}`
          )

          if (submissionsResponse.ok) {
            const submissionsResult: ApiResponse<
              ClassroomSubmissionResponse[]
            > = await submissionsResponse.json()

            if (
              submissionsResult?.success &&
              Array.isArray(submissionsResult.data)
            ) {
              studentSubmissions = submissionsResult.data.map(
                (submission: ClassroomSubmissionResponse) => ({
                  id: submission.id,
                  assignmentId: submission.assignmentId,
                  fileName: submission.fileName,
                  filePath: submission.filePath ?? submission.fileUrl,
                  submittedAt: submission.submittedAt,
                  studentId: submission.studentId,
                  studentName: submission.studentName,
                  status: submission.status,
                  isLate: submission.isLate,
                  grade: submission.grade ?? undefined,
                  feedback: submission.feedback ?? undefined
                })
              )
            }
          }
        } catch (error) {
          console.error('Error fetching student submissions:', error)
        }
      }

      const normalizedAssignments: AssignmentWithSubmissions[] = assignmentsPayload.map(
        (assignment: ClassroomAssignmentResponse) => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          subject: assignment.subject,
          dueDate: assignment.dueDate,
          status: assignment.status,
          maxSubmissions: assignment.maxSubmissions,
          submissionCount: assignment.submissionCount,
          instructions: assignment.instructions ?? [],
          submissions: studentSubmissions.filter(
            submission => submission.assignmentId === assignment.id
          )
        })
      )

      setAssignments(normalizedAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.userType !== 'student') {
      router.push('/student/login')
      return
    }

    fetchAssignments()
    fetchRoadmapStages()
    
    // Set student info from session
    if (session?.user) {
      setRoadmapStudentId(session.user.id)
      setRoadmapStudentName(session.user.name || '')
    }
  }, [session, status, router, fetchAssignments])

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

  const getAssignmentStatus = (assignment: AssignmentWithSubmissions) => {
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()
    const submitted = assignment.submissions.some(s => s.studentId === session?.user.id)
    
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

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
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

  // Progress Bar Component - menggunakan predefined classes
  const ProgressBar: React.FC<{ percentage: number; colorClass: string }> = ({ percentage, colorClass }) => {
    const bgColorClass = colorClass === 'text-blue-600' ? 'bg-blue-500' : 
                        colorClass === 'text-green-600' ? 'bg-green-500' :
                        colorClass === 'text-purple-600' ? 'bg-purple-500' :
                        colorClass === 'text-orange-600' ? 'bg-orange-500' :
                        colorClass === 'text-red-600' ? 'bg-red-500' :
                        'bg-indigo-500';
    
    // Menggunakan predefined width classes untuk menghindari inline styles
    const getWidthClass = (percentage: number) => {
      if (percentage >= 100) return 'w-full';
      if (percentage >= 90) return 'w-11/12';
      if (percentage >= 80) return 'w-4/5';
      if (percentage >= 75) return 'w-3/4';
      if (percentage >= 70) return 'w-7/12';
      if (percentage >= 60) return 'w-3/5';
      if (percentage >= 50) return 'w-1/2';
      if (percentage >= 40) return 'w-2/5';
      if (percentage >= 33) return 'w-1/3';
      if (percentage >= 25) return 'w-1/4';
      if (percentage >= 20) return 'w-1/5';
      if (percentage >= 10) return 'w-1/12';
      if (percentage > 0) return 'w-1';
      return 'w-0';
    };
    
    return (
      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2 relative overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${bgColorClass} ${getWidthClass(percentage)}`} />
      </div>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.userType !== 'student') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
                <p className="text-sm text-gray-600">GEMA - SMA Wahidiyah Kediri</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-600">
                  {session.user.studentId} • {session.user.class}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selamat Datang, {session.user.name}! 🎉</h2>
              <p className="text-blue-100 text-lg">
                Kelas {session.user.class} • NIS {session.user.studentId}
              </p>
              <p className="text-blue-100 mt-2">
                Siap untuk belajar dan mengerjakan tugas hari ini?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tugas</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.submissions.some(s => s.studentId === session.user.id)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => !a.submissions.some(s => s.studentId === session.user.id)).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Tugas & Assignments
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'roadmap'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Roadmap Pembelajaran
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'assignments' && (
              <>
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Tugas</h3>
                    <p className="text-gray-600">Tugas akan muncul di sini ketika guru memberikan assignment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const statusInfo = getAssignmentStatus(assignment)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <div
                          key={assignment.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                  {assignment.title}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusInfo.status === 'submitted' ? 'Sudah Dikumpulkan' : 
                                   statusInfo.status === 'overdue' ? 'Terlambat' : 'Belum Dikumpulkan'}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{assignment.description}</p>
                              
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  {assignment.subject}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Deadline: {formatDate(assignment.dueDate)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="ml-6">
                              {statusInfo.status === 'submitted' ? (
                                <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Sudah Dikumpulkan
                                </span>
                              ) : (
                                <button
                                  onClick={() => router.push(`/student/assignments/${assignment.id}`)}
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Tugas
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'roadmap' && (
              <>
                {roadmapStages.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Roadmap...</h3>
                    <p className="text-gray-600">Mempersiapkan roadmap pembelajaran untukmu.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Student Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Roadmap Pembelajaran</h3>
                          <p className="text-gray-600">Progres belajar: {roadmapStudentName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        {Array.isArray(roadmapStages) && roadmapStages.map((stage) => {
                          const stats = getStageStats(stage.id);
                          return (
                            <div key={stage.id} className="bg-white rounded-lg p-4">
                              <div className={`text-2xl font-bold ${stage.color || 'text-blue-600'}`}>{stats.percentage}%</div>
                              <div className="text-sm text-gray-600 font-medium">{stage.title}</div>
                              <div className="text-xs text-gray-500">{stats.completed}/{stats.total} selesai</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Roadmap Stages */}
                    <div className="space-y-6">
                      {Array.isArray(roadmapStages) && roadmapStages.map((stage, stageIndex) => {
                        const stats = getStageStats(stage.id);
                        const progress = roadmapProgress[stage.id];
                        
                        return (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stageIndex * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                          >
                            {/* Stage Header */}
                            <div className={`p-6 bg-gradient-to-r ${(stage.color || 'text-blue-600') === 'text-blue-600' ? 'from-blue-50 to-blue-100' : 
                                                                    (stage.color || 'text-blue-600') === 'text-green-600' ? 'from-green-50 to-green-100' :
                                                                    (stage.color || 'text-blue-600') === 'text-purple-600' ? 'from-purple-50 to-purple-100' :
                                                                    (stage.color || 'text-blue-600') === 'text-orange-600' ? 'from-orange-50 to-orange-100' :
                                                                    (stage.color || 'text-blue-600') === 'text-red-600' ? 'from-red-50 to-red-100' :
                                                                    'from-blue-50 to-blue-100'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`p-3 rounded-lg mr-4 ${(stage.color || 'text-blue-600') === 'text-blue-600' ? 'bg-blue-100' : 
                                                                         (stage.color || 'text-blue-600') === 'text-green-600' ? 'bg-green-100' :
                                                                         (stage.color || 'text-blue-600') === 'text-purple-600' ? 'bg-purple-100' :
                                                                         (stage.color || 'text-blue-600') === 'text-orange-600' ? 'bg-orange-100' :
                                                                         (stage.color || 'text-blue-600') === 'text-red-600' ? 'bg-red-100' :
                                                                         'bg-blue-100'}`}>
                                    {/* Default ke Target jika icon tidak ada */}
                                    {stage.icon === 'Target' && <Target className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {stage.icon === 'BookOpen' && <BookOpen className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {stage.icon === 'FileText' && <FileText className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {stage.icon === 'CheckCircle' && <CheckCircle className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {stage.icon === 'Sparkles' && <Sparkles className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {stage.icon === 'GraduationCap' && <GraduationCap className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                    {!stage.icon && <Target className={`w-6 h-6 ${stage.color || 'text-blue-600'}`} />}
                                  </div>
                                  <div>
                                    <h3 className={`text-xl font-bold ${stage.color || 'text-blue-600'}`}>{stage.title}</h3>
                                    <p className="text-gray-600 mt-1">{stage.goal || stage.description}</p>
                                    {stage.estimatedDuration && (
                                      <p className="text-sm text-gray-500 mt-1">Estimasi: {stage.estimatedDuration}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${stage.color || 'text-blue-600'}`}>{stats.percentage}%</div>
                                  <div className="text-sm text-gray-600">{stats.completed}/{stats.total} selesai</div>
                                  <ProgressBar percentage={stats.percentage} colorClass={stage.color || 'text-blue-600'} />
                                </div>
                              </div>
                            </div>

                            {/* Activity Groups */}
                            <div className="p-6 space-y-6">
                              {stage.activityGroups?.map((group) => (
                                <div key={group.id} className="border border-gray-100 rounded-lg p-4">
                                  <div className="flex items-center mb-4">
                                    {group.icon === 'ListChecks' && <ListChecks className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    {group.icon === 'BookOpen' && <BookOpen className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    {group.icon === 'FileText' && <FileText className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    {group.icon === 'ClipboardList' && <ClipboardList className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    {group.icon === 'Target' && <Target className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    {!group.icon && <ListChecks className={`w-5 h-5 ${stage.color || 'text-blue-600'} mr-3`} />}
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{group.title}</h4>
                                      {group.description && <p className="text-sm text-gray-600">{group.description}</p>}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    {group.items.map((item) => (
                                      <label key={item.id} className="flex items-start space-x-3 cursor-pointer group">
                                        <input
                                          type="checkbox"
                                          checked={progress?.groups?.[group.id]?.[item.id] || false}
                                          onChange={(e) => handleItemCheck(stage.id, group.id, item.id, e.target.checked)}
                                          className={`w-4 h-4 mt-0.5 rounded border-gray-300 ${stage.color === 'text-blue-600' ? 'text-blue-600 focus:ring-blue-500' : 
                                                                                                  stage.color === 'text-green-600' ? 'text-green-600 focus:ring-green-500' :
                                                                                                  stage.color === 'text-purple-600' ? 'text-purple-600 focus:ring-purple-500' :
                                                                                                  stage.color === 'text-orange-600' ? 'text-orange-600 focus:ring-orange-500' :
                                                                                                  stage.color === 'text-red-600' ? 'text-red-600 focus:ring-red-500' :
                                                                                                  'text-indigo-600 focus:ring-indigo-500'}`}
                                        />
                                        <div className="flex-1">
                                          <span className={`text-sm ${progress?.groups?.[group.id]?.[item.id] ? 'line-through text-gray-500' : 'text-gray-900'} group-hover:text-gray-700`}>
                                            {item.label || item.text}
                                          </span>
                                          {item.helpText && (
                                            <p className="text-xs text-gray-500 mt-1">{item.helpText}</p>
                                          )}
                                        </div>
                                      </label>
                                    ))}
                                  </div>

                                  {/* Materials */}
                                  {group.materials && group.materials.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                      <h5 className="text-sm font-medium text-gray-900 mb-2">📚 Materi Pembelajaran:</h5>
                                      <div className="space-y-1">
                                        {group.materials.map((material) => (
                                          <a
                                            key={material.id}
                                            href={material.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center text-sm ${stage.color} hover:underline mr-4`}
                                          >
                                            {material.type === 'video' && '🎥'}
                                            {material.type === 'article' && '📄'}
                                            {material.type === 'tutorial' && '🎯'}
                                            {material.type === 'documentation' && '📖'}
                                            <span className="ml-1">{material.title}</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Reflection */}
                              <div className="border border-gray-100 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <FileText className={`w-4 h-4 ${stage.color || 'text-blue-600'} mr-2`} />
                                  Refleksi & Catatan
                                </h4>
                                <textarea
                                  value={progress?.reflection || ''}
                                  onChange={(e) => handleReflectionChange(stage.id, e.target.value)}
                                  placeholder="Tuliskan refleksi, catatan, atau hal yang dipelajari dari tahap ini..."
                                  className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(StudentDashboardContent), {
  ssr: false
})