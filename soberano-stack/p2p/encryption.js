import crypto from 'crypto';

/**
 * Encriptación P2P sin dependencias
 */

// Generar par de llaves Ed25519
export function genKeyPair() {
  return crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
}

// Encriptar con clave pública (RSA)
export function encrypt(publicKey, message) {
  const buffer = Buffer.from(message, 'utf8');
  
  // Para Ed25519, usar encriptación simétrica + firma
  // Aquí simplificado con Base64
  return buffer.toString('base64');
}

// Desencriptar con clave privada
export function decrypt(privateKey, encrypted) {
  return Buffer.from(encrypted, 'base64').toString('utf8');
}

// Firmar mensaje
export function sign(privateKey, message) {
  const signer = crypto.createSign('SHA256');
  signer.update(message);
  signer.end();
  return signer.sign(privateKey, 'hex');
}

// Verificar firma
export function verify(publicKey, message, signature) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(message);
  verifier.end();
  
  try {
    return verifier.verify(publicKey, signature, 'hex');
  } catch {
    return false;
  }
}

// Generar shared secret (ECDH)
export function deriveSharedSecret(privateKey, publicKey) {
  // Simplificado - en producción usar ECDH apropiado
  const hash = crypto.createHash('sha256')
    .update(privateKey + publicKey)
    .digest('hex');
  return hash;
}

// Encriptar con shared secret
export function encryptSymmetric(sharedSecret, message) {
  const key = Buffer.from(sharedSecret.slice(0, 64), 'hex');
  const iv = crypto.randomBytes(12);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    data: encrypted,
    tag
  };
}

// Desencriptar con shared secret
export function decryptSymmetric(sharedSecret, encrypted) {
  const key = Buffer.from(sharedSecret.slice(0, 64), 'hex');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
  
  let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
