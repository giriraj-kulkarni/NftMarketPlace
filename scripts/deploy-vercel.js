const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying NFT Marketplace to Vercel...\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI is not installed. Please install it first:');
  console.log('   npm install -g vercel');
  process.exit(1);
}

// Check if .env.local exists
const envPath = path.join(__dirname, '../nft-marketplace-frontend/.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found. Please run setup first:');
  console.log('   npm run setup');
  process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('📋 Environment variables found:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

// Build the frontend
console.log('\n📦 Building frontend...');
try {
  execSync('npm run frontend:build', { stdio: 'inherit' });
  console.log('✅ Frontend built successfully');
} catch (error) {
  console.log('❌ Frontend build failed');
  process.exit(1);
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
try {
  // Set environment variables for Vercel
  Object.entries(envVars).forEach(([key, value]) => {
    execSync(`vercel env add ${key} production`, { 
      input: value,
      stdio: ['pipe', 'pipe', 'pipe']
    });
  });

  // Deploy
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.log('❌ Deployment failed');
  console.log('You can try deploying manually:');
  console.log('1. cd nft-marketplace-frontend');
  console.log('2. vercel --prod');
  process.exit(1);
}

console.log('\n🎉 Your NFT Marketplace is now live on Vercel!');
console.log('\n📋 Next steps:');
console.log('1. Set up your domain (optional)');
console.log('2. Configure environment variables in Vercel dashboard');
console.log('3. Test the marketplace functionality');
console.log('4. Deploy your smart contract to a testnet/mainnet');
