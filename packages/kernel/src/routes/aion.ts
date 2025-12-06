import { Router, Request, Response } from 'express';
import { logger } from '../services/logger';
import { AionOrchestrator } from '../services/orchestrator';

export function createAionRouter(): Router {
  const router = Router();
  const orchestrator = new AionOrchestrator();

  // Health check específico de AION
  router.get('/status', (req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'aion-orchestrator',
      timestamp: Date.now(),
      components: {
        kernel: true,
        identity: true,
        economy: true,
        mind: false // stub
      }
    });
  });

  // Crear tarea de orquestación
  router.post('/task', async (req: Request, res: Response) => {
    try {
      const { type, payload } = req.body;
      
      logger.info(`Received task: ${type}`);
      
      const result = await orchestrator.processTask(type, payload);
      
      res.json({
        success: true,
        taskId: result.taskId,
        status: result.status,
        message: 'Task accepted and processing'
      });
    } catch (error: any) {
      logger.error('Task processing error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Obtener estado de tarea
  router.get('/task/:taskId', async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const status = await orchestrator.getTaskStatus(taskId);
      
      res.json({
        success: true,
        task: status
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
  });

  return router;
}
