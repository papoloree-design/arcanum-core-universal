import fs from 'fs';
import { validateDID } from './did-method.js';

/**
 * DID Resolver Soberano
 * Resuelve DIDs a DID Documents
 */

export class DIDResolver {
  constructor(registryPath = 'identity/did-registry.json') {
    this.registryPath = registryPath;
    this.registry = this.loadRegistry();
  }

  loadRegistry() {
    if (fs.existsSync(this.registryPath)) {
      return JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
    }
    return {};
  }

  saveRegistry() {
    fs.writeFileSync(this.registryPath, JSON.stringify(this.registry, null, 2));
  }

  /**
   * Registrar DID Document
   */
  register(did, document) {
    if (!validateDID(did)) {
      throw new Error('Invalid DID');
    }

    this.registry[did] = {
      ...document,
      created: document.created || new Date().toISOString(),
      updated: new Date().toISOString()
    };

    this.saveRegistry();
    console.log(`✅ DID registered: ${did}`);
  }

  /**
   * Resolver DID a Document
   */
  resolve(did) {
    if (!validateDID(did)) {
      throw new Error('Invalid DID');
    }

    const document = this.registry[did];
    
    if (!document) {
      throw new Error('DID not found');
    }

    return document;
  }

  /**
   * Actualizar DID Document
   */
  update(did, updates) {
    const document = this.resolve(did);
    
    this.registry[did] = {
      ...document,
      ...updates,
      updated: new Date().toISOString()
    };

    this.saveRegistry();
    console.log(`✅ DID updated: ${did}`);
  }

  /**
   * Revocar DID
   */
  revoke(did) {
    const document = this.resolve(did);
    
    this.registry[did] = {
      ...document,
      revoked: true,
      revokedAt: new Date().toISOString()
    };

    this.saveRegistry();
    console.log(`❌ DID revoked: ${did}`);
  }

  /**
   * Listar DIDs
   */
  list() {
    return Object.keys(this.registry);
  }
}
