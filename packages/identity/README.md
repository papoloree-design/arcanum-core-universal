# AION Identity Service

Servicio de identidad descentralizada (DID) y wallets MPC para AION-Ω.

## Características

- **DID (Decentralized Identifiers)**: Creación y resolución de identidades descentralizadas
- **MPC Wallets**: Wallets multi-firma con threshold signatures (stub)
- **API RESTful**: Endpoints para gestión de identidades

## API Endpoints

### DID Management

```bash
# Crear DID
POST /api/did/create
Body: { "type": "aion", "metadata": {} }

# Resolver DID
GET /api/did/resolve/:did

# Listar DIDs
GET /api/did/list
```

### Wallet Management

```bash
# Crear MPC Wallet
POST /api/wallet/create
Body: { "userId": "user123", "threshold": 2 }

# Obtener Wallet
GET /api/wallet/:walletId
```

## Producción
⚠️ **IMPORTANTE**: La implementación actual de MPC es un stub.

Para producción real, integrar:
- **Fireblocks MPC**: https://www.fireblocks.com/
- **Zengo Wallet SDK**: https://zengo.com/
- **TSS Libraries**: tss-lib, multi-party-ecdsa
- **HSM**: AWS CloudHSM, Azure Key Vault HSM

## Desarrollo

```bash
yarn install
yarn dev
```

## Docker

```bash
docker build -t aion-identity .
docker run -p 4100:4100 aion-identity
```
