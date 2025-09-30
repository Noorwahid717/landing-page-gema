"use client"

import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useToast } from '@/components/feedback/toast'

import { SettingsForm } from './components/SettingsForm'
import type { Setting, SettingsFormData } from './types'

const DEFAULT_FORM: SettingsFormData = {
  siteName: 'GEMA - Generasi Muda Informatika',
  siteDescription: 'Website resmi komunitas GEMA SMA Wahidiyah Kediri',
  contactEmail: 'smaswahidiyah@gmail.com',
  contactPhone: '',
  socialInstagram: '@smawahidiyah_official',
  socialFacebook: '',
  socialTwitter: '',
  registrationOpen: true,
  maintenanceMode: false,
}

export function SettingsManager() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<SettingsFormData>(DEFAULT_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mapSettingsToForm = useCallback((data: Setting[]): SettingsFormData => {
    const mapped = data.reduce<Record<string, string>>((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return {
      siteName: mapped.siteName || DEFAULT_FORM.siteName,
      siteDescription: mapped.siteDescription || DEFAULT_FORM.siteDescription,
      contactEmail: mapped.contactEmail || DEFAULT_FORM.contactEmail,
      contactPhone: mapped.contactPhone || DEFAULT_FORM.contactPhone,
      socialInstagram: mapped.socialInstagram || DEFAULT_FORM.socialInstagram,
      socialFacebook: mapped.socialFacebook || DEFAULT_FORM.socialFacebook,
      socialTwitter: mapped.socialTwitter || DEFAULT_FORM.socialTwitter,
      registrationOpen: mapped.registrationOpen === 'true',
      maintenanceMode: mapped.maintenanceMode === 'true',
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) {
        throw new Error('Gagal memuat pengaturan')
      }

      const data = (await response.json()) as Setting[]
      setFormData(mapSettingsToForm(data))
    } catch (error) {
      console.error(error)
      addToast({
        type: 'error',
        title: 'Gagal Memuat',
        message: 'Tidak dapat memuat pengaturan sistem. Silakan coba lagi.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast, mapSettingsToForm])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, type } = event.target
      const value = type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value

      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)

      try {
        const payload = Object.entries(formData).map(([key, value]) => ({
          key,
          value: typeof value === 'boolean' ? value.toString() : value,
        }))

        const response = await fetch('/api/admin/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: payload }),
        })

        if (!response.ok) {
          throw new Error('Gagal menyimpan pengaturan')
        }

        addToast({
          type: 'success',
          title: 'Pengaturan Disimpan',
          message: 'Semua perubahan pengaturan berhasil disimpan.',
        })

        await fetchSettings()
      } catch (error) {
        console.error(error)
        addToast({
          type: 'error',
          title: 'Gagal Menyimpan',
          message: 'Tidak dapat menyimpan pengaturan. Silakan coba lagi.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [addToast, fetchSettings, formData],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-gray-600">Kelola konfigurasi website dan aplikasi administrator</p>
      </div>

      <SettingsForm
        formData={formData}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onRefresh={fetchSettings}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
