import AdminLayout from '@/components/admin/AdminLayout'
import { UserManager } from '@/features/admin/users'

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManager />
    </AdminLayout>
  )
}
