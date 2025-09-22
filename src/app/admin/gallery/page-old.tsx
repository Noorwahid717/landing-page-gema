"use client";

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Upload, Trash2, Eye, Plus } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  isActive: boolean
  createdAt: string
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'kegiatan', 'workshop', 'kompetisi', 'fasilitas', 'achievement']
  const categoryLabels = {
    all: 'Semua',
    kegiatan: 'Kegiatan',
    workshop: 'Workshop', 
    kompetisi: 'Kompetisi',
    fasilitas: 'Fasilitas',
    achievement: 'Prestasi'
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/admin/gallery')
      if (response.ok) {
        const data = await response.json()
        setGallery(data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGallery = gallery.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  )

  const deleteImage = async (imageId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      try {
        await fetch(`/api/admin/gallery/${imageId}`, {
          method: 'DELETE'
        })
        setGallery(gallery.filter(item => item.id !== imageId))
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Galeri</h1>
            <p className="text-gray-600">Kelola foto dan gambar kegiatan GEMA.</p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Gambar
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <ImageIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{gallery.length}</p>
                <p className="text-sm text-gray-600">Total Gambar</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {gallery.filter(item => item.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Gambar Aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Upload className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredGallery.length}
                </p>
                <p className="text-sm text-gray-600">Kategori Terpilih</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Belum ada gambar di galeri.</p>
            </div>
          ) : (
            filteredGallery.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      className="bg-white/80 hover:bg-white p-1 rounded-full shadow-sm"
                      title="Lihat gambar"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteImage(item.id)}
                      className="bg-white/80 hover:bg-white p-1 rounded-full shadow-sm"
                      title="Hapus gambar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Gambar Baru</h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag & drop gambar atau klik untuk memilih</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        title="Pilih file gambar"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Gambar</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan judul gambar"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi gambar (opsional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      title="Pilih kategori gambar"
                    >
                      <option value="">Pilih kategori</option>
                      <option value="kegiatan">Kegiatan</option>
                      <option value="workshop">Workshop</option>
                      <option value="kompetisi">Kompetisi</option>
                      <option value="fasilitas">Fasilitas</option>
                      <option value="achievement">Prestasi</option>
                    </select>
                  </div>
                </form>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Upload
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
