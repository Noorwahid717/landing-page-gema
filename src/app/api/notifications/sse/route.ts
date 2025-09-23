import { NextRequest } from 'next/server'
import { addNotificationClient, removeNotificationClient } from '@/lib/notification-broadcast'

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      addNotificationClient(controller)
      
      const data = JSON.stringify({
        type: 'connected',
        message: 'Terhubung dengan sistem notifikasi GEMA',
        timestamp: new Date().toISOString()
      })
      
      controller.enqueue(`data: ${data}\n\n`)
      
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'heartbeat', 
            timestamp: new Date().toISOString() 
          })}\n\n`)
        } catch {
          clearInterval(heartbeat)
          removeNotificationClient(controller)
        }
      }, 30000)
      
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        removeNotificationClient(controller)
        try {
          controller.close()
        } catch {
          // Connection already closed
        }
      })
    },
    
    cancel(controller: ReadableStreamDefaultController) {
      removeNotificationClient(controller)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}
