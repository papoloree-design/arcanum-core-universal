import crypto from 'crypto';

/**
 * Verificación de pruebas criptográficas sin dependencias
 */

/**
 * Verificar Merkle Proof
 */
export function verifyMerkleProof(leaf, proof, root) {
  let computedHash = leaf;
  
  for (const element of proof) {
    if (element.position === 'left') {
      computedHash = hashPair(element.data, computedHash);
    } else {
      computedHash = hashPair(computedHash, element.data);
    }
  }
  
  return computedHash === root;
}

/**
 * Hash de un par de nodos
 */
function hashPair(a, b) {
  return crypto.createHash('sha256')
    .update(Buffer.concat([
      Buffer.from(a, 'hex'),
      Buffer.from(b, 'hex')
    ]))
    .digest('hex');
}

/**
 * Construir Merkle Tree
 */
export function buildMerkleTree(leaves) {
  if (leaves.length === 0) return null;
  if (leaves.length === 1) return leaves[0];
  
  const tree = [leaves];
  
  while (tree[tree.length - 1].length > 1) {
    const currentLevel = tree[tree.length - 1];
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(hashPair(currentLevel[i], currentLevel[i + 1]));
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    
    tree.push(nextLevel);
  }
  
  return {
    root: tree[tree.length - 1][0],
    tree
  };
}

/**
 * Generar proof para un leaf específico
 */
export function generateMerkleProof(leaves, leafIndex) {
  const tree = buildMerkleTree(leaves).tree;
  const proof = [];
  let index = leafIndex;
  
  for (let level = 0; level < tree.length - 1; level++) {
    const currentLevel = tree[level];
    const isRightNode = index % 2 === 1;
    
    if (isRightNode) {
      proof.push({
        position: 'left',
        data: currentLevel[index - 1]
      });
    } else {
      if (index + 1 < currentLevel.length) {
        proof.push({
          position: 'right',
          data: currentLevel[index + 1]
        });
      }
    }
    
    index = Math.floor(index / 2);
  }
  
  return proof;
}
