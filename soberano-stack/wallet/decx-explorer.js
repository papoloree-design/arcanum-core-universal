import crypto from 'crypto';
import fs from 'fs';
import { encrypt, decrypt } from '../vault/vault-crypto.js';

/**
 * DecX Explorer Wallet - Wallet soberano
 * Control total de claves, firmas y transacciones
 */

export class DecxWallet {
  constructor(storagePath = 'wallet/wallets.db') {
    this.storagePath = storagePath;
    this.wallets = this.loadWallets();
    this.currentWallet = null;
  }

  loadWallets() {
    if (fs.existsSync(this.storagePath)) {
      return JSON.parse(fs.readFileSync(this.storagePath, 'utf8'));
    }
    return {};
  }

  saveWallets() {
    fs.writeFileSync(this.storagePath, JSON.stringify(this.wallets, null, 2));
  }

  /**
   * Crear nueva wallet
   */
  createWallet(name, password) {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = this.derivePublicKey(privateKey);
    const address = this.deriveAddress(publicKey);

    const wallet = {
      name,
      address,
      publicKey,
      privateKey: encrypt(privateKey, password),
      created: Date.now(),
      chains: {
        polygon: { address, balance: '0' },
        sovereign: { address, balance: '0' }
      }
    };

    this.wallets[address] = wallet;
    this.saveWallets();

    console.log(`✅ Wallet creada: ${address}`);
    return { address, publicKey };
  }

  /**
   * Importar wallet desde private key
   */
  importWallet(name, privateKey, password) {
    const publicKey = this.derivePublicKey(privateKey);
    const address = this.deriveAddress(publicKey);

    const wallet = {
      name,
      address,
      publicKey,
      privateKey: encrypt(privateKey, password),
      imported: true,
      created: Date.now(),
      chains: {
        polygon: { address, balance: '0' },
        sovereign: { address, balance: '0' }
      }
    };

    this.wallets[address] = wallet;
    this.saveWallets();

    console.log(`✅ Wallet importada: ${address}`);
    return { address, publicKey };
  }

  /**
   * Obtener private key (requiere password)
   */
  getPrivateKey(address, password) {
    const wallet = this.wallets[address];
    if (!wallet) throw new Error('Wallet not found');

    try {
      return decrypt(wallet.privateKey, password);
    } catch {
      throw new Error('Invalid password');
    }
  }

  /**
   * Firmar mensaje
   */
  sign(address, message, password) {
    const privateKey = this.getPrivateKey(address, password);
    
    const hash = crypto.createHash('sha256')
      .update(message)
      .digest();

    // Firma simplificada (en producción usar secp256k1)
    const signature = crypto.createHmac('sha256', privateKey)
      .update(hash)
      .digest('hex');

    return {
      message,
      signature,
      address,
      timestamp: Date.now()
    };
  }

  /**
   * Verificar firma
   */
  verify(address, message, signature) {
    const wallet = this.wallets[address];
    if (!wallet) return false;

    // Verificación simplificada
    return signature.length === 64; // Placeholder
  }

  /**
   * Listar wallets
   */
  listWallets() {
    return Object.values(this.wallets).map(w => ({
      name: w.name,
      address: w.address,
      publicKey: w.publicKey,
      created: new Date(w.created).toISOString(),
      imported: w.imported || false,
      chains: w.chains
    }));
  }

  /**
   * Actualizar balance
   */
  updateBalance(address, chain, balance) {
    const wallet = this.wallets[address];
    if (wallet && wallet.chains[chain]) {
      wallet.chains[chain].balance = balance;
      this.saveWallets();
    }
  }

  /**
   * Exportar wallet (para backup)
   */
  exportWallet(address, password) {
    const privateKey = this.getPrivateKey(address, password);
    const wallet = this.wallets[address];

    return {
      name: wallet.name,
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey, // ⚠️ Guardar seguro
      mnemonic: this.generateMnemonic(privateKey) // Opcional
    };
  }

  // Utilidades
  derivePublicKey(privateKey) {
    return crypto.createHash('sha256')
      .update(privateKey)
      .digest('hex');
  }

  deriveAddress(publicKey) {
    const hash = crypto.createHash('sha256')
      .update(publicKey)
      .digest('hex');
    return '0x' + hash.slice(0, 40);
  }

  generateMnemonic(privateKey) {
    // Simplified mnemonic generation
    const words = ['soberano', 'wallet', 'secure', 'decentralized'];
    return words.join(' ');
  }
}
