/**
 * Sistema de mensajería P2P
 * Tipos de mensajes y protocolo
 */

export const MessageType = {
  PING: 'ping',
  PONG: 'pong',
  FIND_NODE: 'find_node',
  FIND_VALUE: 'find_value',
  STORE: 'store',
  DATA: 'data',
  ERROR: 'error'
};

export class Message {
  constructor(type, payload, sender = null) {
    this.id = this.generateId();
    this.type = type;
    this.payload = payload;
    this.sender = sender;
    this.timestamp = Date.now();
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      type: this.type,
      payload: this.payload,
      sender: this.sender,
      timestamp: this.timestamp
    });
  }

  static deserialize(data) {
    const obj = JSON.parse(data);
    const msg = new Message(obj.type, obj.payload, obj.sender);
    msg.id = obj.id;
    msg.timestamp = obj.timestamp;
    return msg;
  }
}

// Crear mensajes específicos
export function createPingMessage(sender) {
  return new Message(MessageType.PING, { time: Date.now() }, sender);
}

export function createPongMessage(sender, pingId) {
  return new Message(MessageType.PONG, { pingId, time: Date.now() }, sender);
}

export function createFindNodeMessage(sender, targetId) {
  return new Message(MessageType.FIND_NODE, { targetId }, sender);
}

export function createStoreMessage(sender, key, value) {
  return new Message(MessageType.STORE, { key, value }, sender);
}

export function createDataMessage(sender, data) {
  return new Message(MessageType.DATA, data, sender);
}

export function createErrorMessage(sender, error) {
  return new Message(MessageType.ERROR, { error: error.message }, sender);
}
