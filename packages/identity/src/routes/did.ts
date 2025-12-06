import { Router, Request, Response } from 'express';
import { DidService } from '../services/didService';

export function createDidRouter(): Router {
  const router = Router();
  const didService = new DidService();

  // Crear nuevo DID
  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { type, metadata } = req.body;
      const did = await didService.createDID(type || 'aion', metadata);
      
      res.json({
        success: true,
        did
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Resolver DID
  router.get('/resolve/:did', async (req: Request, res: Response) => {
    try {
      const { did } = req.params;
      const document = await didService.resolveDID(did);
      
      res.json({
        success: true,
        document
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'DID not found'
      });
    }
  });

  // Listar DIDs
  router.get('/list', async (req: Request, res: Response) => {
    try {
      const dids = await didService.listDIDs();
      res.json({
        success: true,
        count: dids.length,
        dids
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
