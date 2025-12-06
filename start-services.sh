#!/bin/bash

# AION-Ω - Start Services Script
# Inicia todos los servicios de AION-Ω

set -e

echo "🚀 Iniciando AION-Ω Services"
echo "=============================="

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    echo "Copia .env.example a .env y configura las variables"
    exit 1
fi

echo -e "${GREEN}✅ Archivo .env encontrado${NC}"

# Función para verificar puerto
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Puerto $1 ya está en uso${NC}"
        return 1
    fi
    return 0
}

# Verificar puertos disponibles
echo -e "\n${YELLOW}Verificando puertos...${NC}"
check_port 4000 || echo "  Kernel puerto 4000 ocupado"
check_port 4100 || echo "  Identity puerto 4100 ocupado"
check_port 3000 || echo "  UI puerto 3000 ocupado"

# Iniciar Kernel
echo -e "\n${GREEN}🧠 Iniciando Kernel (puerto 4000)...${NC}"
cd packages/kernel
node dist/index.js > ../../logs/kernel.log 2>&1 &
KERNEL_PID=$!
echo "  PID: $KERNEL_PID"
cd ../..

sleep 2

# Verificar Kernel
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Kernel iniciado correctamente${NC}"
else
    echo -e "${RED}❌ Kernel falló al iniciar${NC}"
fi

# Iniciar Identity
echo -e "\n${GREEN}🆔 Iniciando Identity Service (puerto 4100)...${NC}"
cd packages/identity
node dist/index.js > ../../logs/identity.log 2>&1 &
IDENTITY_PID=$!
echo "  PID: $IDENTITY_PID"
cd ../..

sleep 2

# Verificar Identity
if curl -s http://localhost:4100/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Identity iniciado correctamente${NC}"
else
    echo -e "${RED}❌ Identity falló al iniciar${NC}"
fi

# Información final
echo -e "\n${GREEN}=============================="
echo "✅ Servicios iniciados"
echo "==============================${NC}"
echo ""
echo "📊 Status:"
echo "  Kernel:   http://localhost:4000/health"
echo "  Identity: http://localhost:4100/health"
echo ""
echo "🌐 Para iniciar UI:"
echo "  cd packages/ui && yarn dev"
echo ""
echo "📋 PIDs guardados:"
echo "  Kernel: $KERNEL_PID"
echo "  Identity: $IDENTITY_PID"
echo ""
echo "🛑 Para detener servicios:"
echo "  kill $KERNEL_PID $IDENTITY_PID"
echo ""
echo "📝 Logs en:"
echo "  logs/kernel.log"
echo "  logs/identity.log"
echo ""
