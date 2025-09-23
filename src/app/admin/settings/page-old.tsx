"use client";

import { useState, useEffect } from 'react'
import { Settings, Save, Eye, EyeOff, Globe, Mail, Shield, Database } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  registrationEnabled: boolean
  maintenanceMode: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  theme: string
  socialMedia: {
    instagram: string
    facebook: string
    youtube: string
    whatsapp: string
  }
  seo: {
    metaDescription: string
    keywords: string
    ogImage: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    adminAlerts: boolean
  }
}

const defaultSettings: SiteSettings = {
  siteName: 'GEMA - SMA Wahidiyah Kediri',
  siteDescription: 'Generasi Muda Informatika - Program Unggulan SMA Wahidiyah Kediri',
  siteUrl: 'https://gema.smawahidiyah.edu',
  contactEmail: 'smaswahidiyah@gmail.com',
  registrationEnabled: true,
  maintenanceMode: false,
  maxFileSize: 5,
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  theme: 'light',
  socialMedia: {
    instagram: '@smawahidiyah_official',
    facebook: 'SMA Wahidiyah Kediri',
    youtube: 'SMA Wahidiyah Kediri',
    whatsapp: '+62812345678'
  },
  seo: {
    metaDescription: 'GEMA (Generasi Muda Informatika) adalah program unggulan SMA Wahidiyah Kediri yang memadukan pendidikan agama dan teknologi modern.',
    keywords: 'SMA Wahidiyah Kediri, GEMA, Informatika, Pesantren Modern, Pendidikan Islam',
    ogImage: '/images/gema-og.jpg'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    adminAlerts: true
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'general', label: 'Umum', icon: Settings },
    { id: 'social', label: 'Media Sosial', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Eye },
    { id: 'notifications', label: 'Notifikasi', icon: Mail },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'system', label: 'Sistem', icon: Database }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Pengaturan berhasil disimpan!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSettings = (key: string, value: string | boolean | number | string[]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSettings = (parent: string, key: string, value: string | boolean | number | string[]) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SiteSettings] as Record<string, string | boolean | number | string[]>,
        [key]: value
      }
    }))
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Situs</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSettings('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          title="Nama situs web"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Situs</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => updateSettings('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          title="Deskripsi situs web"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL Situs</label>
        <input
          type="url"
          value={settings.siteUrl}
          onChange={(e) => updateSettings('siteUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          title="URL situs web"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Kontak</label>
        <input
          type="email"
          value={settings.contactEmail}
          onChange={(e) => updateSettings('contactEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          title="Email kontak utama"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="registrationEnabled"
            checked={settings.registrationEnabled}
            onChange={(e) => updateSettings('registrationEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="registrationEnabled" className="ml-2 text-sm text-gray-900">
            Pendaftaran Dibuka
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={(e) => updateSettings('maintenanceMode', e.target.checked)}
            className="h-4 w-4 text-red-600 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-900">
            Mode Maintenance
          </label>
        </div>
      </div>
    </div>
  )

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
        <input
          type="text"
          value={settings.socialMedia.instagram}
          onChange={(e) => updateNestedSettings('socialMedia', 'instagram', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="@username"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
        <input
          type="text"
          value={settings.socialMedia.facebook}
          onChange={(e) => updateNestedSettings('socialMedia', 'facebook', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Nama halaman Facebook"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
        <input
          type="text"
          value={settings.socialMedia.youtube}
          onChange={(e) => updateNestedSettings('socialMedia', 'youtube', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Nama channel YouTube"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
        <input
          type="text"
          value={settings.socialMedia.whatsapp}
          onChange={(e) => updateNestedSettings('socialMedia', 'whatsapp', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="+62812345678"
        />
      </div>
    </div>
  )

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
        <textarea
          value={settings.seo.metaDescription}
          onChange={(e) => updateNestedSettings('seo', 'metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Deskripsi singkat untuk mesin pencari (maksimal 160 karakter)"
        />
        <p className="text-sm text-gray-500 mt-1">
          {settings.seo.metaDescription.length}/160 karakter
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
        <input
          type="text"
          value={settings.seo.keywords}
          onChange={(e) => updateNestedSettings('seo', 'keywords', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="kata kunci, dipisahkan, dengan koma"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph Image</label>
        <input
          type="text"
          value={settings.seo.ogImage}
          onChange={(e) => updateNestedSettings('seo', 'ogImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="/images/og-image.jpg"
        />
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="emailNotifications"
          checked={settings.notifications.emailNotifications}
          onChange={(e) => updateNestedSettings('notifications', 'emailNotifications', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-900">
          Notifikasi Email
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="pushNotifications"
          checked={settings.notifications.pushNotifications}
          onChange={(e) => updateNestedSettings('notifications', 'pushNotifications', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="pushNotifications" className="ml-2 text-sm text-gray-900">
          Push Notifications
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="adminAlerts"
          checked={settings.notifications.adminAlerts}
          onChange={(e) => updateNestedSettings('notifications', 'adminAlerts', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="adminAlerts" className="ml-2 text-sm text-gray-900">
          Alert Admin
        </label>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Keamanan Sistem</h4>
        <p className="text-sm text-yellow-700">
          Pengaturan keamanan memerlukan restart sistem untuk mengambil efek.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password Admin Baru</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Kosongkan jika tidak ingin mengubah"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? 
              <EyeOff className="h-5 w-5 text-gray-400" /> : 
              <Eye className="h-5 w-5 text-gray-400" />
            }
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (menit)</label>
        <input
          type="number"
          defaultValue={60}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          min="15"
          max="480"
          title="Timeout sesi dalam menit"
        />
      </div>
    </div>
  )

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran File Maksimal (MB)</label>
        <input
          type="number"
          value={settings.maxFileSize}
          onChange={(e) => updateSettings('maxFileSize', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          min="1"
          max="100"
          title="Ukuran maksimal file upload dalam MB"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe File yang Diizinkan</label>
        <input
          type="text"
          value={settings.allowedFileTypes.join(', ')}
          onChange={(e) => updateSettings('allowedFileTypes', e.target.value.split(', '))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="jpg, png, pdf, doc"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
        <select
          value={settings.theme}
          onChange={(e) => updateSettings('theme', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          title="Pilih tema aplikasi"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Otomatis</option>
        </select>
      </div>
      
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h4 className="text-sm font-medium text-red-800 mb-2">Zona Bahaya</h4>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
          Reset Semua Pengaturan
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Sistem</h1>
            <p className="text-gray-600">Kelola konfigurasi dan pengaturan aplikasi.</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'social' && renderSocialTab()}
            {activeTab === 'seo' && renderSEOTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'system' && renderSystemTab()}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
