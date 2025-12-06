/**
 * EJEMPLOS DE USO - SOBERANO GLOBAL API CREATOR
 */

import { globalAPI, fetchData } from './global-api-engine.js';

console.log('🌐 SOBERANO GLOBAL API CREATOR - Examples\n');

// ============================================
// EJEMPLO 1: Crear API de Weather
// ============================================
await globalAPI.createAPI({
  name: 'weather',
  category: 'global',
  method: 'GET',
  description: 'Get weather data for a city',
  handler: async ({ city }) => {
    try {
      const data = await fetchData(
        `https://wttr.in/${city}?format=j1`
      );
      return {
        city,
        temperature: data.current_condition[0].temp_C + '°C',
        description: data.current_condition[0].weatherDesc[0].value,
        humidity: data.current_condition[0].humidity + '%'
      };
    } catch (error) {
      return { error: 'Weather data not available' };
    }
  }
});

// Usar Weather API
const weather = await globalAPI.handleRequest('global/weather', {
  city: 'London'
});
console.log('🌤️  Weather:', weather);

// ============================================
// EJEMPLO 2: Crear API de Crypto Exchange Rates
// ============================================
await globalAPI.createAPI({
  name: 'exchange',
  category: 'finance',
  method: 'GET',
  description: 'Get crypto exchange rates',
  handler: async ({ from, to }) => {
    const price = await globalAPI.handleRequest('mining/price', {
      coin: from.toLowerCase()
    });
    
    return {
      from,
      to,
      rate: price.price,
      timestamp: Date.now()
    };
  }
});

// Usar Exchange API
const rate = await globalAPI.handleRequest('finance/exchange', {
  from: 'bitcoin',
  to: 'usd'
});
console.log('💱 Exchange Rate:', rate);

// ============================================
// EJEMPLO 3: Crear API de GitHub Stats
// ============================================
await globalAPI.createAPI({
  name: 'github',
  category: 'developer',
  method: 'GET',
  description: 'Get GitHub repository stats',
  handler: async ({ owner, repo }) => {
    try {
      const data = await fetchData(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      return {
        name: data.name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        url: data.html_url
      };
    } catch (error) {
      return { error: 'Repository not found' };
    }
  }
});

// Usar GitHub API
const github = await globalAPI.handleRequest('developer/github', {
  owner: 'ethereum',
  repo: 'go-ethereum'
});
console.log('📦 GitHub:', github);

// ============================================
// EJEMPLO 4: Crear API de Calculator
// ============================================
await globalAPI.createAPI({
  name: 'calculator',
  category: 'utility',
  method: 'POST',
  description: 'Perform mathematical operations',
  handler: async ({ operation, a, b }) => {
    const ops = {
      'add': (x, y) => x + y,
      'subtract': (x, y) => x - y,
      'multiply': (x, y) => x * y,
      'divide': (x, y) => y !== 0 ? x / y : 'Error: Division by zero'
    };
    
    return {
      operation,
      a,
      b,
      result: ops[operation]?.(a, b) || 'Invalid operation'
    };
  }
});

// Usar Calculator API
const calc = await globalAPI.handleRequest('utility/calculator', {
  operation: 'multiply',
  a: 15,
  b: 7
});
console.log('🔢 Calculator:', calc);

// ============================================
// EJEMPLO 5: Crear API de Random Generator
// ============================================
await globalAPI.createAPI({
  name: 'random',
  category: 'utility',
  method: 'GET',
  description: 'Generate random data',
  handler: async ({ type = 'number', min = 0, max = 100 }) => {
    const generators = {
      'number': () => Math.floor(Math.random() * (max - min + 1)) + min,
      'string': () => Math.random().toString(36).substring(7),
      'uuid': () => crypto.randomUUID(),
      'hex': () => crypto.randomBytes(16).toString('hex')
    };
    
    return {
      type,
      value: generators[type]?.() || generators.number()
    };
  }
});

// Usar Random API
const random = await globalAPI.handleRequest('utility/random', {
  type: 'uuid'
});
console.log('🎲 Random:', random);

// ============================================
// EJEMPLO 6: Crear API de Text Analysis
// ============================================
await globalAPI.createAPI({
  name: 'analyze',
  category: 'nlp',
  method: 'POST',
  description: 'Analyze text data',
  handler: async ({ text }) => {
    const words = text.split(/\s+/);
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    
    return {
      wordCount: words.length,
      charCount: chars,
      sentenceCount: sentences,
      avgWordLength: (chars / words.length).toFixed(2)
    };
  }
});

// Usar Text Analysis API
const analysis = await globalAPI.handleRequest('nlp/analyze', {
  text: 'This is a sample text for analysis. It has multiple sentences!'
});
console.log('📝 Text Analysis:', analysis);

// ============================================
// EJEMPLO 7: Integración con Wallet
// ============================================
console.log('\n💼 Testing Wallet Integration...');

const walletResult = await globalAPI.handleRequest('wallet/create', {
  name: 'API Test Wallet',
  password: 'test123'
});
console.log('Wallet Created:', walletResult.address);

// ============================================
// EJEMPLO 8: Integración con Bridge
// ============================================
console.log('\n🌉 Testing Bridge Integration...');

const bridgeResult = await globalAPI.handleRequest('bridge/transfer', {
  token: '0x8C6D3D2693AAc34353950e61c0a393efA3E441c2',
  fromChain: 'polygon',
  toChain: 'sovereign',
  addressFrom: walletResult.address,
  addressTo: walletResult.address,
  amount: '50'
});
console.log('Bridge Transfer ID:', bridgeResult);

// ============================================
// EJEMPLO 9: Integración con Mining
// ============================================
console.log('\n⛏️  Testing Mining Integration...');

const maticPrice = await globalAPI.handleRequest('mining/price', {
  coin: 'matic-network'
});
console.log('MATIC Price:', maticPrice.price, 'USD');

// ============================================
// EJEMPLO 10: System Status
// ============================================
console.log('\n📊 System Status...');

const status = await globalAPI.handleRequest('system/status');
console.log('Status:', status);

const apis = await globalAPI.handleRequest('system/apis');
console.log('\nRegistered APIs:', apis.length);
apis.forEach(api => {
  console.log(`  - ${api.path} (${api.category})`);
});

// ============================================
// GUARDAR CONFIGURACIÓN
// ============================================
globalAPI.saveConfig();

console.log('\n✅ All examples completed!\n');
