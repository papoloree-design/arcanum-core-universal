/**
 * SOBERANO GLOBAL API CREATOR
 * Crea APIs de cualquier categoría de forma soberana y global
 * Integra: Wallet, Bridge, Mining, Storage, DID, Factory, Runtime
 */

import crypto from 'crypto';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { DecxWallet } from '../wallet/decx-explorer.js';
import { CoinfactoryBridge } from '../bridge/coinfactory-bridge.js';
import { MiningProcessor } from '../mining/mining-processor.js';
import { DHTNode } from '../storage/dht-node.js';
import { generateDID } from '../identity/did-method.js';
import { DIDResolver } from '../identity/did-resolver.js';
import { Engine } from '../local-runtime/engine.js';
import { Router } from '../local-runtime/router.js';

/* =======================
   Vault / Key Management
======================= */
const ALGO = 'aes-256-gcm';
const MASTER_KEY = crypto.randomBytes(32);

export function encryptData(data) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, MASTER_KEY, iv);
  let enc = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { iv: iv.toString('hex'), data: enc, tag };
}

export function decryptData(enc) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    MASTER_KEY,
    Buffer.from(enc.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(enc.tag, 'hex'));
  let dec = decipher.update(enc.data, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return JSON.parse(dec);
}

/* =======================
   Fetch Helper (sin node-fetch)
======================= */
export async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

/* =======================
   TokenFactory Simplificado
======================= */
export class TokenFactory {
  constructor() {
    this.deployed = [];
  }

  deploy(bytecode, typeId, name = 'Token') {
    const addr = '0x' + crypto.randomBytes(20).toString('hex');
    const deployment = {
      address: addr,
      typeId,
      name,
      bytecode,
      deployedAt: Date.now()
    };
    
    this.deployed.push(deployment);
    console.log(`✅ Token deployed: ${name} at ${addr}`);
    
    return deployment;
  }

  getDeployed() {
    return this.deployed;
  }
}

/* =======================
   API Engine Universal Global
======================= */
export class GlobalAPIEngine {
  constructor() {
    this.routes = new Map();
    this.categories = new Set();
    this.engine = new Engine();
    this.router = new Router();
    this.middleware = [];
    this.apiRegistry = [];
    
    // Inicializar componentes
    this.wallet = new DecxWallet();
    this.bridge = new CoinfactoryBridge();
    this.storage = new DHTNode();
    this.mining = new MiningProcessor();
    this.factory = new TokenFactory();
    this.didResolver = new DIDResolver();
    
    this.initializeDefaultAPIs();
  }

  /**
   * Registrar endpoint
   */
  register(path, handler, metadata = {}) {
    this.routes.set(path, {
      handler,
      metadata: {
        ...metadata,
        registeredAt: Date.now()
      }
    });

    const category = path.split('/')[0];
    this.categories.add(category);

    console.log(`📍 API registered: ${path}`);
  }

  /**
   * Agregar middleware
   */
  use(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Handle Request
   */
  async handleRequest(path, data = {}, options = {}) {
    const route = this.routes.get(path);
    
    if (!route) {
      throw new Error(`❌ Endpoint not found: ${path}`);
    }

    // Ejecutar middleware
    let context = { path, data, options };
    for (const mw of this.middleware) {
      context = await mw(context);
      if (context.cancel) {
        return context.response;
      }
    }

    // Log request
    if (options.verbose) {
      console.log(`🔄 Request: ${path}`, data);
    }

    try {
      const result = await route.handler(context.data, context.options);
      
      if (options.verbose) {
        console.log(`✅ Response: ${path}`, result);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Error in ${path}:`, error.message);
      throw error;
    }
  }

  /**
   * Crear API dinámica
   */
  async createAPI(config) {
    const {
      name,
      category = 'custom',
      method = 'GET',
      description = '',
      handler,
      auth = false,
      rateLimit = null
    } = config;

    const path = `${category}/${name}`;

    // Wrapper con features adicionales
    const wrappedHandler = async (data, options) => {
      // Auth
      if (auth && !options.authenticated) {
        throw new Error('Authentication required');
      }

      // Rate limiting (simple)
      if (rateLimit) {
        // Implementar rate limiting
      }

      return await handler(data, options);
    };

    this.register(path, wrappedHandler, {
      method,
      description,
      category,
      auth,
      rateLimit
    });

    // Guardar en registry
    this.apiRegistry.push({
      name,
      path,
      category,
      method,
      description,
      createdAt: Date.now()
    });

    return {
      success: true,
      path,
      message: `API created: ${path}`
    };
  }

  /**
   * Listar APIs registradas
   */
  listAPIs(category = null) {
    if (category) {
      return this.apiRegistry.filter(api => api.category === category);
    }
    return this.apiRegistry;
  }

  /**
   * Listar categorías
   */
  listCategories() {
    return Array.from(this.categories);
  }

  /**
   * Inicializar APIs por defecto
   */
  initializeDefaultAPIs() {
    // ==================== WALLET APIs ====================
    this.register('wallet/create', async ({ name, password }) => {
      return this.wallet.createWallet(name, password);
    }, { description: 'Create new wallet', category: 'wallet' });

    this.register('wallet/sign', async ({ address, message, password }) => {
      return this.wallet.sign(address, message, password);
    }, { description: 'Sign message', category: 'wallet' });

    this.register('wallet/list', async () => {
      return this.wallet.listWallets();
    }, { description: 'List wallets', category: 'wallet' });

    // ==================== BRIDGE APIs ====================
    this.register('bridge/transfer', async (params) => {
      const { token, fromChain, toChain, addressFrom, addressTo, amount } = params;
      return this.bridge.bridgeToken(token, fromChain, toChain, addressFrom, addressTo, amount);
    }, { description: 'Bridge tokens between chains', category: 'bridge' });

    this.register('bridge/status', async ({ transferId }) => {
      return this.bridge.getTransferStatus(transferId);
    }, { description: 'Get transfer status', category: 'bridge' });

    this.register('bridge/history', async ({ address }) => {
      return this.bridge.getHistory(address);
    }, { description: 'Get bridge history', category: 'bridge' });

    this.register('bridge/stats', async () => {
      return this.bridge.getStats();
    }, { description: 'Get bridge statistics', category: 'bridge' });

    // ==================== STORAGE APIs ====================
    this.register('storage/put', async ({ key, value }) => {
      return this.storage.put(key, value);
    }, { description: 'Store data in DHT', category: 'storage' });

    this.register('storage/get', async ({ key }) => {
      return this.storage.get(key);
    }, { description: 'Get data from DHT', category: 'storage' });

    this.register('storage/stats', async () => {
      return this.storage.stats();
    }, { description: 'Get storage stats', category: 'storage' });

    // ==================== MINING APIs ====================
    this.register('mining/price', async ({ coin = 'bitcoin' }) => {
      return await this.mining.processCryptoPrice(coin);
    }, { description: 'Get crypto price', category: 'mining' });

    this.register('mining/balance', async ({ address, apiKey }) => {
      return await this.mining.processAddressBalance(address, apiKey);
    }, { description: 'Get address balance', category: 'mining' });

    this.register('mining/custom', async ({ url, parser }) => {
      return await this.mining.process('custom', url, parser);
    }, { description: 'Mine custom data source', category: 'mining' });

    this.register('mining/stats', async () => {
      return this.mining.getStats();
    }, { description: 'Get mining stats', category: 'mining' });

    // ==================== FACTORY APIs ====================
    this.register('factory/deploy', async ({ bytecode, typeId, name }) => {
      return this.factory.deploy(bytecode, typeId, name);
    }, { description: 'Deploy token', category: 'factory' });

    this.register('factory/list', async () => {
      return this.factory.getDeployed();
    }, { description: 'List deployed tokens', category: 'factory' });

    // ==================== DID APIs ====================
    this.register('did/generate', async ({ publicKey }) => {
      return generateDID(publicKey);
    }, { description: 'Generate DID', category: 'did' });

    this.register('did/register', async ({ did, document }) => {
      this.didResolver.register(did, document);
      return { success: true, did };
    }, { description: 'Register DID', category: 'did' });

    this.register('did/resolve', async ({ did }) => {
      return this.didResolver.resolve(did);
    }, { description: 'Resolve DID', category: 'did' });

    // ==================== UTILITY APIs ====================
    this.register('util/encrypt', async ({ data }) => {
      return encryptData(data);
    }, { description: 'Encrypt data', category: 'util' });

    this.register('util/decrypt', async ({ encrypted }) => {
      return decryptData(encrypted);
    }, { description: 'Decrypt data', category: 'util' });

    this.register('util/hash', async ({ data }) => {
      return crypto.createHash('sha256').update(data).digest('hex');
    }, { description: 'Hash data', category: 'util' });

    // ==================== SYSTEM APIs ====================
    this.register('system/status', async () => {
      return {
        status: 'operational',
        categories: this.listCategories(),
        totalAPIs: this.routes.size,
        uptime: process.uptime()
      };
    }, { description: 'System status', category: 'system' });

    this.register('system/apis', async ({ category }) => {
      return this.listAPIs(category);
    }, { description: 'List registered APIs', category: 'system' });

    // ==================== DYNAMIC API CREATOR ====================
    this.register('global/createAPI', async (config) => {
      return await this.createAPI(config);
    }, { description: 'Create dynamic API', category: 'global' });

    console.log('✅ Default APIs initialized');
  }

  /**
   * Exportar configuración de API
   */
  exportConfig() {
    return {
      categories: this.listCategories(),
      apis: this.apiRegistry,
      totalRoutes: this.routes.size
    };
  }

  /**
   * Guardar configuración
   */
  saveConfig(path = 'api-creator/api-config.json') {
    fs.writeFileSync(path, JSON.stringify(this.exportConfig(), null, 2));
    console.log(`💾 Config saved to ${path}`);
  }
}

// Exportar instancia global
export const globalAPI = new GlobalAPIEngine();
