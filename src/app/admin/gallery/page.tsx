import AdminLayout from '@/components/admin/AdminLayout'
import { GalleryManager } from '@/features/admin/gallery'

export default function GalleryPage() {
  return (
    <AdminLayout>
      <GalleryManager />
    </AdminLayout>
  )
}
