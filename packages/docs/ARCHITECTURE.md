# AION-Ω Architecture

## Overview

AION-Ω es una plataforma autónoma que combina infraestructura distribuida, economía blockchain, identidad descentralizada e inteligencia artificial.

## Componentes

### 1. Kernel (Orquestador)
- **Puerto**: 4000
- **Tecnología**: Node.js + TypeScript + Express
- **Responsabilidades**:
  - Orquestación de tareas
  - Gestión de estado
  - API central
  - Integración con blockchain

### 2. Identity Service
- **Puerto**: 4100
- **Tecnología**: Node.js + TypeScript
- **Responsabilidades**:
  - Creación y resolución de DIDs
  - MPC Wallets (Multi-Party Computation)
  - Gestión de identidades

### 3. Economy Layer
- **Tecnología**: Solidity + Hardhat + OpenZeppelin
- **Network**: Polygon Mainnet (Chain ID: 137)
- **Contratos**:
  - TokenFactory: Creación de ERC20/ERC721
  - AionERC20: Tokens fungibles
  - AionERC721: NFTs

### 4. Edge Workers
- **Tecnología**: Cloudflare Workers compatible
- **Responsabilidades**:
  - Caché distribuido
  - Rate limiting
  - Edge computing
  - Routing inteligente

### 5. AION-MIND (IA)
- **Estado**: Stub / En desarrollo
- **Integraciones planeadas**:
  - Emergent LLM Key (OpenAI/Anthropic/Gemini)
  - Modelos locales (llama.cpp)
- **Responsabilidades**:
  - Procesamiento de IA
  - Toma de decisiones
  - Orquestación inteligente

### 6. UI (Frontend)
- **Tecnología**: Next.js 14 + React 18 + Tailwind CSS
- **Puerto**: 3000
- **Características**:
  - Panel administrativo
  - Monitoreo de servicios
  - Interacción con blockchain
  - Gestión de identidades

## Flujo de Datos

```
[Usuario] → [UI (Next.js)]
    ↓
[Edge Worker] → [Kernel]
    ↓
[┌─────────────────┐
 │ Identity Service  │
 │ Economy Layer     │
 │ AION-MIND        │
 └─────────────────┘
    ↓
[Polygon Mainnet]
```

## Seguridad

### Secrets Management
- Variables sensibles en .env (git-ignored)
- Kubernetes Secrets para producción
- Hardware Security Modules (HSM) recomendado

### Blockchain Security
- Contratos auditados antes de mainnet
- OpenZeppelin para implementaciones seguras
- Rate limiting en APIs
- MPC para wallets críticas

## Escalabilidad

### Horizontal
- Múltiples réplicas de servicios (Kubernetes)
- Load balancing
- Edge workers distribuidos

### Vertical
- Resource limits configurables
- Auto-scaling en Kubernetes

## Monitoreo

- Health checks en todos los servicios
- Logs centralizados
- Métricas de performance
- Alertas automáticas

## Deployment

### Local Development
```bash
docker-compose up
```

### Production (Kubernetes)
```bash
kubectl apply -f packages/ops/k8s/
```

### Infrastructure (Terraform)
```bash
cd packages/ops/terraform
terraform apply
```
