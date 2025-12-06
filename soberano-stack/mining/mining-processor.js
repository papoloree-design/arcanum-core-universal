import { PublicDataIngest } from './public-data-ingest.js';
import { LocalStorage } from '../local-runtime/storage.js';

/**
 * Mining Processor
 * Procesa y almacena datos minados
 */

export class MiningProcessor {
  constructor() {
    this.ingest = new PublicDataIngest();
    this.storage = new LocalStorage('mining/processed');
    this.stats = this.loadStats();
  }

  loadStats() {
    return this.storage.load('mining-stats') || {
      totalProcessed: 0,
      bySource: {},
      lastProcessed: null
    };
  }

  saveStats() {
    this.storage.save('mining-stats', this.stats);
  }

  /**
   * Procesar datos de fuente
   */
  async process(source, url, parser = null) {
    console.log(`⛏️  Processing data from ${source}...`);

    try {
      const data = await this.ingest.ingestGeneric(url, parser);
      
      // Almacenar procesado
      const processId = `${source}-${Date.now()}`;
      this.storage.save(processId, data);

      // Actualizar stats
      this.stats.totalProcessed++;
      this.stats.bySource[source] = (this.stats.bySource[source] || 0) + 1;
      this.stats.lastProcessed = Date.now();
      this.saveStats();

      console.log(`✅ Processed: ${processId}`);
      return data;
    } catch (error) {
      console.error(`❌ Error processing ${source}:`, error.message);
      throw error;
    }
  }

  /**
   * Procesar precio de crypto
   */
  async processCryptoPrice(coinId = 'bitcoin') {
    const data = await this.ingest.ingestCoinGeckoData(coinId);
    
    this.storage.save(`price-${coinId}-latest`, data);
    
    this.stats.totalProcessed++;
    this.stats.bySource['coingecko'] = (this.stats.bySource['coingecko'] || 0) + 1;
    this.saveStats();

    return data;
  }

  /**
   * Procesar balance de address
   */
  async processAddressBalance(address, apiKey) {
    const data = await this.ingest.ingestPolygonscanData(address, apiKey);
    
    this.storage.save(`balance-${address}-latest`, data);
    
    this.stats.totalProcessed++;
    this.stats.bySource['polygonscan'] = (this.stats.bySource['polygonscan'] || 0) + 1;
    this.saveStats();

    return data;
  }

  /**
   * Obtener datos procesados
   */
  getProcessed(key) {
    return this.storage.load(key);
  }

  /**
   * Listar datos procesados
   */
  listProcessed() {
    return this.storage.keys();
  }

  /**
   * Estadísticas
   */
  getStats() {
    return {
      ...this.stats,
      cacheStats: this.ingest.getStats()
    };
  }

  /**
   * Limpiar datos antiguos
   */
  cleanup(maxAge = 86400000) { // 24 horas
    const keys = this.storage.keys();
    let cleaned = 0;

    keys.forEach(key => {
      const data = this.storage.load(key);
      if (data && data.timestamp && Date.now() - data.timestamp > maxAge) {
        this.storage.delete(key);
        cleaned++;
      }
    });

    console.log(`🧹 Cleaned ${cleaned} old entries`);
    return cleaned;
  }
}
