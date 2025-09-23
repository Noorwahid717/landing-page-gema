"use client";

import { useState, useRef, useEffect } from 'react'
import { Bell, X, MessageSquare, Clock, User, MessageCircle } from 'lucide-react'
import { useSSENotifications } from '@/hooks/useSSENotifications'
import { useToast } from '@/components/ui/Toast'

export default function NotificationPanel() {
  const { notifications, isConnected, unreadCount, markAsRead, clearNotifications } = useSSENotifications()
  const { addToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevNotificationCount = useRef(notifications.length)

  // Play notification sound when new notification arrives
  useEffect(() => {
    if (notifications.length > prevNotificationCount.current) {
      const latestNotification = notifications[0]
      
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        })
      }
      
      // Show toast
      if (latestNotification?.type === 'new_contact') {
        addToast({
          type: 'info',
          title: 'Pesan Baru!',
          message: `${latestNotification.data?.name}: ${latestNotification.data?.preview}`,
          duration: 6000
        })
      } else if (latestNotification?.type === 'new_chat_message') {
        addToast({
          type: 'info',
          title: 'Chat Baru!',
          message: `${latestNotification.data?.senderName}: ${latestNotification.data?.message}`,
          duration: 6000
        })
      }
    }
    prevNotificationCount.current = notifications.length
  }, [notifications, addToast])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      markAsRead()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_contact':
        return <MessageSquare className="w-4 h-4" />
      case 'new_chat_message':
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_contact':
        return 'text-blue-600 bg-blue-100'
      case 'new_chat_message':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="relative">
      {/* Hidden audio element for notification sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEEOQ0u3WdyQFJnrI8N2QQAoUXrTp66hVFApGn+DyvmwhEE"
        preload="auto"
      />
      
      {/* Notification Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifikasi Real-time"
      >
        <Bell className="w-6 h-6" />
        
        {/* Connection Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
              <p className="text-sm text-gray-500">
                Status: {isConnected ? (
                  <span className="text-green-600">Terhubung</span>
                ) : (
                  <span className="text-red-600">Terputus</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  title="Hapus semua notifikasi"
                >
                  Bersihkan
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Tutup panel notifikasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Belum ada notifikasi</p>
                <p className="text-xs">Notifikasi real-time akan muncul di sini</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        
                        {notification.data && (
                          <div className="text-sm text-gray-600 space-y-1">
                            {(() => {
                              const data = notification.data as Record<string, unknown>
                              return (
                                <>
                                  {data?.name && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-3 h-3" />
                                      <span>{String(data.name)}</span>
                                    </div>
                                  )}
                                  {data?.preview && (
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                      {String(data.preview)}
                                    </p>
                                  )}
                                </>
                              )
                            })()}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to contacts page
                    window.location.href = '/admin/contacts'
                  }}
                  className="flex-1 text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Lihat Kontak
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to multi-chat page for chat messages
                    window.location.href = '/admin/multi-chat'
                  }}
                  className="flex-1 text-center text-sm text-green-600 hover:text-green-700 font-medium py-2 px-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  Multi Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
