"use client";

import { useState, useEffect } from 'react'
import { Settings, Save, RefreshCw } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Setting {
  id: string
  key: string
  value: string
}

interface SettingsFormData {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  socialInstagram: string
  socialFacebook: string
  socialTwitter: string
  registrationOpen: boolean
  maintenanceMode: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<SettingsFormData>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    socialInstagram: '',
    socialFacebook: '',
    socialTwitter: '',
    registrationOpen: true,
    maintenanceMode: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        
        // Convert settings array to form data
        const settingsObj: Record<string, string> = {}
        data.forEach((setting: Setting) => {
          settingsObj[setting.key] = setting.value
        })
        
        setFormData({
          siteName: settingsObj.siteName || 'GEMA - Generasi Muda Informatika',
          siteDescription: settingsObj.siteDescription || 'Website resmi komunitas GEMA SMA Wahidiyah Kediri',
          contactEmail: settingsObj.contactEmail || 'smaswahidiyah@gmail.com',
          contactPhone: settingsObj.contactPhone || '',
          socialInstagram: settingsObj.socialInstagram || '@smawahidiyah_official',
          socialFacebook: settingsObj.socialFacebook || '',
          socialTwitter: settingsObj.socialTwitter || '',
          registrationOpen: settingsObj.registrationOpen === 'true',
          maintenanceMode: settingsObj.maintenanceMode === 'true'
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Convert form data to settings array
      const settingsArray = Object.entries(formData).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? value.toString() : value
      }))

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray })
      })

      if (response.ok) {
        alert('Pengaturan berhasil disimpan!')
        await fetchSettings()
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Gagal menyimpan pengaturan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
            <p className="text-gray-600">Kelola konfigurasi website dan aplikasi</p>
          </div>
          <button
            onClick={fetchSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Konfigurasi Website</h2>
            
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Site Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Informasi Website</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
                    <input
                      type="text"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="GEMA - Generasi Muda Informatika"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Website</label>
                    <textarea
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Website resmi komunitas GEMA SMA Wahidiyah Kediri"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Informasi Kontak</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Kontak</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="smaswahidiyah@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Media Sosial</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                      <input
                        type="text"
                        name="socialInstagram"
                        value={formData.socialInstagram}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="@smawahidiyah_official"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                      <input
                        type="text"
                        name="socialFacebook"
                        value={formData.socialFacebook}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="SMA Wahidiyah"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                      <input
                        type="text"
                        name="socialTwitter"
                        value={formData.socialTwitter}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="@smawahidiyah"
                      />
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Pengaturan Sistem</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="registrationOpen"
                        checked={formData.registrationOpen}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Buka Pendaftaran
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={formData.maintenanceMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Mode Maintenance
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan Pengaturan
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Informasi Penting:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Mode Maintenance akan membuat website tidak dapat diakses oleh pengunjung</li>
            <li>• Pendaftaran tertutup akan menyembunyikan form pendaftaran di landing page</li>
            <li>• Perubahan akan langsung berlaku setelah disimpan</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
