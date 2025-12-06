import { Router, Request, Response } from 'express';
import { BlockchainService } from '../services/blockchain';
import { logger } from '../services/logger';

export function createBlockchainRouter(): Router {
  const router = Router();
  const blockchain = new BlockchainService();

  // Obtener información de la red
  router.get('/network', async (req: Request, res: Response) => {
    try {
      const networkInfo = await blockchain.getNetworkInfo();
      res.json({
        success: true,
        network: networkInfo
      });
    } catch (error: any) {
      logger.error('Network info error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Obtener balance de una dirección
  router.get('/balance/:address', async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const balance = await blockchain.getBalance(address);
      
      res.json({
        success: true,
        address,
        balance
      });
    } catch (error: any) {
      logger.error('Balance query error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Obtener información del deployer
  router.get('/deployer', async (req: Request, res: Response) => {
    try {
      const deployerInfo = await blockchain.getDeployerInfo();
      res.json({
        success: true,
        deployer: deployerInfo
      });
    } catch (error: any) {
      logger.error('Deployer info error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
