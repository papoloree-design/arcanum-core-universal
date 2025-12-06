# Nodo Ligero Soberano

Cliente ligero para blockchain sin necesidad de nodo completo.

## Características

- ✅ Sincroniza solo headers (ligero)
- ✅ Verifica Merkle proofs
- ✅ Valida integridad de datos
- ✅ Storage local (headers.db)

## Uso

```javascript
import { LightClient } from './node/light-client.js';

const client = new LightClient();

// Sincronizar headers
await client.sync();

// Obtener último header
const latest = client.getLatestHeader();

// Verificar proof
const isValid = client.verifyMerkleProof(proof, root, leaf);
```

## Merkle Proofs

```javascript
import { verifyMerkleProof, buildMerkleTree } from './node/verify-proof.js';

const leaves = ['data1', 'data2', 'data3'];
const tree = buildMerkleTree(leaves);

console.log('Root:', tree.root);
```

## Ventajas

- No requiere nodo completo (ahorra espacio)
- Verificación criptográfica
- Mínimo uso de bandwidth
- Perfecto para edge devices
