# Storage P2P Soberano

Almacenamiento distribuido peer-to-peer sin servidores centrales.

## Componentes

### DHT Node
Distributed Hash Table para almacenar datos distribuidos.

```javascript
import { DHTNode } from './storage/dht-node.js';

const node = new DHTNode();

// Almacenar
node.put('mi-key', { dato: 'importante' });

// Obtener
const valor = node.get('mi-key');

// Agregar peer
node.addPeer({
  id: 'peer-id-123',
  address: '192.168.1.100:5000'
});

// Stats
console.log(node.stats());
```

### K-Bucket
Estructura de datos para routing en DHT.

```javascript
import { KBucket } from './storage/kbucket.js';

const bucket = new KBucket(20);
bucket.add({ id: 'peer1', address: '...' });
```

### Pinning
Mantener datos importantes permanentemente.

```javascript
import { PinningManager } from './storage/pinning.js';

const pins = new PinningManager();
pins.pin('hash-importante', { type: 'contract' });
```

## Ventajas

- ✅ Descentralizado
- ✅ Resistente a censura
- ✅ Sin single point of failure
- ✅ P2P real
