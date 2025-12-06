/**
 * K-Bucket para DHT (Kademlia-style)
 * Estructura de datos para peers en DHT
 */

export class KBucket {
  constructor(k = 20) {
    this.k = k; // Tamaño máximo del bucket
    this.peers = [];
  }

  add(peer) {
    // Verificar si el peer ya existe
    const index = this.peers.findIndex(p => p.id === peer.id);
    
    if (index !== -1) {
      // Mover al final (LRU)
      this.peers.splice(index, 1);
      this.peers.push(peer);
      return true;
    }
    
    // Si hay espacio, agregar
    if (this.peers.length < this.k) {
      this.peers.push(peer);
      return true;
    }
    
    // Bucket lleno - implementar lógica de reemplazo
    return false;
  }

  remove(peerId) {
    const index = this.peers.findIndex(p => p.id === peerId);
    if (index !== -1) {
      this.peers.splice(index, 1);
      return true;
    }
    return false;
  }

  has(peerId) {
    return this.peers.some(p => p.id === peerId);
  }

  getAll() {
    return [...this.peers];
  }

  getClosest(targetId, count = this.k) {
    // Ordenar por distancia XOR (simplificado)
    return this.peers
      .map(p => ({
        peer: p,
        distance: this.xorDistance(p.id, targetId)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count)
      .map(item => item.peer);
  }

  xorDistance(id1, id2) {
    // Distancia XOR simplificada
    let distance = 0;
    for (let i = 0; i < Math.min(id1.length, id2.length); i++) {
      distance += (id1.charCodeAt(i) ^ id2.charCodeAt(i));
    }
    return distance;
  }

  size() {
    return this.peers.length;
  }

  isFull() {
    return this.peers.length >= this.k;
  }
}
