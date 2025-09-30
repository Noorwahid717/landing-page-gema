import type { ChangeEvent, FormEvent } from 'react'
import { Loader2, Plus, Save } from 'lucide-react'

import type { AdminUserFormData, RoleOption } from '../types'

interface UserFormProps {
  formData: AdminUserFormData
  isEditing: boolean
  isSubmitting: boolean
  showForm: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  options: RoleOption[]
}

export function UserForm({
  formData,
  isEditing,
  isSubmitting,
  showForm,
  onChange,
  onClose,
  onSubmit,
  options,
}: UserFormProps) {
  if (!showForm) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Admin' : 'Tambah Admin'}
            </h2>
            <p className="text-sm text-gray-600">Kelola akses administrator dan moderator</p>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900"
            type="button"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nama admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="admin@domain.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={isEditing ? 'Biarkan kosong jika tidak ingin mengubah' : 'Minimal 8 karakter'}
                minLength={isEditing ? undefined : 8}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isSubmitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambahkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
