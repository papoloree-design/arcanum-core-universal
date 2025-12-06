# P2P Soberano

Sistema de comunicación peer-to-peer sin servidores centrales.

## Componentes

### Encryption
Encriptación y firma de mensajes.

```javascript
import { genKeyPair, sign, verify } from './p2p/encryption.js';

const keys = genKeyPair();
const signature = sign(keys.privateKey, 'mensaje');
const valid = verify(keys.publicKey, 'mensaje', signature);
```

### Transport
Capa de transporte para conexiones P2P.

```javascript
import { Transport } from './p2p/transport.js';

const transport = new Transport();

// Conectar
transport.connect({ id: 'peer1', address: '192.168.1.100' });

// Enviar
transport.send('peer1', { type: 'hello' });

// Recibir
transport.on('message:received', (data) => {
  console.log('Mensaje de:', data.from);
});

// Broadcast
transport.broadcast({ type: 'announcement' });
```

### Messages
Protocolo de mensajes estandarizado.

```javascript
import { Message, MessageType } from './p2p/messages.js';

const msg = new Message(MessageType.PING, { time: Date.now() });
const serialized = msg.serialize();
const deserialized = Message.deserialize(serialized);
```

## Características

- ✅ Encriptación end-to-end
- ✅ Firmas digitales
- ✅ Sin servidores centrales
- ✅ Protocolo de mensajes flexible
- ✅ Broadcast a múltiples peers

## Casos de Uso

- Mensajería descentralizada
- Sincronización de datos
- Coordinación de red DHT
- Discovery de peers
