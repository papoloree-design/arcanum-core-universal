import crypto from 'crypto';

/**
 * DID Method Soberano
 * did:soberano:<identifier>
 */

export function generateDID(publicKey) {
  const identifier = crypto.createHash('sha256')
    .update(publicKey)
    .digest('hex')
    .slice(0, 32);
  
  return `did:soberano:${identifier}`;
}

export function parseDID(did) {
  const parts = did.split(':');
  
  if (parts.length !== 3 || parts[0] !== 'did' || parts[1] !== 'soberano') {
    throw new Error('Invalid DID format');
  }
  
  return {
    method: parts[1],
    identifier: parts[2]
  };
}

export function validateDID(did) {
  try {
    const parsed = parseDID(did);
    return parsed.identifier.length === 32;
  } catch {
    return false;
  }
}
