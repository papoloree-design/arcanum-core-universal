import { KBucket } from './kbucket.js';
import fs from 'fs';
import crypto from 'crypto';

/**
 * DHT Node - Distributed Hash Table
 * Almacenamiento distribuido P2P
 */
export class DHTNode {
  constructor(persistFile = 'storage/persist.db') {
    this.id = this.generateNodeId();
    this.bucket = new KBucket();
    this.store = this.loadStore(persistFile);
    this.persistFile = persistFile;
  }

  generateNodeId() {
    return crypto.randomBytes(20).toString('hex');
  }

  loadStore(file) {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return {};
  }

  saveStore() {
    fs.writeFileSync(this.persistFile, JSON.stringify(this.store, null, 2));
  }

  // Almacenar key-value
  put(key, value) {
    const hash = this.hash(key);
    this.store[hash] = {
      key,
      value,
      timestamp: Date.now(),
      node: this.id
    };
    this.saveStore();
    return hash;
  }

  // Obtener value
  get(key) {
    const hash = this.hash(key);
    const entry = this.store[hash];
    return entry ? entry.value : null;
  }

  // Eliminar key
  delete(key) {
    const hash = this.hash(key);
    if (this.store[hash]) {
      delete this.store[hash];
      this.saveStore();
      return true;
    }
    return false;
  }

  // Hash de key
  hash(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  // Agregar peer
  addPeer(peer) {
    if (!peer.id || !peer.address) {
      throw new Error('Invalid peer: needs id and address');
    }
    return this.bucket.add(peer);
  }

  // Remover peer
  removePeer(peerId) {
    return this.bucket.remove(peerId);
  }

  // Obtener peers
  peers() {
    return this.bucket.getAll();
  }

  // Encontrar peers cercanos a una key
  findNode(targetId, count = 3) {
    return this.bucket.getClosest(targetId, count);
  }

  // Listar todas las keys
  keys() {
    return Object.keys(this.store);
  }

  // Estadísticas
  stats() {
    return {
      nodeId: this.id,
      peers: this.bucket.size(),
      stored: this.keys().length,
      bucketFull: this.bucket.isFull()
    };
  }
}
