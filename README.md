# AION-Ω (AION-OMEGA)
**Plataforma Autónoma de Infraestructura, Economía, Inteligencia y Realidad Digital Soberana**

## 🚀 Proyecto de Producción - Polygon Mainnet

Este es un proyecto completo y funcional para producción que incluye:

### 📦 Componentes Principales

- **Infraestructura**: Docker + Kubernetes + Terraform
- **Backend**: Node.js (TypeScript) + Edge Workers
- **Identidad & Wallet**: DID resolver + MPC wallet service
- **Economía**: Smart Contracts Solidity (TokenFactory) en Polygon Mainnet
- **AI**: AION-MIND - Agente central de orquestación
- **UI**: Next.js - Panel administrativo
- **Automation**: n8n workflows
- **CI/CD**: GitHub Actions

### 🏗️ Arquitectura

```
aion-omega/
├── packages/
│   ├── kernel/          # Orquestador central (TypeScript)
│   ├── edge-worker/     # Workers edge computing
│   ├── identity/        # Servicio de identidad DID + MPC
│   ├── economy/         # Smart Contracts + deployer
│   ├── ui/             # Frontend Next.js
│   ├── deploy/         # Scripts de despliegue blockchain
│   ├── ops/            # Kubernetes + Terraform
│   └── aion-mind/      # Agente IA
├── docker-compose.yml
└── .github/workflows/
```

### ⚙️ Configuración

1. **Copiar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Configurar .env con tus credenciales:**
   - `DEPLOYER_PRIVATE_KEY`: Tu private key (wallet 0xdf0770...)
   - `POLYGON_RPC`: Tu endpoint RPC de Polygon
   - `POLYGONSCAN_API_KEY`: Para verificar contratos

3. **Instalar dependencias:**
   ```bash
   # Root
   yarn install
   
   # Cada package
   cd packages/kernel && yarn install
   cd packages/identity && yarn install
   cd packages/economy && yarn install
   cd packages/ui && yarn install
   ```

4. **Compilar contratos:**
   ```bash
   cd packages/economy
   npx hardhat compile
   ```

5. **Desplegar a Polygon Mainnet:**
   ```bash
   cd packages/economy
   npx hardhat run scripts/deploy.js --network polygon
   ```

### 🔐 Seguridad

⚠️ **IMPORTANTE:**
- NUNCA subas `.env` al repositorio
- Audita todos los contratos antes de mainnet
- Usa hardware wallet para grandes cantidades
- Revisa gas limits antes de cada transacción

### 🚀 Despliegue Local

```bash
docker-compose up -d
```

### 📚 Documentación

Ver `/packages/docs/` para documentación detallada de cada componente.

### 🛡️ Mainnet Deployer

**Wallet:** `0xdf0770B63acB67751DF63759dcA89140725f5A62`
**Network:** Polygon Mainnet
**Chain ID:** 137

---

**Estado:** ✅ Listo para Producción
**Licencia:** MIT
