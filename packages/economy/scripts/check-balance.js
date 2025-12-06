const hre = require("hardhat");

async function main() {
  console.log("\n💰 Verificando Balance del Deployer");
  console.log("=".repeat(50));

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Dirección:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceEth = hre.ethers.formatEther(balance);
  
  console.log("💵 Balance:", balanceEth, "MATIC");
  console.log("💵 Balance Wei:", balance.toString());

  const network = await hre.ethers.provider.getNetwork();
  console.log("\n🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());

  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log("📦 Block Number:", blockNumber);

  const gasPrice = await hre.ethers.provider.getFeeData();
  console.log("\n⛽ Gas Price:");
  console.log("  Max Fee:", hre.ethers.formatUnits(gasPrice.maxFeePerGas, "gwei"), "gwei");
  console.log("  Priority Fee:", hre.ethers.formatUnits(gasPrice.maxPriorityFeePerGas, "gwei"), "gwei");

  console.log("\n" + "=".repeat(50));

  const minBalance = 0.01;
  const recommendedBalance = 0.5;

  if (parseFloat(balanceEth) < minBalance) {
    console.log("❌ Balance insuficiente. Necesitas al menos", minBalance, "MATIC");
    console.log("   Envía MATIC a:", deployer.address);
    process.exit(1);
  } else if (parseFloat(balanceEth) < recommendedBalance) {
    console.log("⚠️  Balance bajo. Recomendado:", recommendedBalance, "MATIC para gas");
  } else {
    console.log("✅ Balance suficiente para deployment");
  }

  console.log("\n🔗 Explorador:");
  if (network.chainId === 137n) {
    console.log("   https://polygonscan.com/address/" + deployer.address);
  } else if (network.chainId === 80001n) {
    console.log("   https://mumbai.polygonscan.com/address/" + deployer.address);
  }

  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
