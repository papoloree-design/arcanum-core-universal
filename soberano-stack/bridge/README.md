# CoinFactory Bridge

Bridge soberano para mover tokens entre Polygon y Sovereign Chain.

## Características

- ✅ Bridge entre cadenas
- ✅ Confirmaciones on-chain
- ✅ Cálculo de fees
- ✅ Historial de transferencias
- ✅ Tracking en tiempo real
- ✅ Sin intermediarios centralizados

## Uso

### Iniciar Bridge

```bash
./bridge/bridge-cli.sh bridge \
  0x8C6D3D2693AAc34353950e61c0a393efA3E441c2 \
  polygon \
  sovereign \
  0xdf0770B63acB67751DF63759dcA89140725f5A62 \
  0xdf0770B63acB67751DF63759dcA89140725f5A62 \
  100
```

### Ver Estado

```bash
./bridge/bridge-cli.sh status bridge-abc123...
```

### Ver Historial

```bash
./bridge/bridge-cli.sh history 0xdf0770...
```

### Calcular Fees

```bash
./bridge/bridge-cli.sh fees 100 polygon sovereign
```

### Estadísticas

```bash
./bridge/bridge-cli.sh stats
```

## Programático

```javascript
import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';

const bridge = new CoinfactoryBridge();

// Iniciar bridge
const transferId = bridge.bridgeToken(
  '0x123...', // token
  'polygon',  // from
  'sovereign', // to
  '0xabc...', // from address
  '0xdef...', // to address
  '100'       // amount
);

// Ver status
const status = bridge.getTransferStatus(transferId);
console.log('Progress:', status.progress + '%');

// Historial
const history = bridge.getHistory('0xabc...');
```

## Fees

- **Base Fee**: 0.1%
- **Cross-Chain Fee**: 0.2% (si from ≠ to)
- **Total**: 0.1% - 0.3%

## Confirmaciones

- **Polygon**: 12 confirmaciones
- **Sovereign**: 6 confirmaciones
- Tiempo estimado: 24-48 segundos
