export interface Setting {
  id: string
  key: string
  value: string
}

export interface SettingsFormData {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  socialInstagram: string
  socialFacebook: string
  socialTwitter: string
  registrationOpen: boolean
  maintenanceMode: boolean
}
