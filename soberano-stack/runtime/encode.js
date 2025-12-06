/**
 * SOBERANO RUNTIME - Encoder
 * Convierte bytes a hex sin dependencias
 */

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex) {
  const clean = hex.replace(/^0x/, '');
  const bytes = [];
  
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  
  return Uint8Array.from(bytes);
}

export function stringToHex(str) {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToString(hex) {
  const bytes = hexToBytes(hex);
  return new TextDecoder().decode(bytes);
}

// Padding
export function padLeft(hex, length) {
  return hex.padStart(length, '0');
}

export function padRight(hex, length) {
  return hex.padEnd(length, '0');
}
