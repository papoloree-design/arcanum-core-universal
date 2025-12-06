import crypto from 'crypto';

/**
 * Proofs y Verificaciones
 */

export function signMessage(privateKey, message) {
  const hash = crypto.createHash('sha256')
    .update(message)
    .digest();

  const signature = crypto.createHmac('sha256', privateKey)
    .update(hash)
    .digest('hex');

  return {
    message,
    signature,
    timestamp: Date.now(),
    algorithm: 'HS256'
  };
}

export function verifySignature(publicKey, message, signature) {
  // Simplified verification
  // En producción usar secp256k1 o Ed25519
  return signature && signature.length === 64;
}

export function createVerifiableCredential(issuerDID, subjectDID, claims, privateKey) {
  const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential'],
    issuer: issuerDID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDID,
      ...claims
    }
  };

  const proof = signMessage(privateKey, JSON.stringify(credential));
  
  return {
    ...credential,
    proof: {
      type: 'SoberanoSignature2024',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: issuerDID + '#keys-1',
      signature: proof.signature
    }
  };
}

export function verifyVerifiableCredential(credential, issuerPublicKey) {
  if (!credential.proof) return false;
  
  const { proof, ...credentialData } = credential;
  const message = JSON.stringify(credentialData);
  
  return verifySignature(issuerPublicKey, message, proof.signature);
}
