import fs from 'fs';

/**
 * Sistema de pinning para datos importantes
 * Asegura que ciertos datos no sean eliminados
 */

export class PinningManager {
  constructor(pinFile = 'storage/pins.json') {
    this.pinFile = pinFile;
    this.pins = this.loadPins();
  }

  loadPins() {
    if (fs.existsSync(this.pinFile)) {
      return JSON.parse(fs.readFileSync(this.pinFile, 'utf8'));
    }
    return [];
  }

  savePins() {
    fs.writeFileSync(this.pinFile, JSON.stringify(this.pins, null, 2));
  }

  // Pin un hash
  pin(hash, metadata = {}) {
    if (this.isPinned(hash)) {
      return false;
    }

    this.pins.push({
      hash,
      metadata,
      pinnedAt: Date.now()
    });

    this.savePins();
    return true;
  }

  // Unpin un hash
  unpin(hash) {
    const index = this.pins.findIndex(p => p.hash === hash);
    if (index !== -1) {
      this.pins.splice(index, 1);
      this.savePins();
      return true;
    }
    return false;
  }

  // Verificar si está pinned
  isPinned(hash) {
    return this.pins.some(p => p.hash === hash);
  }

  // Listar pins
  list() {
    return [...this.pins];
  }

  // Obtener metadata
  getMetadata(hash) {
    const pin = this.pins.find(p => p.hash === hash);
    return pin ? pin.metadata : null;
  }
}
