"use client"

import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useToast } from '@/components/feedback/toast'

import { UserForm } from './components/UserForm'
import { UserTable } from './components/UserTable'
import type { AdminUser, AdminUserFormData, RoleOption } from './types'

const DEFAULT_FORM: AdminUserFormData = {
  email: '',
  password: '',
  name: '',
  role: 'admin',
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'admin', label: 'Admin', badgeClass: 'bg-blue-100 text-blue-800' },
  { value: 'super_admin', label: 'Super Admin', badgeClass: 'bg-red-100 text-red-800' },
  { value: 'moderator', label: 'Moderator', badgeClass: 'bg-green-100 text-green-800' },
]

export function UserManager() {
  const { addToast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [formData, setFormData] = useState<AdminUserFormData>(DEFAULT_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)

  const roleOptions = useMemo(() => ROLE_OPTIONS, [])

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM)
    setEditingUser(null)
    setIsFormVisible(false)
  }, [])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Gagal memuat data admin')
      }

      const data = (await response.json()) as AdminUser[]
      setUsers(data)
    } catch (error) {
      console.error(error)
      addToast({
        type: 'error',
        title: 'Gagal Memuat',
        message: 'Tidak dapat memuat data admin. Silakan coba lagi.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target

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
        const body = editingUser
          ? { id: editingUser.id, ...formData, password: formData.password || undefined }
          : formData

        const response = await fetch('/api/admin/users', {
          method: editingUser ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          throw new Error('Gagal menyimpan data admin')
        }

        addToast({
          type: 'success',
          title: 'Berhasil',
          message: editingUser ? 'Data admin berhasil diperbarui.' : 'Admin baru berhasil ditambahkan.',
        })

        await fetchUsers()
        resetForm()
      } catch (error) {
        console.error(error)
        addToast({
          type: 'error',
          title: 'Gagal Menyimpan',
          message: 'Tidak dapat menyimpan data admin. Silakan coba lagi.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [addToast, editingUser, fetchUsers, formData, resetForm],
  )

  const handleEdit = useCallback((user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      role: user.role,
    })
    setIsFormVisible(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
        return
      }

      try {
        const response = await fetch(`/api/admin/users?id=${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Gagal menghapus admin')
        }

        addToast({
          type: 'success',
          title: 'Admin Dihapus',
          message: 'Data admin berhasil dihapus.',
        })

        await fetchUsers()
      } catch (error) {
        console.error(error)
        addToast({
          type: 'error',
          title: 'Gagal Menghapus',
          message: 'Tidak dapat menghapus admin. Silakan coba lagi.',
        })
      }
    },
    [addToast, fetchUsers],
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Admin</h1>
          <p className="text-gray-600">Atur akses administrator dan moderator sistem</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            type="button"
          >
            Muat Ulang
          </button>
          <button
            onClick={() => {
              setIsFormVisible(true)
              setEditingUser(null)
              setFormData(DEFAULT_FORM)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            type="button"
          >
            Tambah Admin
          </button>
        </div>
      </div>

      <UserForm
        formData={formData}
        isEditing={Boolean(editingUser)}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onClose={resetForm}
        onSubmit={handleSubmit}
        options={roleOptions}
        showForm={isFormVisible}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Daftar Admin</h2>
            <p className="text-sm text-gray-500">Total {users.length} admin</p>
          </div>

          <UserTable
            users={users}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={handleEdit}
            options={roleOptions}
          />
        </div>
      </div>
    </div>
  )
}

export { ROLE_OPTIONS }
