/**
 * Stub local server para desarrollo
 * Simula comportamiento del edge worker
 */
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.end(JSON.stringify({
      status: 'ok',
      service: 'aion-edge-worker-stub',
      timestamp: Date.now()
    }));
    return;
  }

  res.end(JSON.stringify({
    message: 'AION Edge Worker (local stub)',
    version: '1.0.0'
  }));
});

server.listen(PORT, () => {
  console.log(`⚡ Edge Worker stub running on port ${PORT}`);
});
