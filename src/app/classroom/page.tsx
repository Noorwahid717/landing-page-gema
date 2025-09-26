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

interface RoadmapChecklistItem {
  id: string;
  label: string;
}

interface RoadmapMaterial {
  id: string;
  title: string;
  items: string[];
}

interface RoadmapActivityGroup {
  id: string;
  title: string;
  description?: string;
  items: RoadmapChecklistItem[];
}

interface RoadmapStage {
  id: string;
  title: string;
  goal: string;
  skills: string[];
  overview: string[];
  materials?: RoadmapMaterial[];
  activityGroups?: RoadmapActivityGroup[];
}

interface RoadmapProgressState {
  groups: Record<string, Record<string, boolean>>;
  reflection: string;
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    title: "🔰 Tahap 1: Dasar-dasar Web",
    goal: "Mengenal bagaimana web bekerja.",
    skills: ["HTML dasar", "CSS dasar", "JavaScript dasar"],
    overview: [
      "Apa itu web, browser, dan server",
      "Struktur file dan folder proyek",
      "Pengenalan HTML, CSS, dan JavaScript"
    ],
    materials: [
      {
        id: "stage-1-material-html",
        title: "HTML",
        items: [
          "Elemen dasar (doctype, html, head, body)",
          "Heading, paragraf, dan teks",
          "Link, gambar, dan list",
          "Tabel dan form sederhana"
        ]
      },
      {
        id: "stage-1-material-css",
        title: "CSS",
        items: [
          "Selector dan properti dasar",
          "Warna, font, dan tipografi",
          "Box model dan spacing",
          "Layout menggunakan Flexbox dan Grid dasar"
        ]
      },
      {
        id: "stage-1-material-js",
        title: "JavaScript",
        items: [
          "Variabel dan tipe data",
          "Operator dan kondisi",
          "Loop dan fungsi sederhana"
        ]
      }
    ],
    activityGroups: [
      {
        id: "stage-1-exercises",
        title: "Latihan kecil",
        items: [
          { id: "stage-1-task-1", label: "Buat halaman biodata sederhana menggunakan HTML dan CSS." },
          { id: "stage-1-task-2", label: "Tambahkan tombol yang mengubah warna background dengan JavaScript." }
        ]
      }
    ]
  },
  {
    id: "stage-2",
    title: "📄 Tahap 2: HTML Lanjutan",
    goal: "Membangun struktur halaman yang rapi dan mudah dipahami.",
    skills: ["Semantic HTML", "Form handling", "Aksesibilitas"],
    overview: [
      "Gunakan elemen semantik seperti header, nav, main, article, dan footer",
      "Bangun form dengan berbagai jenis input",
      "Pastikan aksesibilitas dasar seperti alt text dan label form"
    ],
    materials: [
      {
        id: "stage-2-material-semantic",
        title: "Semantic HTML",
        items: [
          "Header, nav, main, aside, section, article",
          "Mengelompokkan konten agar mudah dibaca",
          "Struktur halaman yang konsisten"
        ]
      },
      {
        id: "stage-2-material-form",
        title: "Form",
        items: [
          "Input text, email, number, password",
          "Textarea, radio, checkbox, select",
          "Button dan atribut form"
        ]
      },
      {
        id: "stage-2-material-accessibility",
        title: "Aksesibilitas",
        items: [
          "Penggunaan label untuk setiap input",
          "Alt text pada gambar",
          "Struktur heading yang teratur"
        ]
      }
    ],
    activityGroups: [
      {
        id: "stage-2-exercises",
        title: "Latihan kecil",
        items: [
          { id: "stage-2-task-1", label: "Susun kerangka halaman dengan elemen semantik." },
          { id: "stage-2-task-2", label: "Buat form pendaftaran online sederhana lengkap dengan label." },
          { id: "stage-2-task-3", label: "Tambahkan validasi dasar dan pesan bantuan untuk pengguna." }
        ]
      }
    ]
  },
  {
    id: "stage-3",
    title: "🎨 Tahap 3: CSS Lanjutan",
    goal: "Membuat tampilan web yang menarik dan responsif.",
    skills: ["Flexbox", "Grid", "Responsive design"],
    overview: [
      "Mengatur layout dengan Flexbox dan Grid",
      "Membuat tampilan responsif menggunakan media query",
      "Menambahkan animasi dan transisi untuk interaksi",
      "Menggunakan CSS Variables untuk konsistensi gaya"
    ],
    materials: [
      {
        id: "stage-3-material-layout",
        title: "Layout",
        items: [
          "Flexbox untuk alignment dan distribusi ruang",
          "CSS Grid untuk tata letak kompleks",
          "Menggabungkan Flexbox dan Grid"
        ]
      },
      {
        id: "stage-3-material-responsive",
        title: "Responsive Design",
        items: [
          "Menggunakan media query",
          "Mobile-first vs desktop-first",
          "Pengaturan font dan spacing adaptif"
        ]
      },
      {
        id: "stage-3-material-animation",
        title: "Animasi & Transisi",
        items: [
          "Transition untuk hover dan fokus",
          "Keyframes untuk animasi kustom",
          "Mengatur durasi dan easing"
        ]
      }
    ],
    activityGroups: [
      {
        id: "stage-3-exercises",
        title: "Latihan kecil",
        items: [
          { id: "stage-3-task-1", label: "Buat layout blog dengan header, sidebar, dan konten utama." },
          { id: "stage-3-task-2", label: "Pastikan layout tetap rapi di layar mobile dan desktop." },
          { id: "stage-3-task-3", label: "Tambahkan animasi hover pada tombol dan link penting." }
        ]
      }
    ]
  },
  {
    id: "stage-4",
    title: "⚙️ Tahap 4: JavaScript Lanjutan",
    goal: "Membuat web lebih interaktif dan menyimpan data sederhana.",
    skills: ["DOM manipulation", "Event handling", "LocalStorage"],
    overview: [
      "Mengambil dan memanipulasi elemen dengan querySelector",
      "Menangani event seperti click, input, dan submit",
      "Mengelola array dan object dasar",
      "Menyimpan data di browser menggunakan LocalStorage"
    ],
    materials: [
      {
        id: "stage-4-material-dom",
        title: "DOM & Event",
        items: [
          "Menambahkan dan menghapus class",
          "Mengubah isi elemen (innerHTML/textContent)",
          "Membuat event handler reusable"
        ]
      },
      {
        id: "stage-4-material-data",
        title: "Data",
        items: [
          "Array method dasar (push, map, filter)",
          "Object untuk menyimpan pasangan key-value",
          "Konversi data dengan JSON"
        ]
      }
    ],
    activityGroups: [
      {
        id: "stage-4-exercises",
        title: "Latihan kecil",
        items: [
          { id: "stage-4-task-1", label: "Bangun kalkulator sederhana dengan operasi tambah, kurang, kali, dan bagi." },
          { id: "stage-4-task-2", label: "Simpan nama pengguna di LocalStorage dan tampilkan saat halaman dibuka." }
        ]
      }
    ]
  },
  {
    id: "stage-5",
    title: "🚀 Tahap 5: Mini Proyek",
    goal: "Menguatkan konsep dengan proyek web sederhana namun nyata.",
    skills: ["Perencanaan proyek", "Kolaborasi", "Integrasi HTML/CSS/JS"],
    overview: [
      "Pilih satu atau beberapa proyek mini untuk kelompok",
      "Bagi tugas berdasarkan peran tim",
      "Review hasil setiap sprint kecil dan catat perbaikan"
    ],
    activityGroups: [
      {
        id: "stage-5-game",
        title: "Game Pasangkan Emoji 🎮",
        description: "Latih logika dan manipulasi DOM.",
        items: [
          { id: "stage-5-game-1", label: "Susun grid kartu emoji menggunakan HTML." },
          { id: "stage-5-game-2", label: "Styling kartu dan animasi flip dengan CSS." },
          { id: "stage-5-game-3", label: "Buat logika pencocokan kartu dengan JavaScript." }
        ]
      },
      {
        id: "stage-5-chatbot",
        title: "Chatbot Sederhana 🤖",
        description: "Buat percakapan otomatis dengan aturan sederhana.",
        items: [
          { id: "stage-5-chatbot-1", label: "Desain area percakapan dengan HTML." },
          { id: "stage-5-chatbot-2", label: "Gaya bubble chat agar nyaman dibaca." },
          { id: "stage-5-chatbot-3", label: "Tulis logika if/else untuk membalas pesan pengguna." }
        ]
      },
      {
        id: "stage-5-blog",
        title: "Blog Pribadi & Gallery Foto 📸✍️",
        description: "Gabungkan konten artikel dan visual.",
        items: [
          { id: "stage-5-blog-1", label: "Susun daftar artikel dan halaman detail untuk blog." },
          { id: "stage-5-blog-2", label: "Gunakan layout CSS agar navigasi nyaman." },
          { id: "stage-5-blog-3", label: "Tambahkan navigasi antar halaman dengan JavaScript." },
          { id: "stage-5-blog-4", label: "Buat gallery foto grid dan efek lightbox." }
        ]
      },
      {
        id: "stage-5-portfolio",
        title: "Portofolio Profesional 💼",
        description: "Tampilkan profil dan karya terbaik tim.",
        items: [
          { id: "stage-5-portfolio-1", label: "Buat halaman profil, skill, proyek, dan kontak." },
          { id: "stage-5-portfolio-2", label: "Pastikan tampilan responsif di HP dan laptop." },
          { id: "stage-5-portfolio-3", label: "Deploy gratis ke GitHub Pages atau Netlify." }
        ]
      }
    ]
  },
  {
    id: "stage-6",
    title: "🌱 Tahap 6: Skill Tambahan (Opsional)",
    goal: "Mengeksplor teknologi penunjang untuk siswa yang cepat tangkap.",
    skills: ["Version control", "CSS framework", "React dasar"],
    overview: [
      "Kenali manfaat Git & GitHub untuk kolaborasi",
      "Eksperimen dengan framework CSS seperti Tailwind atau Bootstrap",
      "Pelajari konsep dasar React untuk komponen dan state"
    ],
    activityGroups: [
      {
        id: "stage-6-explore",
        title: "Eksplor Skill Tambahan",
        items: [
          { id: "stage-6-task-1", label: "Gunakan Git untuk mencatat perubahan proyek dan unggah ke GitHub." },
          { id: "stage-6-task-2", label: "Coba membangun halaman dengan Tailwind atau Bootstrap." },
          { id: "stage-6-task-3", label: "Pelajari dasar React: komponen, props, dan state sederhana." }
        ]
      }
    ]
  }
];

const createEmptyProgress = (): Record<string, RoadmapProgressState> => {
  const progress: Record<string, RoadmapProgressState> = {};
  ROADMAP_STAGES.forEach((stage) => {
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

const STORAGE_PREFIX = "gema-classroom-roadmap-v2";

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
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, RoadmapProgressState>>(createEmptyProgress());

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
      setRoadmapProgress(createEmptyProgress());
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}-${roadmapStudentId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          studentName?: string;
          progress?: Record<string, RoadmapProgressState>;
        };
        const base = createEmptyProgress();
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
        setRoadmapStudentName(parsed.studentName ?? "");
      } else {
        setRoadmapProgress(createEmptyProgress());
      }
    } catch (error) {
      console.error('Failed to load roadmap progress', error);
      setRoadmapProgress(createEmptyProgress());
    }
  }, [roadmapStudentId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!roadmapStudentId) return;

    const payload = {
      studentId: roadmapStudentId,
      studentName: roadmapStudentName,
      progress: roadmapProgress,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}-${roadmapStudentId}`, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to store roadmap progress', error);
    }
  }, [roadmapProgress, roadmapStudentId, roadmapStudentName]);

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

  const toggleChecklistItem = (stageId: string, groupId: string, itemId: string) => {
    setRoadmapProgress((prev) => {
      const stage = prev[stageId];
      if (!stage) return prev;

      const group = stage.groups[groupId];
      if (!group) return prev;

      const updatedGroup = {
        ...group,
        [itemId]: !group[itemId]
      };

      return {
        ...prev,
        [stageId]: {
          ...stage,
          groups: {
            ...stage.groups,
            [groupId]: updatedGroup
          }
        }
      };
    });
  };

  const handleReflectionChange = (stageId: string, reflection: string) => {
    setRoadmapProgress((prev) => {
      const stage = prev[stageId];
      if (!stage) return prev;
      return {
        ...prev,
        [stageId]: {
          ...stage,
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
    setRoadmapProgress(emptyProgress);
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
                Roadmap Web Development SMA
              </h2>
              <p className="text-gray-600">
                Ikuti tahapan belajar dari dasar hingga mini proyek. Checklist dan refleksi tersimpan otomatis di perangkat
                ini berdasarkan ID siswa.
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
              {ROADMAP_STAGES.map((stage, index) => {
                const progress = roadmapProgress[stage.id];
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                  >
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{stage.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          {stage.goal}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill) => (
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
                      <div className="lg:col-span-1 space-y-5">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <ListChecks className="w-4 h-4 text-green-500" />
                            Fokus Pembelajaran
                          </h4>
                          <ul className="space-y-2">
                            {stage.overview.map((point) => (
                              <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {stage.materials?.map((material) => (
                          <div key={material.id} className="pt-4 border-t border-gray-100">
                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              {material.title}
                            </h5>
                            <ul className="space-y-2">
                              {material.items.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-300" aria-hidden="true"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="lg:col-span-2 space-y-6">
                        {stage.activityGroups?.map((group) => {
                          const groupProgress = progress?.groups[group.id] ?? {};
                          const completedCount = Object.values(groupProgress).filter(Boolean).length;
                          return (
                            <div
                              key={group.id}
                              className="border border-blue-100 rounded-lg p-4 bg-blue-50/60"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    {group.title}
                                  </h4>
                                  {group.description && (
                                    <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-blue-700 bg-white/70 px-2 py-1 rounded-full">
                                  {completedCount}/{group.items.length} selesai
                                </span>
                              </div>
                              <ul className="mt-3 space-y-2">
                                {group.items.map((item) => (
                                  <li key={item.id} className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      className="mt-1.5 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                      checked={!!groupProgress[item.id]}
                                      onChange={() => toggleChecklistItem(stage.id, group.id, item.id)}
                                      disabled={!roadmapStudentId}
                                    />
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}

                        <div className="border border-orange-100 rounded-lg p-4 bg-orange-50/50">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Catatan & Refleksi
                          </h4>
                          <textarea
                            value={progress?.reflection ?? ""}
                            onChange={(e) => handleReflectionChange(stage.id, e.target.value)}
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
