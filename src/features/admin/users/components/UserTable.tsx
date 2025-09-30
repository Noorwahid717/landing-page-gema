import { Edit, Trash2, Users } from 'lucide-react'

import type { AdminUser, RoleOption } from '../types'

interface UserTableProps {
  users: AdminUser[]
  isLoading: boolean
  onEdit: (user: AdminUser) => void
  onDelete: (id: string) => void
  options: RoleOption[]
}

export function UserTable({ users, isLoading, onEdit, onDelete, options }: UserTableProps) {
  const roleMap = options.reduce<Record<string, RoleOption>>((acc, option) => {
    acc[option.value] = option
    return acc
  }, {})

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Users className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">Belum ada admin terdaftar</p>
        <p className="text-sm">Tambahkan admin untuk mulai mengelola sistem</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => {
            const meta = roleMap[user.role]
            const label = meta?.label ?? user.role
            const badgeClass = meta?.badgeClass ?? 'bg-gray-100 text-gray-800'

            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                    {label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="inline-flex items-center gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      type="button"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-800"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
