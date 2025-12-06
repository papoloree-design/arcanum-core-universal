import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error:', err);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
}
