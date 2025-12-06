# AION-Ω API Documentation

## Kernel API (Port 4000)

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "aion-kernel",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### AION Status
```
GET /api/aion/status
```

Response:
```json
{
  "ok": true,
  "service": "aion-orchestrator",
  "timestamp": 1704067200000,
  "components": {
    "kernel": true,
    "identity": true,
    "economy": true,
    "mind": false
  }
}
```

### Create Task
```
POST /api/aion/task
Content-Type: application/json

{
  "type": "deploy_token",
  "payload": {
    "name": "MyToken",
    "symbol": "MTK",
    "supply": 1000000
  }
}
```

Response:
```json
{
  "success": true,
  "taskId": "uuid-here",
  "status": "pending",
  "message": "Task accepted and processing"
}
```

### Get Task Status
```
GET /api/aion/task/:taskId
```

### Blockchain - Network Info
```
GET /api/blockchain/network
```

Response:
```json
{
  "success": true,
  "network": {
    "name": "matic",
    "chainId": "137",
    "blockNumber": 50000000,
    "gasPrice": {
      "maxFeePerGas": "30000000000",
      "maxPriorityFeePerGas": "30000000000"
    }
  }
}
```

### Blockchain - Get Balance
```
GET /api/blockchain/balance/:address
```

### Blockchain - Deployer Info
```
GET /api/blockchain/deployer
```

Response:
```json
{
  "success": true,
  "deployer": {
    "address": "0xdf0770B63acB67751DF63759dcA89140725f5A62",
    "balance": "1.5",
    "balanceWei": "1500000000000000000",
    "transactionCount": 42,
    "ready": true
  }
}
```

## Identity API (Port 4100)

### Create DID
```
POST /api/did/create
Content-Type: application/json

{
  "type": "aion",
  "metadata": {
    "name": "User Name"
  }
}
```

Response:
```json
{
  "success": true,
  "did": {
    "@context": [...],
    "id": "did:aion:uuid",
    "type": "AionIdentity",
    "created": "2025-01-01T00:00:00.000Z",
    "updated": "2025-01-01T00:00:00.000Z",
    "publicKey": [],
    "authentication": [],
    "service": []
  }
}
```

### Resolve DID
```
GET /api/did/resolve/:did
```

### List DIDs
```
GET /api/did/list
```

### Create MPC Wallet
```
POST /api/wallet/create
Content-Type: application/json

{
  "userId": "user-123",
  "threshold": 2
}
```

Response:
```json
{
  "success": true,
  "wallet": {
    "id": "wallet-uuid",
    "userId": "user-123",
    "address": "0x...",
    "threshold": 2,
    "shards": 3,
    "created": "2025-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

### Get Wallet
```
GET /api/wallet/:walletId
```

## Rate Limits

- **Development**: Sin límite
- **Production**: 100 req/min por IP
- **Authenticated**: 1000 req/min

## Authentication

Actualmente sin autenticación. Para producción implementar:
- JWT tokens
- API keys
- OAuth 2.0

## Error Responses

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

Status Codes:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
