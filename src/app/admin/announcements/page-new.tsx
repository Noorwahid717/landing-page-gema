"use client";

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  isActive: boolean
  publishDate: string
  createdAt: string
}

interface AnnouncementFormData {
  title: string
  content: string
  type: string
  isActive: boolean
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    type: 'info',
    isActive: true
  })

  const types = [
    { value: 'info', label: 'Informasi', color: 'blue' },
    { value: 'warning', label: 'Peringatan', color: 'yellow' },
    { value: 'success', label: 'Sukses', color: 'green' },
    { value: 'error', label: 'Error', color: 'red' }
  ]

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = '/api/admin/announcements'
      const method = editingAnnouncement ? 'PATCH' : 'POST'
      const body = editingAnnouncement 
        ? { id: editingAnnouncement.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchAnnouncements()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isActive: announcement.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        const response = await fetch(`/api/admin/announcements?id=${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await fetchAnnouncements()
        }
      } catch (error) {
        console.error('Error deleting announcement:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      isActive: true
    })
    setShowForm(false)
    setEditingAnnouncement(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    const typeConfig = types.find(t => t.value === type)
    return typeConfig?.color || 'gray'
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = types.find(t => t.value === type)
    return typeConfig?.label || type
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pengumuman</h1>
            <p className="text-gray-600">Kelola semua pengumuman dan berita GEMA</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengumuman
          </button>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Daftar Pengumuman</h2>
            
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada pengumuman. Tambahkan pengumuman pertama Anda!
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(announcement.publishDate)}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full bg-${getTypeColor(announcement.type)}-100 text-${getTypeColor(announcement.type)}-800`}>
                            {getTypeLabel(announcement.type)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingAnnouncement ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan judul pengumuman"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Isi konten pengumuman"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pengumuman</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        {types.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="isActive"
                        value={formData.isActive.toString()}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isSubmitting ? 'Menyimpan...' : (editingAnnouncement ? 'Update' : 'Simpan')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
