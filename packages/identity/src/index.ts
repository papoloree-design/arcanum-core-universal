import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDidRouter } from './routes/did';
import { createWalletRouter } from './routes/wallet';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4100;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'aion-identity',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/did', createDidRouter());
app.use('/api/wallet', createWalletRouter());

app.listen(PORT, () => {
  console.log(`🆔 AION Identity Service running on port ${PORT}`);
});

export default app;
