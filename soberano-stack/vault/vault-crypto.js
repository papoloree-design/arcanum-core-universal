import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const KEY_SIZE = 32;
const IV_SIZE = 12;

// Genera key desde password usando PBKDF2
export function deriveKey(password, salt = 'soberano-vault-salt') {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_SIZE, 'sha256');
}

// Encriptar datos
export function encrypt(data, password) {
  const key = deriveKey(password);
  const iv = crypto.randomBytes(IV_SIZE);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    data: encrypted,
    tag,
    timestamp: Date.now()
  };
}

// Desencriptar datos
export function decrypt(enc, password) {
  const key = deriveKey(password);
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(enc.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(enc.tag, 'hex'));
  
  let decrypted = decipher.update(enc.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

// Hash seguro
export function secureHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Generar seed aleatorio
export function generateSeed(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}
