"use client";

import { useState, useEffect } from 'react'
import { Megaphone, Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react'
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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')

  const types = ['all', 'info', 'urgent', 'event', 'academic']
  const typeLabels: Record<string, string> = {
    all: 'Semua',
    info: 'Informasi',
    urgent: 'Penting',
    event: 'Event',
    academic: 'Akademik'
  }

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800',
    urgent: 'bg-red-100 text-red-800',
    event: 'bg-green-100 text-green-800',
    academic: 'bg-purple-100 text-purple-800'
  }

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

  const filteredAnnouncements = announcements.filter(announcement => 
    selectedType === 'all' || announcement.type === selectedType
  )

  const toggleStatus = async (announcementId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/announcements/${announcementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      
      setAnnouncements(announcements.map(announcement => 
        announcement.id === announcementId ? { ...announcement, isActive: !isActive } : announcement
      ))
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  }

  const deleteAnnouncement = async (announcementId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        await fetch(`/api/admin/announcements/${announcementId}`, {
          method: 'DELETE'
        })
        setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId))
      } catch (error) {
        console.error('Error deleting announcement:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pengumuman</h1>
            <p className="text-gray-600">Kelola pengumuman dan informasi GEMA.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Buat Pengumuman
          </button>
        </div>

        {/* Type Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Megaphone className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                <p className="text-sm text-gray-600">Total Pengumuman</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.type === 'urgent').length}
                </p>
                <p className="text-sm text-gray-600">Penting</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Megaphone className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAnnouncements.length}
                </p>
                <p className="text-sm text-gray-600">Kategori Terpilih</p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Belum ada pengumuman yang dibuat.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[announcement.type] || 'bg-gray-100 text-gray-800'}`}>
                        {typeLabels[announcement.type] || announcement.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        announcement.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {announcement.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>Dipublikasi: {formatDate(announcement.publishDate)}</span>
                      <span>Dibuat: {formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingAnnouncement(announcement)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit pengumuman"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Lihat detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Hapus pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleStatus(announcement.id, announcement.isActive)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      announcement.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {announcement.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                </h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan judul pengumuman"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konten Pengumuman</label>
                    <textarea
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Tulis konten pengumuman"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pengumuman</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        title="Pilih tipe pengumuman"
                      >
                        <option value="">Pilih tipe</option>
                        <option value="info">Informasi</option>
                        <option value="urgent">Penting</option>
                        <option value="event">Event</option>
                        <option value="academic">Akademik</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        title="Pilih tanggal publikasi"
                      />
                    </div>
                  </div>
                </form>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingAnnouncement(null)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {editingAnnouncement ? 'Update' : 'Publikasi'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
