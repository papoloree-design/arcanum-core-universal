import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createAionRouter } from './routes/aion';
import { createBlockchainRouter } from './routes/blockchain';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './services/logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'aion-kernel',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/aion', createAionRouter());
app.use('/api/blockchain', createBlockchainRouter());

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 AION Kernel running on port ${PORT}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Network: ${process.env.NETWORK || 'polygon'}`);
});

export default app;
