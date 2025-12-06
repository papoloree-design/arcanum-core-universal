/**
 * SOBERANO WORKER - Sin dependencias externas
 * Compatible con Cloudflare Workers / Deno / Node (con adaptador)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/health' || path === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'soberano-worker',
        version: '1.0.0',
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener bytecode
    if (path === '/bytecode' || path === '/bytes') {
      const contract = url.searchParams.get('name') || url.searchParams.get('contract');
      
      const bytecodeMap = {
        'erc20': env?.BYTES_ERC20 || await loadBytecode('SoberanoERC20'),
        'erc721': env?.BYTES_ERC721 || await loadBytecode('SoberanoERC721'),
        'erc1155': env?.BYTES_ERC1155 || await loadBytecode('SoberanoERC1155'),
        'factory': env?.BYTES_FACTORY || await loadBytecode('TokenFactory')
      };

      const bytecode = bytecodeMap[contract?.toLowerCase()];

      if (bytecode) {
        return new Response(bytecode, {
          headers: { 
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      }

      return new Response(JSON.stringify({
        error: 'Contract not found',
        available: Object.keys(bytecodeMap)
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Listar contratos disponibles
    if (path === '/contracts') {
      return new Response(JSON.stringify({
        contracts: [
          { name: 'SoberanoERC20', type: 'erc20', key: 'erc20' },
          { name: 'SoberanoERC721', type: 'erc721', key: 'erc721' },
          { name: 'SoberanoERC1155', type: 'erc1155', key: 'erc1155' },
          { name: 'TokenFactory', type: 'factory', key: 'factory' }
        ]
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Manifesto de contrato
    if (path.startsWith('/manifest/')) {
      const contractName = path.split('/manifest/')[1];
      const manifest = await loadManifest(contractName);
      
      if (manifest) {
        return new Response(manifest, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      error: 'Not found',
      endpoints: [
        '/',
        '/health',
        '/bytecode?name=erc20',
        '/contracts',
        '/manifest/erc20'
      ]
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helpers (para entornos sin KV)
async function loadBytecode(contractName) {
  // En producción, esto vendría de KV storage
  // Por ahora retorna placeholder
  return `<BYTECODE_${contractName.toUpperCase()}>`;
}

async function loadManifest(contractName) {
  const manifests = {
    'erc20': JSON.stringify({
      name: 'SoberanoERC20',
      type: 'erc20',
      compiler: 'solc-0.8.20',
      optimized: true
    }),
    'erc721': JSON.stringify({
      name: 'SoberanoERC721',
      type: 'erc721',
      compiler: 'solc-0.8.20',
      optimized: true
    }),
    'erc1155': JSON.stringify({
      name: 'SoberanoERC1155',
      type: 'erc1155',
      compiler: 'solc-0.8.20',
      optimized: true
    }),
    'factory': JSON.stringify({
      name: 'TokenFactory',
      type: 'factory',
      compiler: 'solc-0.8.20',
      optimized: true
    })
  };

  return manifests[contractName.toLowerCase()];
}
