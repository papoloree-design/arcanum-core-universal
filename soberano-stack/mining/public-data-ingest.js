import https from 'https';
import http from 'http';
import fs from 'fs';

/**
 * Public Data Ingest - Minería de fuentes públicas
 * Ingesta datos de APIs públicas permitidas
 */

export class PublicDataIngest {
  constructor(cachePath = 'mining/cache.json') {
    this.cachePath = cachePath;
    this.cache = this.loadCache();
    this.sources = this.getPublicSources();
  }

  loadCache() {
    if (fs.existsSync(this.cachePath)) {
      return JSON.parse(fs.readFileSync(this.cachePath, 'utf8'));
    }
    return {};
  }

  saveCache() {
    fs.writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 2));
  }

  /**
   * Fuentes públicas permitidas
   */
  getPublicSources() {
    return {
      // Blockchain data
      etherscan: 'https://api.etherscan.io/api',
      polygonscan: 'https://api.polygonscan.com/api',
      
      // Market data
      coingecko: 'https://api.coingecko.com/api/v3',
      coinmarketcap: 'https://pro-api.coinmarketcap.com/v1',
      
      // Network stats
      blockcypher: 'https://api.blockcypher.com/v1',
      
      // Public datasets
      github: 'https://api.github.com',
      
      // Custom sources
      custom: []
    };
  }

  /**
   * Fetch de fuente pública
   */
  async fetchPublicData(url, options = {}) {
    // Check cache
    const cacheKey = this.getCacheKey(url);
    const cached = this.cache[cacheKey];
    
    if (cached && !this.isCacheExpired(cached)) {
      console.log('📦 Using cached data for:', url);
      return cached.data;
    }

    console.log('🌐 Fetching:', url);

    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            
            // Cache result
            this.cache[cacheKey] = {
              data: parsed,
              timestamp: Date.now(),
              ttl: 300000 // 5 minutos
            };
            this.saveCache();
            
            resolve(parsed);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Ingerir datos de CoinGecko
   */
  async ingestCoinGeckoData(coinId = 'bitcoin') {
    const url = `${this.sources.coingecko}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
    const data = await this.fetchPublicData(url);
    
    return {
      source: 'coingecko',
      coin: coinId,
      price: data[coinId]?.usd,
      change24h: data[coinId]?.usd_24h_change,
      timestamp: Date.now()
    };
  }

  /**
   * Ingerir datos de Polygonscan
   */
  async ingestPolygonscanData(address, apiKey) {
    const url = `${this.sources.polygonscan}?module=account&action=balance&address=${address}&apikey=${apiKey}`;
    const data = await this.fetchPublicData(url);
    
    return {
      source: 'polygonscan',
      address,
      balance: data.result,
      timestamp: Date.now()
    };
  }

  /**
   * Ingestar datos genéricos
   */
  async ingestGeneric(url, parser = null) {
    const data = await this.fetchPublicData(url);
    
    if (parser && typeof parser === 'function') {
      return parser(data);
    }
    
    return {
      source: 'generic',
      data,
      timestamp: Date.now()
    };
  }

  /**
   * Limpiar cache expirado
   */
  cleanExpiredCache() {
    const keys = Object.keys(this.cache);
    let cleaned = 0;
    
    keys.forEach(key => {
      if (this.isCacheExpired(this.cache[key])) {
        delete this.cache[key];
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      this.saveCache();
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  getCacheKey(url) {
    return Buffer.from(url).toString('base64').slice(0, 32);
  }

  isCacheExpired(cached) {
    return Date.now() - cached.timestamp > cached.ttl;
  }

  /**
   * Estadísticas
   */
  getStats() {
    return {
      cachedEntries: Object.keys(this.cache).length,
      sources: Object.keys(this.sources).length
    };
  }
}
