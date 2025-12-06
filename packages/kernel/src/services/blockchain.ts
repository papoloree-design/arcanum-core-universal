import { ethers } from 'ethers';
import { logger } from './logger';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;

  constructor() {
    const rpcUrl = process.env.POLYGON_RPC || 'https://polygon-rpc.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Inicializar wallet si hay private key
    if (process.env.DEPLOYER_PRIVATE_KEY) {
      try {
        this.wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, this.provider);
        logger.info(`✅ Wallet initialized: ${this.wallet.address}`);
      } catch (error) {
        logger.error('❌ Failed to initialize wallet:', error);
      }
    } else {
      logger.warn('⚠️ DEPLOYER_PRIVATE_KEY not set in environment');
    }
  }

  async getNetworkInfo() {
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    const gasPrice = await this.provider.getFeeData();

    return {
      name: network.name,
      chainId: network.chainId.toString(),
      blockNumber,
      gasPrice: {
        maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString()
      }
    };
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getDeployerInfo() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Set DEPLOYER_PRIVATE_KEY in .env');
    }

    const balance = await this.provider.getBalance(this.wallet.address);
    const transactionCount = await this.provider.getTransactionCount(this.wallet.address);

    return {
      address: this.wallet.address,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
      transactionCount,
      ready: parseFloat(ethers.formatEther(balance)) > 0.01 // Al menos 0.01 MATIC
    };
  }

  getWallet(): ethers.Wallet {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return this.wallet;
  }
}
