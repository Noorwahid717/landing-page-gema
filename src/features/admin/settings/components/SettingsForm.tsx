import type { ChangeEvent, FormEvent } from 'react'
import { Loader2, RefreshCw, Save } from 'lucide-react'

import type { SettingsFormData } from '../types'

interface SettingsFormProps {
  formData: SettingsFormData
  isLoading: boolean
  isSubmitting: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onRefresh: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SettingsForm({ formData, isLoading, isSubmitting, onChange, onRefresh, onSubmit }: SettingsFormProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Konfigurasi Website</h2>
            <p className="text-sm text-gray-600">Perbarui informasi utama dan pengaturan sistem</p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            type="button"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 border-b pb-2">Informasi Website</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="GEMA - Generasi Muda Informatika"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Website</label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Website resmi komunitas GEMA SMA Wahidiyah Kediri"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 border-b pb-2">Informasi Kontak</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Kontak</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={onChange}
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
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="08123456789"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 border-b pb-2">Media Sosial</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    name="socialInstagram"
                    value={formData.socialInstagram}
                    onChange={onChange}
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
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="facebook.com/gema"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="text"
                    name="socialTwitter"
                    value={formData.socialTwitter}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="@gema_official"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 border-b pb-2">Pengaturan Sistem</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="registrationOpen"
                    checked={formData.registrationOpen}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Buka pendaftaran siswa</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Aktifkan mode pemeliharaan</span>
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
