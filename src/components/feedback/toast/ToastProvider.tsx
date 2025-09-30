"use client"

import type { JSX, ReactNode } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"

import type { ToastMessage, ToastOptions, ToastType } from "./types"

interface ToastProviderProps {
  children: ReactNode
}

interface ToastContextValue {
  addToast: (toast: ToastOptions) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const ICONS: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
}

const COLORS: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({})

  const createToastId = useCallback(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID()
    }

    return Math.random().toString(36).slice(2)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))

    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id])
      delete timeouts.current[id]
    }
  }, [])

  const addToast = useCallback(
    ({ duration = 5000, ...toast }: ToastOptions) => {
      const id = createToastId()
      const nextToast: ToastMessage = { ...toast, duration, id }

      setToasts(prev => [...prev, nextToast])

      timeouts.current[id] = setTimeout(() => removeToast(id), duration)
    },
    [createToastId, removeToast],
  )

  useEffect(
    () => () => {
      Object.values(timeouts.current).forEach(clearTimeout)
      timeouts.current = {}
    },
    [],
  )

  const contextValue = useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, title, message, type }) => (
          <div
            key={id}
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg transform transition-all duration-300 ${COLORS[type]}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">{ICONS[type]}</div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm opacity-90">{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Tutup notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export { ToastContext }
