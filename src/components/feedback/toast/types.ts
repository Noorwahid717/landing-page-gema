export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastOptions {
  title: string
  message: string
  type: ToastType
  duration?: number
}

export interface ToastMessage extends ToastOptions {
  id: string
}
