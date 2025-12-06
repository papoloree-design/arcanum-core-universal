import { EventEmitter } from 'events';

/**
 * Transport Layer P2P
 * Maneja conexiones entre peers
 */

export class Transport extends EventEmitter {
  constructor() {
    super();
    this.peers = new Map();
    this.connections = new Map();
  }

  // Conectar a peer
  connect(peer) {
    if (this.peers.has(peer.id)) {
      return this.peers.get(peer.id);
    }

    const connection = {
      id: peer.id,
      address: peer.address,
      connected: true,
      connectedAt: Date.now(),
      lastSeen: Date.now()
    };

    this.peers.set(peer.id, connection);
    this.emit('peer:connect', connection);

    return connection;
  }

  // Desconectar peer
  disconnect(peerId) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.connected = false;
      this.peers.delete(peerId);
      this.emit('peer:disconnect', peer);
      return true;
    }
    return false;
  }

  // Enviar mensaje a peer
  send(peerId, message) {
    const peer = this.peers.get(peerId);
    if (!peer || !peer.connected) {
      throw new Error('Peer not connected');
    }

    // Actualizar lastSeen
    peer.lastSeen = Date.now();

    // Emitir evento de mensaje enviado
    this.emit('message:sent', {
      to: peerId,
      message,
      timestamp: Date.now()
    });

    // En implementación real, enviar por socket/WebRTC
    return true;
  }

  // Recibir mensaje (callback)
  receive(peerId, message) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = Date.now();
    }

    this.emit('message:received', {
      from: peerId,
      message,
      timestamp: Date.now()
    });
  }

  // Broadcast a todos los peers
  broadcast(message) {
    const sent = [];
    for (const [peerId, peer] of this.peers) {
      if (peer.connected) {
        this.send(peerId, message);
        sent.push(peerId);
      }
    }
    return sent;
  }

  // Obtener peers conectados
  getConnectedPeers() {
    return Array.from(this.peers.values())
      .filter(p => p.connected);
  }

  // Estadísticas
  stats() {
    return {
      totalPeers: this.peers.size,
      connected: this.getConnectedPeers().length
    };
  }
}
