import { NextRequest } from 'next/server'

// Store active chat connections
const chatClients = new Set<ReadableStreamDefaultController>()

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to chat connections
      chatClients.add(controller)
      
      // Send initial connection message
      const data = JSON.stringify({
        type: 'connected',
        message: 'Terhubung dengan sistem chat GEMA',
        timestamp: new Date().toISOString()
      })
      
      controller.enqueue(`data: ${data}\n\n`)
      
      // Send heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'heartbeat', 
            timestamp: new Date().toISOString() 
          })}\n\n`)
        } catch (error) {
          clearInterval(heartbeat)
          chatClients.delete(controller)
        }
      }, 30000)
      
      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        chatClients.delete(controller)
        try {
          controller.close()
        } catch (error) {
          // Connection already closed
        }
      })
    },
    
    cancel(controller: ReadableStreamDefaultController) {
      chatClients.delete(controller)
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

// Function to broadcast chat messages to all connected clients
export function broadcastChatMessage(data: {
  type: string;
  message: string;
  senderName: string;
  sessionId?: string;
  timestamp: Date;
}) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  
  const clientsCopy = Array.from(chatClients)
  
  clientsCopy.forEach(controller => {
    try {
      controller.enqueue(message)
    } catch (error) {
      chatClients.delete(controller)
    }
  })
}

// Export clients for external use
export { chatClients }
