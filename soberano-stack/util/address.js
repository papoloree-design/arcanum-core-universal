/**
 * SOBERANO UTIL - Address utilities
 * Utilidades para direcciones Ethereum sin dependencias
 */

import { keccak256 } from './sha256.js';

/**
 * Validar formato de dirección Ethereum
 */
export function isValidAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Normalizar dirección (lowercase)
 */
export function normalizeAddress(address) {
  return address.toLowerCase();
}

/**
 * Checksum address (EIP-55) - simplified
 */
export async function toChecksumAddress(address) {
  const addr = address.toLowerCase().replace('0x', '');
  const hash = await keccak256(addr);
  
  let checksumAddr = '0x';
  
  for (let i = 0; i < addr.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddr += addr[i].toUpperCase();
    } else {
      checksumAddr += addr[i];
    }
  }
  
  return checksumAddr;
}

/**
 * Comparar direcciones (case-insensitive)
 */
export function compareAddresses(addr1, addr2) {
  return normalizeAddress(addr1) === normalizeAddress(addr2);
}

/**
 * Abreviar dirección
 */
export function shortenAddress(address, chars = 4) {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}
