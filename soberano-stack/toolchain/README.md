# Toolchain Soberano

## Compilador Local

Usa `solc` en modo WASM para compilar sin depender de servicios externos.

### Descargar compilador oficial

```bash
cd toolchain/solc-wasm
wget https://binaries.soliditylang.org/wasm/soljson-v0.8.20+commit.a1b79de6.js
mv soljson-v0.8.20+commit.a1b79de6.js solc.wasm
```

### Verificar integridad

```bash
./toolchain/verify-compiler.sh
```

### Compilar contratos

```bash
# Con Node.js
node toolchain/compile.js contracts/SoberanoERC20.sol

# O usa hardhat (ya configurado)
yarn compile
```

## Seguridad

- ✅ Compilador verificado con SHA256
- ✅ Sin conexión a internet necesaria
- ✅ Reproducible y determinista
