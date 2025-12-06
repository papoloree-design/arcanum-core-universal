import { v4 as uuidv4 } from 'uuid';

interface DIDDocument {
  '@context': string[];
  id: string;
  type: string;
  created: string;
  updated: string;
  publicKey: any[];
  authentication: string[];
  service: any[];
  metadata?: any;
}

export class DidService {
  private dids: Map<string, DIDDocument> = new Map();

  async createDID(type: string = 'aion', metadata?: any): Promise<DIDDocument> {
    const id = `did:${type}:${uuidv4()}`;
    const now = new Date().toISOString();

    const didDocument: DIDDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/v1'
      ],
      id,
      type: 'AionIdentity',
      created: now,
      updated: now,
      publicKey: [],
      authentication: [],
      service: [],
      metadata: metadata || {}
    };

    this.dids.set(id, didDocument);
    console.log(`✅ DID created: ${id}`);

    return didDocument;
  }

  async resolveDID(did: string): Promise<DIDDocument> {
    const document = this.dids.get(did);
    if (!document) {
      throw new Error(`DID not found: ${did}`);
    }
    return document;
  }

  async listDIDs(): Promise<DIDDocument[]> {
    return Array.from(this.dids.values());
  }

  async updateDID(did: string, updates: Partial<DIDDocument>): Promise<DIDDocument> {
    const document = await this.resolveDID(did);
    const updated = {
      ...document,
      ...updates,
      updated: new Date().toISOString()
    };
    this.dids.set(did, updated);
    return updated;
  }
}
