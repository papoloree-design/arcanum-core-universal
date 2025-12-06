/**
 * SOBERANO UTIL - SHA256
 * Hash SHA256 sin dependencias (usa Web Crypto API)
 */

/**
 * Calcular SHA256 de un string
 */
export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calcular SHA256 de bytes
 */
export async function sha256Bytes(bytes) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Doble SHA256 (Bitcoin-style)
 */
export async function doubleSha256(text) {
  const first = await sha256(text);
  return sha256(first);
}

/**
 * Keccak256 (Ethereum-style) - placeholder
 * Nota: Requiere implementación custom o minimal library
 */
export async function keccak256(text) {
  // TODO: Implementar keccak256 puro
  // Por ahora usa SHA256 como placeholder
  return sha256(text);
}
