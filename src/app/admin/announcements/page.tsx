import AdminLayout from '@/components/admin/AdminLayout'
import { AnnouncementManager } from '@/features/admin/announcements'

export default function AnnouncementsPage() {
  return (
    <AdminLayout>
      <AnnouncementManager />
    </AdminLayout>
  )
}
