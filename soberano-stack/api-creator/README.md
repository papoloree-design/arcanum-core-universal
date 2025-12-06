# 🌐 SOBERANO GLOBAL API CREATOR

## Overview

Sistema universal para crear APIs de cualquier categoría de forma dinámica y soberana.

## Características

- ✅ Creación dinámica de APIs
- ✅ Múltiples categorías
- ✅ Middleware support
- ✅ Rate limiting
- ✅ Authentication
- ✅ Integración con todo el ecosistema
- ✅ Sin dependencias externas

## Uso Rápido

### Crear API

```javascript
import { globalAPI } from './api-creator/global-api-engine.js';

// Crear Weather API
await globalAPI.createAPI({
  name: 'weather',
  category: 'global',
  method: 'GET',
  description: 'Get weather data',
  handler: async ({ city }) => {
    // Tu lógica aquí
    return { city, temp: '20°C' };
  }
});

// Usar API
const result = await globalAPI.handleRequest('global/weather', {
  city: 'London'
});
```

## APIs Pre-instaladas

### Wallet
- `wallet/create` - Crear wallet
- `wallet/sign` - Firmar mensaje
- `wallet/list` - Listar wallets

### Bridge
- `bridge/transfer` - Transfer tokens
- `bridge/status` - Ver estado
- `bridge/history` - Historial
- `bridge/stats` - Estadísticas

### Storage
- `storage/put` - Guardar datos
- `storage/get` - Obtener datos
- `storage/stats` - Estadísticas

### Mining
- `mining/price` - Precio crypto
- `mining/balance` - Balance address
- `mining/custom` - Fuente custom
- `mining/stats` - Estadísticas

### Factory
- `factory/deploy` - Deploy token
- `factory/list` - Listar tokens

### DID
- `did/generate` - Generar DID
- `did/register` - Registrar DID
- `did/resolve` - Resolver DID

### Utility
- `util/encrypt` - Encriptar
- `util/decrypt` - Desencriptar
- `util/hash` - Hash SHA256

### System
- `system/status` - Estado del sistema
- `system/apis` - Listar APIs

### Global
- `global/createAPI` - Crear API dinámica

## Ejemplos

### Weather API

```javascript
await globalAPI.createAPI({
  name: 'weather',
  category: 'global',
  handler: async ({ city }) => {
    return { city, temp: '20°C' };
  }
});

const weather = await globalAPI.handleRequest('global/weather', {
  city: 'Paris'
});
```

### Calculator API

```javascript
await globalAPI.createAPI({
  name: 'calculator',
  category: 'utility',
  handler: async ({ operation, a, b }) => {
    const ops = {
      add: (x, y) => x + y,
      multiply: (x, y) => x * y
    };
    return { result: ops[operation](a, b) };
  }
});
```

### GitHub Stats API

```javascript
await globalAPI.createAPI({
  name: 'github',
  category: 'developer',
  handler: async ({ owner, repo }) => {
    const data = await fetchData(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    return {
      stars: data.stargazers_count,
      forks: data.forks_count
    };
  }
});
```

## Middleware

```javascript
globalAPI.use(async (context) => {
  console.log('Request:', context.path);
  return context;
});
```

## Authentication

```javascript
await globalAPI.createAPI({
  name: 'protected',
  category: 'api',
  auth: true,
  handler: async (data, options) => {
    // Requiere options.authenticated = true
    return { secret: 'data' };
  }
});
```

## Rate Limiting

```javascript
await globalAPI.createAPI({
  name: 'limited',
  category: 'api',
  rateLimit: { requests: 10, window: 60000 }, // 10 req/min
  handler: async (data) => {
    return { data };
  }
});
```

## Ejecutar Ejemplos

```bash
node api-creator/examples.js
```

## Integración Completa

```javascript
import { globalAPI } from './api-creator/global-api-engine.js';

// Wallet
const wallet = await globalAPI.handleRequest('wallet/create', {
  name: 'My Wallet',
  password: 'secret'
});

// Bridge
const bridge = await globalAPI.handleRequest('bridge/transfer', {
  token: '0x...',
  fromChain: 'polygon',
  toChain: 'sovereign',
  addressFrom: wallet.address,
  addressTo: wallet.address,
  amount: '100'
});

// Mining
const price = await globalAPI.handleRequest('mining/price', {
  coin: 'bitcoin'
});

// Storage
await globalAPI.handleRequest('storage/put', {
  key: 'mydata',
  value: { important: true }
});

// DID
const did = await globalAPI.handleRequest('did/generate', {
  publicKey: '0x123...'
});
```

## Categorías Soportadas

- `wallet` - Wallet operations
- `bridge` - Bridge operations
- `storage` - Storage operations
- `mining` - Mining operations
- `factory` - Token factory
- `did` - Identity operations
- `util` - Utilities
- `system` - System operations
- `global` - Global APIs
- `finance` - Financial APIs
- `developer` - Developer tools
- `nlp` - Natural language
- `utility` - General utilities
- `custom` - Custom category

## Export Config

```javascript
const config = globalAPI.exportConfig();
globalAPI.saveConfig('my-config.json');
```

## Listar APIs

```javascript
// Todas
const all = await globalAPI.handleRequest('system/apis');

// Por categoría
const walletAPIs = await globalAPI.handleRequest('system/apis', {
  category: 'wallet'
});
```

## Features Avanzados

- ✅ Dynamic API creation
- ✅ Middleware pipeline
- ✅ Rate limiting
- ✅ Authentication
- ✅ Encryption/Decryption
- ✅ Logging
- ✅ Error handling
- ✅ Config export/import

---

**API Creator 100% Soberano | Sin Límites | Producción-Ready**
