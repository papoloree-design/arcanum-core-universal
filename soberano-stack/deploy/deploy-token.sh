#!/bin/bash

# SOBERANO STACK - Deploy Token (genérico)
# Uso: ./deploy-token.sh <BYTECODE_FILE> <RPC_URL> <PRIVATE_KEY>

set -e

BYTECODE_FILE="$1"
RPC="${2:-https://polygon-rpc.com}"
PRIVATE_KEY="$3"

if [ -z "$BYTECODE_FILE" ] || [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: Parámetros faltantes"
    echo "Uso: $0 <BYTECODE_FILE> <RPC_URL> <PRIVATE_KEY>"
    echo "Ejemplo: $0 bytecodes/SoberanoERC20.bin https://polygon-rpc.com 0x..."
    exit 1
fi

if [ ! -f "$BYTECODE_FILE" ]; then
    echo "❌ Error: $BYTECODE_FILE no encontrado"
    exit 1
fi

echo "🚀 SOBERANO STACK - Deploy Contract"
echo "==================================="
echo "Bytecode: $BYTECODE_FILE"
echo "RPC: $RPC"
echo ""

BYTECODE=$(cat "$BYTECODE_FILE")
echo "✅ Bytecode: ${#BYTECODE} bytes"

# Resto similar a deploy-factory.sh
echo ""
echo "⚠️  Implementa el proceso completo de firma y envío"
echo "O usa el factory en lugar de deployar directo"
