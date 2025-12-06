#!/bin/bash

# AION-Ω Setup Script
# Este script automatiza la configuración inicial

set -e

echo "🚀 AION-Ω Setup"
echo "========================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no encontrado. Instala Node.js >= 18${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Verificar Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}⚠️  Yarn no encontrado. Instalando...${NC}"
    npm install -g yarn
fi

echo -e "${GREEN}✅ Yarn $(yarn --version)${NC}"

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creando .env desde template...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  IMPORTANTE: Edita .env con tus credenciales reales antes de continuar${NC}"
    echo ""
    read -p "Presiona Enter cuando hayas configurado .env..."
fi

# Instalar dependencias root
echo -e "\n${GREEN}Instalando dependencias root...${NC}"
yarn install

# Instalar dependencias de cada package
echo -e "\n${GREEN}Instalando dependencias de packages...${NC}"

for package in kernel identity economy ui; do
    echo -e "\n${YELLOW}Package: $package${NC}"
    cd packages/$package
    yarn install
    cd ../..
done

# Compilar contratos
echo -e "\n${GREEN}Compilando contratos Solidity...${NC}"
cd packages/economy
npx hardhat compile
cd ../..

echo -e "\n${GREEN}✅ Setup completado!${NC}"
echo ""
echo "Siguiente pasos:"
echo "1. Verifica balance del deployer:"
echo "   cd packages/economy && npx hardhat run scripts/check-balance.js --network polygon"
echo ""
echo "2. Deploy contratos a Polygon Mainnet:"
echo "   cd packages/economy && npx hardhat run scripts/deploy.js --network polygon"
echo ""
echo "3. Iniciar servicios:"
echo "   docker-compose up -d"
echo ""
echo "4. Acceder UI: http://localhost:3000"
echo ""
