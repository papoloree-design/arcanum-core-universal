const fs = require('fs');
const path = require('path');

const contracts = [
  'SoberanoERC20',
  'SoberanoERC721',
  'SoberanoERC1155',
  'TokenFactory'
];

console.log('📦 Extrayendo bytecodes...\n');

contracts.forEach(contractName => {
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const bytecode = artifact.bytecode.replace('0x', '');
    
    const outputPath = path.join(__dirname, '..', 'bytecodes', `${contractName}.bin`);
    fs.writeFileSync(outputPath, bytecode);
    
    console.log(`✅ ${contractName}`);
    console.log(`   Size: ${bytecode.length / 2} bytes`);
    console.log(`   Output: bytecodes/${contractName}.bin\n`);
  } else {
    console.log(`❌ ${contractName} - artifact not found\n`);
  }
});

console.log('✅ Bytecodes extraídos exitosamente!');
