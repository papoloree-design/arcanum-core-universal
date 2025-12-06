import fs from 'fs';
import path from 'path';

/**
 * Storage local para el runtime
 */

export class LocalStorage {
  constructor(storagePath = 'local-runtime/data') {
    this.storagePath = storagePath;
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  // Guardar
  save(key, value) {
    const filePath = path.join(this.storagePath, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  }

  // Cargar
  load(key) {
    const filePath = path.join(this.storagePath, `${key}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  }

  // Eliminar
  delete(key) {
    const filePath = path.join(this.storagePath, `${key}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  // Existe
  exists(key) {
    const filePath = path.join(this.storagePath, `${key}.json`);
    return fs.existsSync(filePath);
  }

  // Listar keys
  keys() {
    return fs.readdirSync(this.storagePath)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  }

  // Limpiar todo
  clear() {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      fs.unlinkSync(path.join(this.storagePath, file));
    }
  }
}
