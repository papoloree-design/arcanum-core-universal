# AION-Ω Deployment Guide

## Prerequisitos

- Node.js >= 18
- Docker & Docker Compose
- Kubernetes cluster (para producción)
- Polygon Mainnet wallet con MATIC

## Deployment Local

### 1. Configurar Variables de Entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Instalar Dependencias

```bash
yarn install

# Para cada package
cd packages/kernel && yarn install
cd packages/identity && yarn install
cd packages/economy && yarn install
cd packages/ui && yarn install
```

### 3. Compilar Contratos

```bash
cd packages/economy
npx hardhat compile
```

### 4. Iniciar Servicios

```bash
# Con Docker Compose
docker-compose up -d

# O manualmente
cd packages/kernel && yarn dev &
cd packages/identity && yarn dev &
cd packages/ui && yarn dev &
```

## Deployment a Polygon Mainnet

### 1. Verificar Balance

Asegúrate de tener suficiente MATIC en la wallet deployer:
- Mínimo: 0.5 MATIC
- Recomendado: 2+ MATIC

### 2. Desplegar TokenFactory

```bash
cd packages/economy
npx hardhat run scripts/deploy.js --network polygon
```

### 3. Verificar en Polygonscan

El script automáticamente intentará verificar el contrato.

Manual:
```bash
npx hardhat verify --network polygon CONTRACT_ADDRESS
```

## Deployment a Kubernetes

### 1. Build Docker Images

```bash
# Kernel
cd packages/kernel
docker build -t YOUR_REGISTRY/aion-kernel:latest .
docker push YOUR_REGISTRY/aion-kernel:latest

# Identity
cd packages/identity
docker build -t YOUR_REGISTRY/aion-identity:latest .
docker push YOUR_REGISTRY/aion-identity:latest

# UI
cd packages/ui
docker build -t YOUR_REGISTRY/aion-ui:latest .
docker push YOUR_REGISTRY/aion-ui:latest
```

### 2. Configurar Secrets

```bash
kubectl create namespace aion-omega

kubectl create secret generic aion-secrets \
  --from-literal=polygon-rpc='YOUR_RPC_URL' \
  --from-literal=deployer-key='YOUR_PRIVATE_KEY' \
  --namespace=aion-omega
```

### 3. Deploy a Kubernetes

```bash
kubectl apply -f packages/ops/k8s/namespace.yaml
kubectl apply -f packages/ops/k8s/deployment-kernel.yaml
kubectl apply -f packages/ops/k8s/deployment-identity.yaml
kubectl apply -f packages/ops/k8s/deployment-ui.yaml
kubectl apply -f packages/ops/k8s/ingress.yaml
```

### 4. Verificar Deployment

```bash
kubectl get pods -n aion-omega
kubectl get services -n aion-omega
kubectl logs -f deployment/aion-kernel -n aion-omega
```

## CI/CD con GitHub Actions

### 1. Configurar Secrets en GitHub

En tu repositorio: Settings → Secrets and variables → Actions

- `DEPLOYER_PRIVATE_KEY`
- `POLYGON_RPC`
- `POLYGONSCAN_API_KEY`
- `REGISTRY_URL`
- `REGISTRY_USERNAME`
- `REGISTRY_PASSWORD`

### 2. Push a Main

GitHub Actions automáticamente:
- Ejecutará tests
- Compilará contratos
- Buildeará imágenes Docker
- Las subirá al registry

### 3. Deploy Contratos (Manual)

Por seguridad, el deploy de contratos es manual:
- Ve a Actions → Deploy Contracts to Polygon
- Click "Run workflow"
- Selecciona red (polygon/mumbai)

## Troubleshooting

### Servicios no inician
```bash
docker-compose logs
kubectl logs -f pod/POD_NAME -n aion-omega
```

### Contratos fallan al deployar
- Verificar balance de MATIC
- Verificar RPC endpoint
- Verificar private key
- Revisar gas price

### Base de datos no conecta
- Verificar MongoDB corriendo
- Verificar MONGO_URL en .env
- Verificar network en docker-compose
