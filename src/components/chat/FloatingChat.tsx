"use client";

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Bot } from 'lucide-react'

interface Message {
  id: string
  message: string
  sender: 'user' | 'admin'
  senderName?: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered'
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [showUserForm, setShowUserForm] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (isOpen && !isConnected) {
      connectToChat()
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && sessionId) {
      loadChatHistory()
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const connectToChat = () => {
    try {
      const eventSource = new EventSource('/api/chat/sse')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        addSystemMessage('Terhubung dengan admin GEMA')
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          console.log('FloatingChat received message:', data)
          
          if (data.type === 'admin_message') {
            // Only show admin messages for current session or if no session yet
            if (!sessionId || !data.sessionId || data.sessionId === sessionId) {
              const newMessage: Message = {
                id: Date.now().toString(),
                message: data.message,
                sender: 'admin',
                senderName: data.senderName || 'Admin GEMA',
                timestamp: new Date(data.timestamp),
                status: 'delivered'
              }
              
              setMessages(prev => [...prev, newMessage])
              
              if (!isOpen) {
                setUnreadCount(prev => prev + 1)
              }
              
              // Show browser notification
              if (Notification.permission === 'granted' && !isOpen) {
                new Notification('Pesan dari Admin GEMA', {
                  body: data.message,
                  icon: '/gema.svg',
                  tag: 'chat-message'
                })
              }
            }
          } else if (data.type === 'typing') {
            setIsTyping(data.isTyping)
          } else if (data.type === 'connected') {
            console.log('Chat connected:', data.message)
          } else if (data.type === 'heartbeat') {
            // Heartbeat received, connection is alive
          }
        } catch (error) {
          console.error('Error parsing chat message:', error)
        }
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        addSystemMessage('Koneksi terputus. Mencoba menyambung kembali...')
        
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToChat()
          }
        }, 5000)
      }
    } catch (error) {
      console.error('Failed to connect to chat:', error)
    }
  }

  const addSystemMessage = (message: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      message,
      sender: 'admin',
      senderName: 'System',
      timestamp: new Date(),
      status: 'delivered'
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isSending) return

    const messageText = currentMessage.trim()
    setCurrentMessage('')
    setIsSending(true)

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      message: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          senderName: userInfo.name || 'Pengunjung',
          senderEmail: userInfo.email || 'guest@example.com',
          sessionId: sessionId
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Store session ID for subsequent messages
        if (result.sessionId && !sessionId) {
          setSessionId(result.sessionId)
        }
        
        // Update message status to sent
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        ))
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Update message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ))
      addSystemMessage('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    if (!sessionId) return
    
    try {
      const response = await fetch(`/api/chat/send?sessionId=${sessionId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const historyMessages: Message[] = result.data.map((msg: {
            id: string;
            message: string;
            senderType: string;
            senderName: string;
            createdAt: string;
          }) => ({
            id: msg.id,
            message: msg.message,
            sender: msg.senderType === 'admin' ? 'admin' : 'user',
            senderName: msg.senderName,
            timestamp: new Date(msg.createdAt),
            status: 'delivered'
          }))
          setMessages(historyMessages)
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInfo.name.trim()) {
      setShowUserForm(false)
      addSystemMessage(`Halo ${userInfo.name}! Ada yang bisa kami bantu?`)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
      case 'sent':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'delivered':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative"
          title="Chat dengan Admin GEMA"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Connection indicator */}
          <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          
          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-96'
        }`}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Admin GEMA</h3>
                <p className="text-xs opacity-90">
                  {isConnected ? 'Online' : 'Offline'}
                  {isTyping && ' • sedang mengetik...'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
                title={isMinimized ? 'Perbesar' : 'Perkecil'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
                title="Tutup chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* User Info Form */}
              {showUserForm && (
                <div className="p-4 border-b border-gray-200">
                  <form onSubmit={handleUserInfoSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Nama Anda"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email (opsional)"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      Mulai Chat
                    </button>
                  </form>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.senderName === 'System'
                        ? 'bg-gray-100 text-gray-600 text-center text-xs'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.sender === 'admin' && message.senderName !== 'System' && (
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">{message.senderName}</span>
                        </div>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {!showUserForm && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ketik pesan..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      disabled={!isConnected || isSending}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || !isConnected || isSending}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                      title="Kirim pesan"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
