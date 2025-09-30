"use client"

import type { JSX } from "react"
import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

import type { ToastType } from "./types"

interface ToastProps {
  isVisible: boolean
  message: string
  onClose: () => void
  type: ToastType
  duration?: number
}

const ICONS: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

const COLORS: Record<ToastType, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-white",
  info: "bg-blue-500 text-white",
}

export function Toast({ isVisible, message, onClose, type, duration = 5000 }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, isVisible, onClose])

  const styles = useMemo(
    () =>
      `fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${COLORS[type]} ${
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`,
    [isAnimating, type],
  )

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles}>
      {ICONS[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsAnimating(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 hover:opacity-80 transition-opacity"
        title="Close notification"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
