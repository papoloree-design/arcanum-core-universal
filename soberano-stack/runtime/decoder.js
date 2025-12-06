/**
 * SOBERANO RUNTIME - Decoder
 * Decodifica datos de contratos sin dependencias
 */

import { hexToBytes, bytesToHex } from './encode.js';

/**
 * Decodificar hex a bytes
 */
export function decode(hex) {
  return hexToBytes(hex);
}

/**
 * Decodificar uint256 desde hex
 */
export function decodeUint256(hex) {
  const clean = hex.replace(/^0x/, '');
  return BigInt('0x' + clean);
}

/**
 * Decodificar address desde hex
 */
export function decodeAddress(hex) {
  const clean = hex.replace(/^0x/, '').slice(-40);
  return '0x' + clean;
}

/**
 * Decodificar string desde hex (ABI encoded)
 */
export function decodeString(hex) {
  const clean = hex.replace(/^0x/, '');
  // Skip offset (32 bytes) y length (32 bytes)
  const dataHex = clean.slice(128);
  
  let str = '';
  for (let i = 0; i < dataHex.length; i += 2) {
    const byte = parseInt(dataHex.slice(i, i + 2), 16);
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  
  return str;
}

/**
 * Decodificar múltiples valores
 */
export function decodeMultiple(hex, types) {
  const clean = hex.replace(/^0x/, '');
  const results = [];
  let offset = 0;
  
  for (const type of types) {
    const chunk = clean.slice(offset, offset + 64);
    
    if (type === 'uint256' || type === 'uint') {
      results.push(decodeUint256('0x' + chunk));
    } else if (type === 'address') {
      results.push(decodeAddress('0x' + chunk));
    } else if (type === 'bool') {
      results.push(parseInt(chunk, 16) !== 0);
    }
    
    offset += 64;
  }
  
  return results;
}
