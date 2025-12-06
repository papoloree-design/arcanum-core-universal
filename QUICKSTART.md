# AION-Ω Quickstart Guide

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# IMPORTANTE: Editar .env con tus valores reales
vim .env  # o nano .env
```

**Variables críticas a configurar:**

```env
# Tu private key (sin espacios, con o sin 0x)
DEPLOYER_PRIVATE_KEY=tu_private_key_aqui

# RPC de Polygon (usa Alchemy o Infura para producción)
POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/TU_API_KEY

# API de Polygonscan (para verificar contratos)
POLYGONSCAN_API_KEY=tu_api_key
```

### 2. Instalar Dependencias

```bash
# Root
yarn install

# Packages individuales
cd packages/kernel && yarn install && cd ../..
cd packages/identity && yarn install && cd ../..
cd packages/economy && yarn install && cd ../..
cd packages/ui && yarn install && cd ../..
```

### 3. Compilar Contratos Solidity

```bash
cd packages/economy
npx hardhat compile
cd ../..
```

### 4. Verificar Balance de Deployer

Antes de deployar a mainnet:

```bash
cd packages/kernel
node -e "const {ethers} = require('ethers'); const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || 'https://polygon-rpc.com'); const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider); provider.getBalance(wallet.address).then(b => console.log('Balance:', ethers.formatEther(b), 'MATIC'));"
```

Necesitas al menos **0.5 MATIC** para gas.

### 5. Deploy a Polygon Mainnet

```bash
cd packages/economy
npx hardhat run scripts/deploy.js --network polygon
```

El script:
- Desplegará TokenFactory
- Verificará en Polygonscan (si tienes API key)
- Guardará info en `deployments/`

### 6. Iniciar Servicios Localmente

#### Opción A: Docker Compose (recomendado)

```bash
docker-compose up -d
```

#### Opción B: Manual (desarrollo)

```bash
# Terminal 1: Kernel
cd packages/kernel
yarn dev

# Terminal 2: Identity
cd packages/identity
yarn dev

# Terminal 3: UI
cd packages/ui
yarn dev
```

### 7. Acceder a la UI

Navegador: http://localhost:3000

## 📊 Verificar Servicios

```bash
# Kernel
curl http://localhost:4000/health

# Identity
curl http://localhost:4100/health

# Deployer info
curl http://localhost:4000/api/blockchain/deployer

# Network info
curl http://localhost:4000/api/blockchain/network
```

## 📝 Logs

```bash
# Docker
docker-compose logs -f

# Kubernetes
kubectl logs -f deployment/aion-kernel -n aion-omega
```

## ⚠️ Troubleshooting

### Error: "insufficient funds"
Necesitas más MATIC en la wallet deployer.

### Error: "invalid private key"
Verifica que DEPLOYER_PRIVATE_KEY en .env sea correcto (sin espacios).

### Servicios no conectan
Verifica que los puertos 4000, 4100, 3000 estén libres.

### Contratos no verifican en Polygonscan
```bash
npx hardhat verify --network polygon CONTRACT_ADDRESS
```

## 🛡️ Seguridad

- NUNCA subas .env al repositorio
- NUNCA compartas tu private key
- Usa hardware wallet para fondos grandes
- Audita contratos antes de mainnet real

## 📚 Siguiente Pasos

1. Revisar documentación en `/packages/docs/`
2. Configurar CI/CD (GitHub Actions)
3. Desplegar a Kubernetes para producción
4. Implementar AION-MIND (IA)
5. Configurar monitoreo y alertas

---

**Wallet Deployer**: 0xdf0770B63acB67751DF63759dcA89140725f5A62
**Network**: Polygon Mainnet (Chain ID: 137)
**Status**: ✅ Listo para Producción
