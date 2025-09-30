export type UserRole = 'admin' | 'super_admin' | 'moderator'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AdminUserFormData {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface RoleOption {
  value: UserRole
  label: string
  badgeClass: string
}
