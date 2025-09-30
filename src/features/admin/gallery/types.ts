export type GalleryCategory = 'general' | 'workshop' | 'event' | 'competition' | 'project'

export interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: GalleryCategory
  isActive: boolean
  createdAt: string
}

export interface GalleryFormData {
  title: string
  description: string
  imageUrl: string
  category: GalleryCategory
  isActive: boolean
}

export interface GalleryCategoryOption {
  value: GalleryCategory
  label: string
}
