import AdminLayout from '@/components/admin/AdminLayout'
import { SettingsManager } from '@/features/admin/settings'

export default function SettingsPage() {
  return (
    <AdminLayout>
      <SettingsManager />
    </AdminLayout>
  )
}
