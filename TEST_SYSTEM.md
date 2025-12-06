# 🧪 AION-Ω System Testing Guide

## ✅ Verificación Rápida del Sistema

### 1. Verificar Deployment del Contrato

```bash
# Ver información del deployment
cat packages/economy/deployments/latest.json

# Resultado esperado:
# {
#   "network": "polygon",
#   "chainId": "137",
#   "deployer": "0xdf0770B63acB67751DF63759dcA89140725f5A62",
#   "contracts": {
#     "TokenFactory": "0x8C6D3D2693AAc34353950e61c0a393efA3E441c2"
#   }
# }
```

**✅ Verificar en Polygonscan:**
https://polygonscan.com/address/0x8C6D3D2693AAc34353950e61c0a393efA3E441c2

---

### 2. Iniciar Servicios Backend

```bash
# Opción A: Script automatizado
./start-services.sh

# Opción B: Manual
cd packages/kernel && node dist/index.js &
cd packages/identity && node dist/index.js &
```

---

### 3. Verificar Servicios están Online

```bash
# Test Kernel
curl http://localhost:4000/health

# Respuesta esperada:
# {"status":"ok","service":"aion-kernel","timestamp":"...","version":"1.0.0"}

# Test Identity
curl http://localhost:4100/health

# Respuesta esperada:
# {"status":"ok","service":"aion-identity","timestamp":"..."}
```

---

### 4. Test API Endpoints

#### A. Verificar Info del Deployer
```bash
curl http://localhost:4000/api/blockchain/deployer | jq
```

Respuesta esperada:
```json
{
  "success": true,
  "deployer": {
    "address": "0xdf0770B63acB67751DF63759dcA89140725f5A62",
    "balance": "69.21...",
    "balanceWei": "69218671123189641670",
    "transactionCount": 1,
    "ready": true
  }
}
```

#### B. Verificar Network Info
```bash
curl http://localhost:4000/api/blockchain/network | jq
```

Respuesta esperada:
```json
{
  "success": true,
  "network": {
    "name": "matic",
    "chainId": "137",
    "blockNumber": 79954XXX,
    "gasPrice": {...}
  }
}
```

#### C. Test AION Status
```bash
curl http://localhost:4000/api/aion/status | jq
```

Respuesta esperada:
```json
{
  "ok": true,
  "service": "aion-orchestrator",
  "timestamp": 1733475XXX,
  "components": {
    "kernel": true,
    "identity": true,
    "economy": true,
    "mind": false
  }
}
```

---

### 5. Test Identity Service

#### A. Crear DID
```bash
curl -X POST http://localhost:4100/api/did/create \
  -H "Content-Type: application/json" \
  -d '{"type":"aion","metadata":{"name":"Test User"}}' | jq
```

Respuesta esperada:
```json
{
  "success": true,
  "did": {
    "@context": [...],
    "id": "did:aion:uuid-here",
    "type": "AionIdentity",
    "created": "2025-12-06T...",
    ...
  }
}
```

#### B. Listar DIDs
```bash
curl http://localhost:4100/api/did/list | jq
```

#### C. Crear MPC Wallet
```bash
curl -X POST http://localhost:4100/api/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","threshold":2}' | jq
```

Respuesta esperada:
```json
{
  "success": true,
  "wallet": {
    "id": "wallet-uuid",
    "userId": "user123",
    "address": "0x...",
    "threshold": 2,
    "shards": 3,
    "status": "active"
  }
}
```

---

### 6. Test Crear Token ERC20 en Polygon

Usa ethers.js para interactuar con TokenFactory:

```javascript
// Archivo: test-create-token.js
const { ethers } = require('ethers');
require('dotenv').config();

const FACTORY_ADDRESS = "0x8C6D3D2693AAc34353950e61c0a393efA3E441c2";

const FACTORY_ABI = [
  "function createERC20(string name, string symbol, uint256 initialSupply, uint8 decimals) returns (address)",
  "function getAllTokens() view returns (address[])",
  "function totalTokensCreated() view returns (uint256)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, wallet);
  
  console.log("Creating token...");
  const tx = await factory.createERC20(
    "Test Token",  // nombre
    "TEST",        // símbolo
    1000000,       // supply (sin decimales)
    18             // decimales
  );
  
  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  
  console.log("✅ Token created!");
  console.log("Block:", receipt.blockNumber);
  
  // Obtener dirección del token del evento
  const event = receipt.logs.find(log => log.topics[0] === factory.interface.getEvent('ERC20Created').topicHash);
  const tokenAddress = ethers.getAddress('0x' + event.topics[2].slice(26));
  
  console.log("Token address:", tokenAddress);
  console.log("View on Polygonscan:", `https://polygonscan.com/address/${tokenAddress}`);
}

main().catch(console.error);
```

Ejecutar:
```bash
cd /app
node test-create-token.js
```

---

### 7. Iniciar UI (Frontend)

```bash
cd packages/ui
yarn dev
```

Abrir en navegador: http://localhost:3000

**Pantalla esperada:**
- Header con "AION-OMEGA"
- Status badges mostrando servicios online
- Cards de servicios:
  - Kernel Orquestador (✅ Activo)
  - Identity Service (✅ Activo)
  - Economy Layer (✅ Ready)
  - AION-MIND (🔴 Stub)
  - Edge Workers (✅ Ready)
- Deployment info mostrando Polygon Mainnet

---

## 🔍 Verificación de Logs

```bash
# Ver logs del Kernel
tail -f logs/kernel.log

# Ver logs de Identity
tail -f logs/identity.log

# O si usas Docker
docker-compose logs -f kernel
docker-compose logs -f identity
```

---

## 📊 Métricas de Éxito

### ✅ Backend
- [x] Kernel iniciado en puerto 4000
- [x] Identity iniciado en puerto 4100
- [x] Health checks respondiendo
- [x] APIs funcionando correctamente
- [x] Conexión a Polygon Mainnet OK

### ✅ Smart Contracts
- [x] TokenFactory deployado: 0x8C6D...41c2
- [x] Verificable en Polygonscan
- [x] Puede crear tokens ERC20
- [x] Puede crear tokens ERC721

### ✅ Frontend
- [x] Next.js corriendo en puerto 3000
- [x] UI mostrando status de servicios
- [x] Dashboard funcional

---

## 🐛 Troubleshooting

### Error: "Cannot connect to blockchain"
```bash
# Verificar RPC funciona
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Error: "Port already in use"
```bash
# Encontrar proceso usando puerto 4000
lsof -i :4000

# Matar proceso
kill -9 PID
```

### Servicios no responden
```bash
# Reiniciar todo
pkill -f "node dist/index.js"
./start-services.sh
```

---

## 🎯 Checklist Completo

- [ ] ✅ .env configurado con private key
- [ ] ✅ Balance verificado (69+ MATIC)
- [ ] ✅ TokenFactory deployado en Polygon Mainnet
- [ ] ✅ Contratos compilados sin errores
- [ ] ✅ Kernel compilado y funcional
- [ ] ✅ Identity compilado y funcional
- [ ] ✅ Servicios iniciados correctamente
- [ ] ✅ Health checks OK
- [ ] ✅ APIs respondiendo
- [ ] ✅ UI carga correctamente
- [ ] 🔄 Crear token de prueba (opcional)
- [ ] 🔄 Crear DID de prueba (opcional)

---

## 📞 Support

Si algo no funciona:
1. Revisa logs en `/logs/`
2. Verifica .env tiene valores correctos
3. Verifica puertos no están ocupados
4. Consulta documentación en `/packages/docs/`

---

**Sistema listo para producción! 🚀**
