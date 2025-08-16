const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up NFT Marketplace for local development...\n');

// Compile contracts
console.log('📦 Compiling smart contracts...');
try {
  execSync('npx hardhat compile', { stdio: 'inherit' });
  console.log('✅ Contracts compiled successfully');
} catch (error) {
  console.log('❌ Contract compilation failed');
  process.exit(1);
}

// Check if Hardhat node is running
try {
  execSync('curl -s http://127.0.0.1:8545', { stdio: 'pipe' });
  console.log('✅ Hardhat node is already running');
} catch (error) {
  console.log('\n🔥 Starting Hardhat local blockchain...');
  console.log('   This will start Hardhat node in the background.');
  console.log('   You can stop it later with: pkill node\n');
  
  // Start Hardhat node in background
  try {
    execSync('npx hardhat node --silent &', { stdio: 'pipe' });
    // Wait a bit for Hardhat node to start
    setTimeout(() => {
      console.log('✅ Hardhat node started successfully');
    }, 3000);
  } catch (error) {
    console.log('❌ Failed to start Hardhat node');
    process.exit(1);
  }
}

// Wait a bit more for the node to be ready
setTimeout(async () => {
  // Deploy contract
  console.log('\n🚀 Deploying NFT Marketplace contract...');
  try {
    execSync('npx hardhat run scripts/deploy-localhost.js --network localhost', { stdio: 'inherit' });
    console.log('✅ Contract deployed successfully');
  } catch (error) {
    console.log('❌ Contract deployment failed');
    process.exit(1);
  }

  // Check if .env.local was created
  const envPath = path.join(__dirname, '../nft-marketplace-frontend/.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ Environment variables configured');
  } else {
    console.log('❌ Environment file not created');
    process.exit(1);
  }

  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Open a new terminal and run: npm run frontend:dev');
  console.log('2. Open your browser to: http://localhost:3000');
  console.log('3. Connect your MetaMask wallet');
  console.log('4. Switch to Hardhat network (Chain ID: 31337)');
  console.log('5. Import one of the test accounts with private keys:');
  console.log('   - 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
  console.log('   - 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
  console.log('   - 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a');
  console.log('\n🔧 Useful commands:');
  console.log('   - Stop Hardhat node: pkill node');
  console.log('   - Restart setup: npm run setup');
  console.log('   - View Hardhat node: npx hardhat node');
}, 4000);
