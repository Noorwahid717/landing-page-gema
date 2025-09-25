"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  UsersRound,
  ShieldCheck
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Student {
  id: string
  studentId: string
  fullName: string
  email: string
  class?: string | null
  phone?: string | null
  address?: string | null
  parentName?: string | null
  parentPhone?: string | null
  status: string
  isVerified: boolean
  joinedAt: string
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
}

interface StudentFormData {
  studentId: string
  fullName: string
  email: string
  password: string
  class?: string
  phone?: string
  address?: string
  parentName?: string
  parentPhone?: string
  status: string
  isVerified: boolean
}

const initialFormState: StudentFormData = {
  studentId: '',
  fullName: '',
  email: '',
  password: '',
  class: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  status: 'active',
  isVerified: true
}

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' },
  { value: 'suspended', label: 'Ditangguhkan' }
]

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [classFilter, setClassFilter] = useState<'all' | string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>({ ...initialFormState })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setErrorMessage('Gagal memuat data siswa. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const classOptions = useMemo(() => {
    const uniqueClasses = new Set<string>()
    students.forEach(student => {
      if (student.class) {
        uniqueClasses.add(student.class)
      }
    })
    return Array.from(uniqueClasses).sort()
  }, [students])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target

    if (type === 'checkbox') {
      const target = event.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const method = editingStudent ? 'PATCH' : 'POST'
      const payload: Record<string, unknown> = {
        studentId: formData.studentId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        class: formData.class?.trim() ? formData.class.trim() : null,
        phone: formData.phone?.trim() ? formData.phone.trim() : null,
        address: formData.address?.trim() ? formData.address.trim() : null,
        parentName: formData.parentName?.trim() ? formData.parentName.trim() : null,
        parentPhone: formData.parentPhone?.trim() ? formData.parentPhone.trim() : null,
        status: formData.status,
        isVerified: formData.isVerified
      }

      if (editingStudent) {
        payload.id = editingStudent.id
        if (!formData.password) {
          delete payload.password
        }
      }

      const response = await fetch('/api/admin/students', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal menyimpan data siswa')
      }

      await fetchStudents()
      resetForm()
    } catch (error) {
      console.error('Error saving student:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan data siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      password: '',
      class: student.class || '',
      phone: student.phone || '',
      address: student.address || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      status: student.status,
      isVerified: student.isVerified
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun siswa ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/students?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal menghapus siswa')
      }

      await fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus siswa')
    }
  }

  const resetForm = () => {
    setFormData({ ...initialFormState })
    setEditingStudent(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.phone || '').includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' ? student.isVerified : !student.isVerified)
    const matchesClass = classFilter === 'all' || (student.class || '') === classFilter

    return matchesSearch && matchesStatus && matchesVerification && matchesClass
  })

  const totalStudents = students.length
  const activeStudents = students.filter(student => student.status === 'active').length
  const unverifiedStudents = students.filter(student => !student.isVerified).length

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              Manajemen Siswa
            </h1>
            <p className="text-gray-600">
              Kelola akun siswa yang telah terdaftar di platform GEMA.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingStudent(null)
              setFormData({ ...initialFormState })
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Siswa</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
              </div>
              <UsersRound className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Siswa Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{activeStudents}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Belum Terverifikasi</p>
                <p className="text-2xl font-semibold text-gray-900">{unverifiedStudents}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, NIS, atau telepon"
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Filter status siswa"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={verificationFilter}
              onChange={event => setVerificationFilter(event.target.value as typeof verificationFilter)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Filter verifikasi email"
            >
              <option value="all">Semua Verifikasi</option>
              <option value="verified">Terverifikasi</option>
              <option value="unverified">Belum Verifikasi</option>
            </select>
            <select
              value={classFilter}
              onChange={event => setClassFilter(event.target.value as typeof classFilter)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Filter kelas siswa"
            >
              <option value="all">Semua Kelas</option>
              {classOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Siswa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">NIS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Verifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Login Terakhir</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                      Tidak ada siswa yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-sm text-gray-500">{student.phone || '-'}</div>
                        <div className="text-xs text-gray-400">Bergabung: {formatDate(student.joinedAt)}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{student.studentId}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{student.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{student.class || '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            student.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : student.status === 'suspended'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusOptions.find(option => option.value === student.status)?.label || student.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Terverifikasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                            <XCircle className="h-3.5 w-3.5" />
                            Belum Verifikasi
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {formatDateTime(student.lastLoginAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="rounded-lg border border-blue-100 px-3 py-1 text-sm text-blue-600 transition hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="rounded-lg border border-red-100 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-8">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingStudent ? 'Edit Akun Siswa' : 'Tambah Akun Siswa'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Lengkapi informasi siswa untuk memberikan akses ke platform.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">NIS</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Masukkan NIS siswa"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Masukkan nama siswa"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="contoh@gema.sch.id"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Password {editingStudent && <span className="text-xs text-gray-500">(Kosongkan jika tidak diubah)</span>}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingStudent}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Kelas</label>
                    <input
                      type="text"
                      name="class"
                      value={formData.class || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Contoh: XI IPA-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Alamat</label>
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Alamat lengkap siswa"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nama Orang Tua/Wali</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Masukkan nama orang tua"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Telepon Orang Tua/Wali</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status Akun</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      id="isVerified"
                      name="isVerified"
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isVerified" className="text-sm text-gray-700">
                      Tandai akun sebagai sudah verifikasi email
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isSubmitting ? 'Menyimpan...' : editingStudent ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
