"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Upload,
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Folder,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpenCheck,
  Newspaper,
  Tag,
  Eye,
  Search,
  ListChecks,
  ClipboardList,
  Target,
  Rocket,
  Sparkles,
  RefreshCw
} from "lucide-react";
import type { ClassroomAssignmentResponse } from "@/types/classroom";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string | string[]; // Can be JSON string from DB or parsed array
  author: string;
  featured: boolean;
  imageUrl?: string;
  readTime: number;
  views: number;
  publishedAt: string;
}

interface ProjectChecklistItem {
  id: string;
  label: string;
}

interface ProjectRoadmap {
  id: string;
  title: string;
  goal: string;
  skills: string[];
  basicTargets: ProjectChecklistItem[];
  advancedTargets: ProjectChecklistItem[];
}

interface ProjectProgressState {
  basic: Record<string, boolean>;
  advanced: Record<string, boolean>;
  reflection: string;
}

const PROJECT_ROADMAPS: ProjectRoadmap[] = [
  {
    id: "project-1",
    title: "🌟 Proyek 1: Kartu Ucapan Interaktif",
    goal: "Memperkuat struktur HTML dan CSS dasar.",
    skills: ["Layout sederhana", "Styling teks", "Manipulasi DOM dasar"],
    basicTargets: [
      { id: "project-1-basic-1", label: "Buat struktur HTML dengan header, konten, dan footer." },
      { id: "project-1-basic-2", label: "Terapkan CSS untuk warna, font, dan penataan layout responsif sederhana." },
      { id: "project-1-basic-3", label: "Tambahkan tombol yang mengubah pesan menggunakan JavaScript." }
    ],
    advancedTargets: [
      { id: "project-1-advanced-1", label: "Tambahkan pilihan tema dengan dropdown." },
      { id: "project-1-advanced-2", label: "Gunakan animasi CSS untuk efek menarik." },
      { id: "project-1-advanced-3", label: "Tambahkan opsi download kartu sebagai gambar." }
    ]
  },
  {
    id: "project-2",
    title: "🎨 Proyek 2: Galeri Foto Responsif",
    goal: "Latihan grid dan responsivitas.",
    skills: ["CSS Grid/Flexbox", "Media queries", "Manipulasi data array"],
    basicTargets: [
      { id: "project-2-basic-1", label: "Siapkan struktur galeri dengan gambar contoh." },
      { id: "project-2-basic-2", label: "Gunakan CSS Grid/Flexbox untuk tata letak responsif." },
      { id: "project-2-basic-3", label: "Buat filter sederhana berdasarkan kategori dengan JavaScript." }
    ],
    advancedTargets: [
      { id: "project-2-advanced-1", label: "Tambahkan lightbox modal untuk menampilkan gambar besar." },
      { id: "project-2-advanced-2", label: "Buat pencarian dinamis berdasarkan judul foto." },
      { id: "project-2-advanced-3", label: "Muat data gambar dari file JSON lokal." }
    ]
  },
  {
    id: "project-3",
    title: "🕹️ Proyek 3: Game Tebak Angka",
    goal: "Melatih logika percabangan dan event handler.",
    skills: ["Percabangan", "Loop", "Manipulasi DOM"],
    basicTargets: [
      { id: "project-3-basic-1", label: "Buat antarmuka sederhana dengan input, tombol, dan area pesan." },
      { id: "project-3-basic-2", label: "Implementasikan logika tebak angka dengan batas percobaan." },
      { id: "project-3-basic-3", label: "Tampilkan pesan tinggi/rendah dan jumlah percobaan." }
    ],
    advancedTargets: [
      { id: "project-3-advanced-1", label: "Tambahkan mode sulit dengan rentang angka lebih besar." },
      { id: "project-3-advanced-2", label: "Simpan skor terbaik menggunakan LocalStorage." },
      { id: "project-3-advanced-3", label: "Tambahkan animasi atau efek suara saat menang/kalah." }
    ]
  },
  {
    id: "project-4",
    title: "🛒 Proyek 4: Daftar Belanja Interaktif",
    goal: "Mengelola data dan interaksi form.",
    skills: ["CRUD sederhana", "Array", "Manipulasi DOM"],
    basicTargets: [
      { id: "project-4-basic-1", label: "Buat form input untuk menambah item belanja." },
      { id: "project-4-basic-2", label: "Tampilkan daftar item dengan checkbox sudah dibeli." },
      { id: "project-4-basic-3", label: "Implementasikan tombol hapus item." }
    ],
    advancedTargets: [
      { id: "project-4-advanced-1", label: "Kelompokkan item berdasarkan kategori." },
      { id: "project-4-advanced-2", label: "Simpan daftar ke LocalStorage agar tidak hilang." },
      { id: "project-4-advanced-3", label: "Tambahkan fitur drag-and-drop untuk mengurutkan item." }
    ]
  },
  {
    id: "project-5",
    title: "🗓️ Proyek 5: Planner Jadwal Harian",
    goal: "Mengatur data waktu dan tampilan tabel.",
    skills: ["Tabel", "Form", "Penyimpanan lokal"],
    basicTargets: [
      { id: "project-5-basic-1", label: "Buat tabel jadwal dengan slot waktu harian." },
      { id: "project-5-basic-2", label: "Buat form input untuk menambahkan kegiatan ke slot tertentu." },
      { id: "project-5-basic-3", label: "Tandai kegiatan selesai dengan checkbox." }
    ],
    advancedTargets: [
      { id: "project-5-advanced-1", label: "Tambahkan mode mingguan dengan navigasi hari." },
      { id: "project-5-advanced-2", label: "Buat notifikasi sederhana sebelum kegiatan dimulai." },
      { id: "project-5-advanced-3", label: "Gunakan LocalStorage untuk menyimpan jadwal." }
    ]
  },
  {
    id: "project-6",
    title: "🎵 Proyek 6: Playlist Musik Favorit",
    goal: "Mengelola data objek dan tampilan kartu.",
    skills: ["Array objek", "Render dinamis", "Event handling"],
    basicTargets: [
      { id: "project-6-basic-1", label: "Buat daftar lagu dalam array berisi judul, penyanyi, dan tautan." },
      { id: "project-6-basic-2", label: "Tampilkan setiap lagu dalam card dengan tombol play." },
      { id: "project-6-basic-3", label: "Tambahkan filter berdasarkan genre atau mood." }
    ],
    advancedTargets: [
      { id: "project-6-advanced-1", label: "Implementasikan fitur favorit dan tampilkan jumlahnya." },
      { id: "project-6-advanced-2", label: "Tambahkan pencarian real-time." },
      { id: "project-6-advanced-3", label: "Buat tampilan statistik sederhana dengan chart ringan." }
    ]
  },
  {
    id: "project-7",
    title: "💡 Proyek 7: Website Tips Belajar Interaktif",
    goal: "Menyusun konten dinamis dan UX sederhana.",
    skills: ["Accordion/Modal", "Fetch data", "Responsivitas"],
    basicTargets: [
      { id: "project-7-basic-1", label: "Buat halaman dengan daftar tips menggunakan accordion." },
      { id: "project-7-basic-2", label: "Tambahkan tombol untuk menampilkan detail dalam modal." },
      { id: "project-7-basic-3", label: "Desain halaman agar nyaman di desktop dan mobile." }
    ],
    advancedTargets: [
      { id: "project-7-advanced-1", label: "Muat data tips dari file JSON menggunakan fetch." },
      { id: "project-7-advanced-2", label: "Tambahkan kuis mini pilihan ganda." },
      { id: "project-7-advanced-3", label: "Implementasikan dark mode toggle dengan CSS." }
    ]
  },
  {
    id: "project-8",
    title: "🍽️ Proyek 8: Aplikasi Resep Masak",
    goal: "Menggabungkan data kompleks dan pencarian.",
    skills: ["Fetch API", "Manipulasi DOM lanjutan", "Pagination"],
    basicTargets: [
      { id: "project-8-basic-1", label: "Buat layout dengan daftar resep dan detail." },
      { id: "project-8-basic-2", label: "Implementasikan pencarian berdasarkan nama resep." },
      { id: "project-8-basic-3", label: "Tampilkan detail resep saat dipilih." }
    ],
    advancedTargets: [
      { id: "project-8-advanced-1", label: "Gunakan API publik seperti TheMealDB untuk data asli." },
      { id: "project-8-advanced-2", label: "Tambahkan filter diet (vegetarian, halal, dll)." },
      { id: "project-8-advanced-3", label: "Simpan resep favorit di LocalStorage dan tampilkan di tab khusus." }
    ]
  },
  {
    id: "project-9",
    title: "📈 Proyek 9: Dashboard Statistik Sekolah",
    goal: "Menyajikan data angka secara visual.",
    skills: ["Chart library", "Layout dashboard", "Fetch data"],
    basicTargets: [
      { id: "project-9-basic-1", label: "Rancang layout dashboard dengan card statistik dan grafik." },
      { id: "project-9-basic-2", label: "Tampilkan grafik sederhana menggunakan data statis." },
      { id: "project-9-basic-3", label: "Buat tabel data dengan sorting atau pagination dasar." }
    ],
    advancedTargets: [
      { id: "project-9-advanced-1", label: "Ambil data dari file JSON atau Google Sheets." },
      { id: "project-9-advanced-2", label: "Tambahkan filter waktu (mingguan/bulanan)." },
      { id: "project-9-advanced-3", label: "Implementasikan mode fullscreen untuk grafik." }
    ]
  },
  {
    id: "project-10",
    title: "🤝 Proyek 10: Platform Microvolunteering Sekolah",
    goal: "Membangun aplikasi web kompleks dengan banyak fitur.",
    skills: ["Manajemen state", "Autentikasi sederhana", "Integrasi API"],
    basicTargets: [
      { id: "project-10-basic-1", label: "Buat halaman daftar kegiatan dengan informasi tugas dan tanggal." },
      { id: "project-10-basic-2", label: "Implementasikan form pendaftaran volunteer dengan validasi." },
      { id: "project-10-basic-3", label: "Tambahkan status tugas dan filter kategori." }
    ],
    advancedTargets: [
      { id: "project-10-advanced-1", label: "Simulasikan login anggota menggunakan penyimpanan lokal." },
      { id: "project-10-advanced-2", label: "Tambahkan fitur chat singkat atau komentar untuk koordinasi." },
      { id: "project-10-advanced-3", label: "Integrasikan peta untuk lokasi kegiatan." }
    ]
  }
];

const createEmptyProgress = (): Record<string, ProjectProgressState> => {
  const progress: Record<string, ProjectProgressState> = {};
  PROJECT_ROADMAPS.forEach((project) => {
    progress[project.id] = {
      basic: project.basicTargets.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {}),
      advanced: project.advancedTargets.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {}),
      reflection: ""
    };
  });
  return progress;
};

const STORAGE_PREFIX = "gema-classroom-roadmap";

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState<'assignments' | 'articles' | 'roadmap'>('assignments');
  const [assignments, setAssignments] = useState<ClassroomAssignmentResponse[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<ClassroomAssignmentResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadmapStudentId, setRoadmapStudentId] = useState("");
  const [roadmapStudentName, setRoadmapStudentName] = useState("");
  const [projectProgress, setProjectProgress] = useState<Record<string, ProjectProgressState>>(createEmptyProgress);

  useEffect(() => {
    fetchAssignments();
    fetchArticles();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/classroom/assignments');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssignments(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/classroom/articles?status=published');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setArticles(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!roadmapStudentId) {
      setProjectProgress(createEmptyProgress());
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}-${roadmapStudentId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          studentName?: string;
          progress?: Record<string, ProjectProgressState>;
        };
        const base = createEmptyProgress();
        if (parsed.progress) {
          Object.entries(parsed.progress).forEach(([projectId, progress]) => {
            if (!base[projectId]) return;
            base[projectId] = {
              basic: {
                ...base[projectId].basic,
                ...progress.basic
              },
              advanced: {
                ...base[projectId].advanced,
                ...progress.advanced
              },
              reflection: progress.reflection ?? ""
            };
          });
        }
        setProjectProgress(base);
        setRoadmapStudentName(parsed.studentName ?? "");
      } else {
        setProjectProgress(createEmptyProgress());
      }
    } catch (error) {
      console.error('Failed to load roadmap progress', error);
      setProjectProgress(createEmptyProgress());
    }
  }, [roadmapStudentId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!roadmapStudentId) return;

    const payload = {
      studentId: roadmapStudentId,
      studentName: roadmapStudentName,
      progress: projectProgress,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}-${roadmapStudentId}`, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to store roadmap progress', error);
    }
  }, [projectProgress, roadmapStudentId, roadmapStudentName]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 10MB");
        return;
      }
      setUploadFile(file);
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !uploadFile || !studentName || !studentId) {
      alert("Semua field harus diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('studentName', studentName);
      formData.append('studentId', studentId);
      formData.append('assignmentId', selectedAssignment.id);
      if (studentEmail) {
        formData.append('studentEmail', studentEmail);
      }

      const response = await fetch('/api/classroom/submissions', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reset form
        setUploadFile(null);
        setStudentName("");
        setStudentId("");
        setStudentEmail("");
        setSelectedAssignment(null);
        
        alert(`Tugas berhasil dikumpulkan! ${result.submission.isLate ? '(Terlambat)' : ''}`);
      } else {
        alert(result.error || "Terjadi kesalahan saat mengupload file!");
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("Terjadi kesalahan saat mengupload file!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tutorial': return 'bg-blue-100 text-blue-800';
      case 'news': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'programming': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <AlertCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const toggleChecklistItem = (
    projectId: string,
    level: 'basic' | 'advanced',
    itemId: string
  ) => {
    setProjectProgress((prev) => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedLevel = {
        ...project[level],
        [itemId]: !project[level][itemId]
      };

      return {
        ...prev,
        [projectId]: {
          ...project,
          [level]: updatedLevel
        }
      };
    });
  };

  const handleReflectionChange = (projectId: string, reflection: string) => {
    setProjectProgress((prev) => {
      const project = prev[projectId];
      if (!project) return prev;
      return {
        ...prev,
        [projectId]: {
          ...project,
          reflection
        }
      };
    });
  };

  const handleResetProgress = () => {
    if (!roadmapStudentId) {
      alert('Masukkan ID siswa terlebih dahulu untuk mereset progress.');
      return;
    }

    const confirmation = window.confirm('Yakin ingin mereset seluruh progress checklist siswa ini?');
    if (!confirmation) return;

    const emptyProgress = createEmptyProgress();
    setProjectProgress(emptyProgress);
    setRoadmapStudentName("");
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PREFIX}-${roadmapStudentId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </Link>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">GEMA Classroom</h1>
                  <p className="text-sm text-gray-600">Platform pembelajaran digital</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpenCheck className="w-4 h-4" />
              Tugas & Pengumpulan
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Artikel & Tutorial
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Roadmap Proyek
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {activeTab === 'assignments' && !selectedAssignment ? (
          /* Assignment List */
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Daftar Tugas</h2>
              <p className="text-gray-600">Pilih tugas yang ingin dikumpulkan</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Folder className="w-8 h-8 text-blue-600" />
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status === 'active' ? 'Aktif' :
                       assignment.status === 'closed' ? 'Ditutup' : 'Akan Datang'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{assignment.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{assignment.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{assignment.submissionCount}/{assignment.maxSubmissions} Submisi</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Kumpulkan Tugas
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : activeTab === 'articles' ? (
          /* Articles List */
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Artikel & Tutorial</h2>
              <p className="text-gray-600">Pelajari teknologi terkini dan tutorial programming</p>
            </motion.div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Articles */}
            {filteredArticles.some(article => article.featured) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Artikel Unggulan
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles
                    .filter(article => article.featured)
                    .map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                      onClick={() => window.open(`/classroom/articles/${article.slug}`, '_blank')}
                    >
                      {article.imageUrl && (
                        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(article => !article.featured)
                .map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => window.open(`/classroom/articles/${article.slug}`, '_blank')}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    {/* Tags */}
                    {(() => {
                      try {
                        const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;
                        if (!Array.isArray(tags) || tags.length === 0) return null;

                        return (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-1">
                              {tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                              {tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{tags.length - 3} lagi</span>
                              )}
                            </div>
                          </div>
                        );
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Tidak ada artikel ditemukan</h3>
                <p className="text-gray-400">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>
        ) : activeTab === 'roadmap' ? (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-blue-600" />
                Roadmap Proyek Web Development
              </h2>
              <p className="text-gray-600">
                Pantau progres setiap proyek ekskul dengan checklist target. Progress tersimpan otomatis di perangkat ini
                berdasarkan ID siswa.
              </p>
            </motion.div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    ID Siswa
                  </label>
                  <input
                    type="text"
                    value={roadmapStudentId}
                    onChange={(e) => setRoadmapStudentId(e.target.value.trim())}
                    placeholder="Masukkan NIS atau ID siswa"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Nama Siswa (opsional)
                  </label>
                  <input
                    type="text"
                    value={roadmapStudentName}
                    onChange={(e) => setRoadmapStudentName(e.target.value)}
                    placeholder="Masukkan nama untuk catatan"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-blue-900/80">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Checklist akan otomatis tersimpan untuk ID siswa yang sama.</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Progress
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {PROJECT_ROADMAPS.map((project, index) => {
                const progress = projectProgress[project.id];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                  >
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          {project.goal}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            <Sparkles className="w-3 h-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 p-6">
                      <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Target Dasar (MVP)
                        </h4>
                        <ul className="space-y-2">
                          {project.basicTargets.map((item) => (
                            <li key={item.id} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={!!progress?.basic[item.id]}
                                onChange={() => toggleChecklistItem(project.id, 'basic', item.id)}
                                disabled={!roadmapStudentId}
                              />
                              <span className="text-sm text-gray-700">{item.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-purple-500" />
                          Target Lanjutan
                        </h4>
                        <ul className="space-y-2">
                          {project.advancedTargets.map((item) => (
                            <li key={item.id} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={!!progress?.advanced[item.id]}
                                onChange={() => toggleChecklistItem(project.id, 'advanced', item.id)}
                                disabled={!roadmapStudentId}
                              />
                              <span className="text-sm text-gray-700">{item.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          Catatan & Refleksi
                        </h4>
                        <textarea
                          value={progress?.reflection ?? ""}
                          onChange={(e) => handleReflectionChange(project.id, e.target.value)}
                          placeholder="Tuliskan pembelajaran, tantangan, atau ide pengembangan berikutnya..."
                          className="w-full h-32 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!roadmapStudentId}
                        />
                        {!roadmapStudentId && (
                          <p className="mt-2 text-xs text-gray-500">
                            Masukkan ID siswa untuk mulai menandai checklist dan menyimpan refleksi.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : selectedAssignment ? (
          /* Submission Form */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Kembali ke daftar tugas"
                  aria-label="Kembali ke daftar tugas"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                  <p className="text-gray-600">{selectedAssignment.subject}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Tugas:</h3>
                <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(selectedAssignment.dueDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{selectedAssignment.submissionCount}/{selectedAssignment.maxSubmissions} Submisi</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmission} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIS/ID Siswa *
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan NIS atau ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email untuk notifikasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File Tugas *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.zip,.rar,.7z,.tar,.gz,.jpg,.jpeg,.png,.gif,.svg,.webp,.html,.htm,.css,.js,.json,.xml,.py,.java,.c,.cpp,.h,.hpp,.php,.md,.txt,.yml,.yaml"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      {uploadFile ? (
                        <div>
                          <p className="text-sm font-medium text-gray-800">{uploadFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Klik untuk upload file atau drag & drop
                          </p>
                          <p className="text-xs text-gray-500">
                            HTML, CSS, JS, PDF, DOC, ZIP, gambar, Python, dan lainnya (Maksimal 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Kumpulkan Tugas
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}