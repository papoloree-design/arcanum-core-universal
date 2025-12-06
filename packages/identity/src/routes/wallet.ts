import { Router, Request, Response } from 'express';
import { WalletService } from '../services/walletService';

export function createWalletRouter(): Router {
  const router = Router();
  const walletService = new WalletService();

  // Crear wallet MPC
  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { userId, threshold } = req.body;
      const wallet = await walletService.createMPCWallet(userId, threshold);
      
      res.json({
        success: true,
        wallet
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Obtener info de wallet
  router.get('/:walletId', async (req: Request, res: Response) => {
    try {
      const { walletId } = req.params;
      const wallet = await walletService.getWallet(walletId);
      
      res.json({
        success: true,
        wallet
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }
  });

  return router;
}
