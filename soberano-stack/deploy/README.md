# SOBERANO STACK - Deploy Scripts

## Scripts sin dependencias externas

Estos scripts usan **solo bash + curl + node** (para firma criptoáfica).

### Deploy TokenFactory

```bash
./deploy-factory.sh <RPC_URL> <PRIVATE_KEY>
```

**Ejemplo:**
```bash
./deploy-factory.sh https://polygon-rpc.com 0xTU_PRIVATE_KEY
```

### Deploy Token Genérico

```bash
./deploy-token.sh <BYTECODE_FILE> <RPC_URL> <PRIVATE_KEY>
```

**Ejemplo:**
```bash
./deploy-token.sh bytecodes/SoberanoERC20.bin https://polygon-rpc.com 0xTU_KEY
```

## Dependencias Mínimas

- `bash` (shell)
- `curl` (HTTP requests)
- `node` (solo para firma cripto)
- `ethers.js` (solo para firma)

## Alternativa: Deploy vía Factory

Más eficiente - usa el TokenFactory ya desplegado:

```bash
# Ver deploy/via-factory.js
```

## Verificación

Todos los contratos son verificables en Polygonscan manualmente.
