import { NextRequest } from 'next/server'

// Store active connections
const clients = new Set<ReadableStreamDefaultController>()

export async function GET(request: NextRequest) {
  // Check if user is authenticated admin
  const { searchParams } = new URL(request.url)
  const authToken = searchParams.get('token') || request.headers.get('authorization')
  
  // For demo purposes, we'll skip detailed auth check
  // In production, verify JWT token here
  
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set
      clients.add(controller)
      
      // Send initial connection message
      const data = JSON.stringify({
        type: 'connected',
        message: 'Connected to real-time notifications',
        timestamp: new Date().toISOString()
      })
      
      controller.enqueue(`data: ${data}\n\n`)
      
      // Send heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`)
        } catch (error) {
          clearInterval(heartbeat)
          clients.delete(controller)
        }
      }, 30000)
      
      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        clients.delete(controller)
        try {
          controller.close()
        } catch (error) {
          // Connection already closed
        }
      })
    },
    
    cancel(controller: ReadableStreamDefaultController) {
      // Clean up when stream is cancelled
      clients.delete(controller)
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

// Function to broadcast to all connected clients
export function broadcastToClients(data: {
  type: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  
  // Create a copy of clients to avoid modification during iteration
  const clientsCopy = Array.from(clients)
  
  clientsCopy.forEach(controller => {
    try {
      controller.enqueue(message)
    } catch (error) {
      // Remove dead connections
      clients.delete(controller)
    }
  })
}

// Export clients for external use
export { clients }
