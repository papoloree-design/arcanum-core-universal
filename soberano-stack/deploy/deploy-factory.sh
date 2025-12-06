#!/bin/bash

# SOBERANO STACK - Deploy TokenFactory
# Uso: ./deploy-factory.sh <RPC_URL> <PRIVATE_KEY>

set -e

RPC="${1:-https://polygon-rpc.com}"
PRIVATE_KEY="$2"

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: Private key requerida"
    echo "Uso: $0 <RPC_URL> <PRIVATE_KEY>"
    exit 1
fi

echo "🚀 SOBERANO STACK - Deploy TokenFactory"
echo "======================================"
echo "RPC: $RPC"
echo ""

# Leer bytecode
BYTECODE_FILE="bytecodes/TokenFactory.bin"

if [ ! -f "$BYTECODE_FILE" ]; then
    echo "❌ Error: $BYTECODE_FILE no encontrado"
    echo "Ejecuta: yarn compile && yarn extract-bytecodes"
    exit 1
fi

BYTECODE=$(cat "$BYTECODE_FILE")
echo "✅ Bytecode cargado: ${#BYTECODE} caracteres"

# Obtener nonce
echo "🔢 Obteniendo nonce..."
ADDRESS=$(node -e "const ethers = require('ethers'); const w = new ethers.Wallet('$PRIVATE_KEY'); console.log(w.address);")
echo "   Dirección: $ADDRESS"

NONCE_HEX=$(curl -s -X POST "$RPC" \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["'"$ADDRESS"'","latest"],"id":1}' | \
  node -e "const d = require('fs').readFileSync(0,'utf8'); console.log(JSON.parse(d).result);")

NONCE=$(node -e "console.log(parseInt('$NONCE_HEX', 16));")
echo "   Nonce: $NONCE"

# Obtener gas price
echo "⛽ Obteniendo gas price..."
GAS_PRICE=$(curl -s -X POST "$RPC" \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' | \
  node -e "const d = require('fs').readFileSync(0,'utf8'); console.log(JSON.parse(d).result);")

echo "   Gas Price: $GAS_PRICE"

# Crear transacción firmada
echo "✍️  Firmando transacción..."

SIGNED_TX=$(node -e "
const ethers = require('ethers');
const wallet = new ethers.Wallet('$PRIVATE_KEY');
const tx = {
  nonce: $NONCE,
  gasLimit: 3000000,
  gasPrice: '$GAS_PRICE',
  data: '0x$BYTECODE',
  chainId: 137
};
wallet.signTransaction(tx).then(console.log);
")

echo "   Transacción firmada"

# Enviar transacción
echo "📤 Enviando transacción..."

RESPONSE=$(curl -s -X POST "$RPC" \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["'"$SIGNED_TX"'"],"id":1}')

echo "$RESPONSE" | node -e "
const d = require('fs').readFileSync(0,'utf8');
const obj = JSON.parse(d);
if (obj.error) {
  console.log('❌ Error:', obj.error.message);
  process.exit(1);
} else {
  console.log('✅ TX Hash:', obj.result);
}
"

echo ""
echo "✅ TokenFactory desplegado!"
echo "Verifica en: https://polygonscan.com/tx/[TX_HASH]"
