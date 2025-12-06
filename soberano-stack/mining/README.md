# Mining de Datos Públicos

Minería de fuentes de datos públicas permitidas.

## Características

- ✅ Ingesta de APIs públicas
- ✅ Cache inteligente
- ✅ Procesamiento de datos
- ✅ Storage local
- ✅ Estadísticas

## Fuentes Soportadas

- **CoinGecko**: Precios de crypto
- **Polygonscan**: Datos de blockchain
- **BlockCypher**: Network stats
- **GitHub**: Repositorios públicos
- **Custom**: URLs personalizadas

## Uso

### Ingestar Precio

```javascript
import { MiningProcessor } from './mining/mining-processor.js';

const miner = new MiningProcessor();

// Precio de Bitcoin
const btcPrice = await miner.processCryptoPrice('bitcoin');
console.log('BTC Price:', btcPrice.price);

// Precio de Polygon
const maticPrice = await miner.processCryptoPrice('matic-network');
```

### Ingestar Balance

```javascript
// Balance de address en Polygon
const balance = await miner.processAddressBalance(
  '0xdf0770B63acB67751DF63759dcA89140725f5A62',
  'YOUR_POLYGONSCAN_API_KEY'
);
```

### Fuente Custom

```javascript
// Cualquier fuente pública
const data = await miner.process(
  'my-source',
  'https://api.example.com/data',
  (data) => {
    // Parser custom
    return {
      processed: data.value,
      timestamp: Date.now()
    };
  }
);
```

### Ver Estadísticas

```javascript
const stats = miner.getStats();
console.log('Total Processed:', stats.totalProcessed);
console.log('By Source:', stats.bySource);
```

### Limpiar Datos Antiguos

```javascript
// Limpiar datos de más de 24 horas
miner.cleanup(86400000);
```

## Cache

- TTL por defecto: 5 minutos
- Cache automático en memoria
- Persistencia en disco

## Limitaciones

- Respeta rate limits de APIs
- Solo fuentes públicas permitidas
- No minea datos privados
- Requiere API keys para algunas fuentes

## Ejemplos de APIs Públicas

```
CoinGecko: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
Polygonscan: https://api.polygonscan.com/api?module=account&action=balance&address=0x...
GitHub: https://api.github.com/repos/owner/repo
```
