# Identidad Soberana (DID)

Sistema de identidad descentralizada conforme a W3C DID.

## Características

- ✅ DID Method: `did:soberano`
- ✅ DID Documents
- ✅ DID Resolver
- ✅ Verifiable Credentials
- ✅ Proofs criptográficos

## Uso

### Generar DID

```javascript
import { generateDID } from './identity/did-method.js';

const publicKey = '0x1234...';
const did = generateDID(publicKey);
console.log(did); // did:soberano:abc123...
```

### Registrar DID

```javascript
import { DIDResolver } from './identity/did-resolver.js';

const resolver = new DIDResolver();

const document = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:soberano:abc123',
  authentication: [{
    id: 'did:soberano:abc123#keys-1',
    type: 'Ed25519VerificationKey2020',
    controller: 'did:soberano:abc123',
    publicKeyHex: '0x1234...'
  }]
};

resolver.register('did:soberano:abc123', document);
```

### Resolver DID

```javascript
const document = resolver.resolve('did:soberano:abc123');
console.log(document);
```

### Crear Verifiable Credential

```javascript
import { createVerifiableCredential } from './identity/proofs.js';

const vc = createVerifiableCredential(
  'did:soberano:issuer',
  'did:soberano:subject',
  { name: 'John Doe', age: 30 },
  privateKey
);
```

### Verificar Credential

```javascript
import { verifyVerifiableCredential } from './identity/proofs.js';

const valid = verifyVerifiableCredential(vc, issuerPublicKey);
console.log('Valid:', valid);
```

## DID Document Example

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:soberano:abc123",
  "authentication": [{
    "id": "did:soberano:abc123#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:soberano:abc123",
    "publicKeyHex": "0x1234..."
  }],
  "created": "2025-12-06T10:00:00Z",
  "updated": "2025-12-06T10:00:00Z"
}
```

## Verifiable Credential Example

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential"],
  "issuer": "did:soberano:issuer",
  "issuanceDate": "2025-12-06T10:00:00Z",
  "credentialSubject": {
    "id": "did:soberano:subject",
    "name": "John Doe"
  },
  "proof": {
    "type": "SoberanoSignature2024",
    "created": "2025-12-06T10:00:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:soberano:issuer#keys-1",
    "signature": "0xabc..."
  }
}
```
