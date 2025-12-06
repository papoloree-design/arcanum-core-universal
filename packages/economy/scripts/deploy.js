const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("\n🚀 AION-Ω TokenFactory Deployment");
  console.log("=".repeat(50));

  // Obtener deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("⌛ Deploying contracts with account:", deployer.address);

  // Verificar balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC");

  if (parseFloat(hre.ethers.formatEther(balance)) < 0.01) {
    console.log("⚠️  WARNING: Balance muy bajo. Asegúrate de tener suficiente MATIC para gas.");
  }

  // Obtener info de red
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(ChainID:", network.chainId.toString(), ")");
  
  // Verificar que estamos en Polygon Mainnet
  if (network.chainId === 137n) {
    console.log("✅ Deploying to Polygon Mainnet");
    console.log("⚠️  PRODUCCIÓN - Verifica todo antes de continuar");
  } else {
    console.log("🚧 Deploying to test network");
  }

  console.log("\n🛠️  Deploying TokenFactory...");

  // Deploy TokenFactory
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("✅ TokenFactory deployed to:", factoryAddress);

  // Guardar deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: {
      TokenFactory: factoryAddress
    },
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  // Guardar en archivo
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `deployment-${network.chainId}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved to:", filepath);

  // Guardar último deployment
  const latestPath = path.join(deploymentsDir, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📊 Contract Summary:");
  console.log("=".repeat(50));
  console.log("Factory Address:", factoryAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("ChainId:", network.chainId.toString());

  // Verificar en Polygonscan si estamos en mainnet
  if (network.chainId === 137n && process.env.POLYGONSCAN_API_KEY) {
    console.log("\n⌛ Esperando bloques para verificación...");
    await factory.deploymentTransaction().wait(5);

    console.log("🔍 Verificando contrato en Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: factoryAddress,
        constructorArguments: []
      });
      console.log("✅ Contrato verificado en Polygonscan");
    } catch (error) {
      console.log("⚠️  Verificación fallida:", error.message);
      console.log("Puedes verificar manualmente en: https://polygonscan.com/address/" + factoryAddress);
    }
  }

  console.log("\n✅ Deployment completado!");
  console.log("\n🔗 Links útiles:");
  if (network.chainId === 137n) {
    console.log("Polygonscan:", `https://polygonscan.com/address/${factoryAddress}`);
  }
  console.log("\n" + "=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
