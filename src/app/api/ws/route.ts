import type { NextRequest } from 'next/server'

export const runtime = 'edge'

type Role = 'host' | 'viewer'

type JoinMessage = {
  type: 'join'
  roomId: string
  clientId: string
  role: Role
}

type SignalMessage = {
  type: 'offer' | 'answer'
  roomId: string
  clientId: string
  target: string
  sdp: string
}

type IceMessage = {
  type: 'ice'
  roomId: string
  clientId: string
  target: string
  candidate: RTCIceCandidateInit
}

type IncomingMessage = JoinMessage | SignalMessage | IceMessage

type OutgoingMessage =
  | {
      type: 'joined'
      clientId: string
      role: Role
      peers: Array<{ clientId: string; role: Role }>
    }
  | {
      type: 'peer-joined' | 'peer-left'
      clientId: string
      role?: Role
    }
  | ({
      type: 'offer' | 'answer'
    } & {
      clientId: string
      target: string
      sdp: string
    })
  | ({
      type: 'ice'
    } & {
      clientId: string
      target: string
      candidate: RTCIceCandidateInit
    })
  | {
      type: 'error'
      message: string
    }

type WebSocketResponseInit = ResponseInit & { webSocket: WebSocket }

interface PeerRecord {
  id: string
  socket: WebSocket
  role: Role
}

interface RoomStore {
  addPeer(roomId: string, peer: PeerRecord): { peers: PeerRecord[]; isNewHost: boolean }
  removePeer(roomId: string, peerId: string): PeerRecord | null
  getPeer(roomId: string, peerId: string): PeerRecord | null
  listPeers(roomId: string): PeerRecord[]
  hasHost(roomId: string): boolean
}

class InMemoryRoomStore implements RoomStore {
  private rooms = new Map<string, Map<string, PeerRecord>>()

  addPeer(roomId: string, peer: PeerRecord) {
    let room = this.rooms.get(roomId)
    if (!room) {
      room = new Map()
      this.rooms.set(roomId, room)
    }

    const isNewHost = peer.role === 'host'
    room.set(peer.id, peer)

    return {
      peers: Array.from(room.values()),
      isNewHost
    }
  }

  removePeer(roomId: string, peerId: string) {
    const room = this.rooms.get(roomId)
    if (!room) {
      return null
    }

    const peer = room.get(peerId) ?? null
    if (peer) {
      room.delete(peerId)
    }

    if (room.size === 0) {
      this.rooms.delete(roomId)
    }

    return peer
  }

  getPeer(roomId: string, peerId: string) {
    return this.rooms.get(roomId)?.get(peerId) ?? null
  }

  listPeers(roomId: string) {
    return Array.from(this.rooms.get(roomId)?.values() ?? [])
  }

  hasHost(roomId: string) {
    return this.listPeers(roomId).some((peer) => peer.role === 'host')
  }
}

const store: RoomStore = new InMemoryRoomStore()

function broadcast(roomId: string, payload: OutgoingMessage, excludeId?: string) {
  const peers = store.listPeers(roomId)
  const message = JSON.stringify(payload)
  for (const peer of peers) {
    if (peer.id === excludeId) continue
    try {
      peer.socket.send(message)
    } catch (error) {
      console.error('Failed to broadcast message', error)
    }
  }
}

function send(socket: WebSocket, payload: OutgoingMessage) {
  try {
    socket.send(JSON.stringify(payload))
  } catch (error) {
    console.error('Failed to send message', error)
  }
}

export function GET(request: NextRequest) {
  if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected websocket', { status: 400 })
  }

  const { WebSocketPair } = globalThis as unknown as {
    WebSocketPair: new () => { 0: WebSocket; 1: WebSocket }
  }
  const pair = new WebSocketPair()
  const client = pair[0]
  const server = pair[1] as WebSocket & { accept: () => void }

  const peerState: {
    roomId: string | null
    clientId: string | null
  } = {
    roomId: null,
    clientId: null
  }

  server.accept()

  server.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data as string) as IncomingMessage
      if (data.type === 'join') {
        handleJoin(server, data, peerState)
        return
      }

      if (!peerState.roomId || !peerState.clientId) {
        send(server, { type: 'error', message: 'Join a room before sending signals' })
        return
      }

      handleSignal(server, data, peerState as { roomId: string; clientId: string })
    } catch (error) {
      console.error('Failed to parse message', error)
      send(server, { type: 'error', message: 'Invalid message payload' })
    }
  })

  const close = () => {
    const { roomId, clientId } = peerState
    if (!roomId || !clientId) {
      return
    }

    const peer = store.removePeer(roomId, clientId)
    if (peer) {
      broadcast(roomId, { type: 'peer-left', clientId: peer.id }, peer.id)
    }

    peerState.roomId = null
    peerState.clientId = null
  }

  server.addEventListener('close', close)
  server.addEventListener('error', close)

  const responseInit: WebSocketResponseInit = { status: 101, webSocket: client }
  return new Response(null, responseInit)
}

function handleJoin(socket: WebSocket, data: JoinMessage, state: { roomId: string | null; clientId: string | null }) {
  const { roomId, clientId, role } = data

  if (!roomId || !clientId || !role) {
    send(socket, { type: 'error', message: 'Invalid join payload' })
    return
  }

  if (role === 'host' && store.hasHost(roomId)) {
    send(socket, { type: 'error', message: 'Host already connected' })
    socket.close()
    return
  }

  state.roomId = roomId
  state.clientId = clientId

  store.addPeer(roomId, {
    id: clientId,
    role,
    socket
  })

  const peers = store.listPeers(roomId).map((peer) => ({
    clientId: peer.id,
    role: peer.role
  }))

  send(socket, {
    type: 'joined',
    clientId,
    role,
    peers
  })

  broadcast(roomId, { type: 'peer-joined', clientId, role }, clientId)
}

function handleSignal(socket: WebSocket, data: IncomingMessage, state: { roomId: string; clientId: string }) {
  const roomId = state.roomId
  const senderId = state.clientId
  const sender = store.getPeer(roomId, senderId)

  if (!sender) {
    send(socket, { type: 'error', message: 'Sender not registered in room' })
    return
  }

  switch (data.type) {
    case 'offer': {
      if (sender.role !== 'host') {
        send(socket, { type: 'error', message: 'Only hosts can send offers' })
        return
      }

      const target = store.getPeer(roomId, data.target)
      if (!target) {
        send(socket, { type: 'error', message: 'Target peer not found' })
        return
      }

      send(target.socket, {
        type: 'offer',
        clientId: senderId,
        target: data.target,
        sdp: data.sdp
      })
      return
    }
    case 'answer': {
      if (sender.role !== 'viewer') {
        send(socket, { type: 'error', message: 'Only viewers can send answers' })
        return
      }

      const target = store.getPeer(roomId, data.target)
      if (!target) {
        send(socket, { type: 'error', message: 'Host not found for answer' })
        return
      }

      send(target.socket, {
        type: 'answer',
        clientId: senderId,
        target: data.target,
        sdp: data.sdp
      })
      return
    }
    case 'ice': {
      const target = store.getPeer(roomId, data.target)
      if (!target) {
        send(socket, { type: 'error', message: 'Peer not found for ICE candidate' })
        return
      }

      send(target.socket, {
        type: 'ice',
        clientId: senderId,
        target: data.target,
        candidate: data.candidate
      })
      return
    }
    default: {
      send(socket, { type: 'error', message: 'Unsupported message type' })
    }
  }
}
