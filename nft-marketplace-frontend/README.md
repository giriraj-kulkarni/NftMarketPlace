# NFT Marketplace Frontend

A modern, responsive NFT marketplace built with Next.js 14, TypeScript, and Tailwind CSS. This frontend integrates seamlessly with your Ethereum smart contract to provide a complete NFT trading experience.

## ✨ Features

- 🔗 **MetaMask Integration** - Connect wallet with one click
- 🎨 **Create NFTs** - Upload images and mint NFTs directly to the blockchain
- 🛒 **Buy/Sell NFTs** - Complete marketplace functionality with real-time updates
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Find NFTs quickly with real-time search
- 💰 **Price Display** - Clear ETH pricing for all transactions
- 🖼️ **IPFS Storage** - Decentralized storage for NFT metadata and images
- ⚡ **Fast Loading** - Optimized performance with Next.js 14
- 🎯 **TypeScript** - Type-safe development for reliability

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum with ethers.js v5
- **Storage**: IPFS via Pinata
- **State Management**: React Hooks
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Pinata account (for IPFS storage)
- Your deployed NFT marketplace smart contract

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Your deployed smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Get these from https://pinata.cloud/
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key

# Network settings (optional)
NEXT_PUBLIC_NETWORK_ID=31337
NEXT_PUBLIC_NETWORK_NAME=localhost
```

### 3. Get Pinata API Keys

1. Sign up at [Pinata.cloud](https://pinata.cloud/)
2. Go to API Keys in your dashboard
3. Create a new API key with full permissions
4. Copy the API Key and Secret to your `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your marketplace!

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Home page
│   ├── marketplace/       # Browse NFTs
│   ├── create/           # Create new NFTs
│   ├── my-nfts/         # User's NFT collection
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── Navigation.tsx    # Main navigation
│   └── NFTCard.tsx      # NFT display card
├── hooks/                # Custom React hooks
│   ├── useWeb3.ts       # Wallet connection
│   └── useNFTContract.ts # Smart contract interaction
├── lib/                  # Utility libraries
│   └── contracts.ts     # Contract ABI and address
└── types/               # TypeScript type definitions
    └── nft.ts          # NFT-related types
```

## 🔧 Configuration

### Smart Contract Integration

The frontend works with your NFTMarketplace smart contract. Required functions:

- `createToken(tokenURI, price)` - Mint new NFT
- `fetchMarketItem()` - Get all marketplace NFTs
- `fetchMyNFT()` - Get user's NFTs
- `createMarketSale(tokenId)` - Buy an NFT
- `getListingPrice()` - Get marketplace fee

### IPFS Configuration

The app uses Pinata for IPFS storage:
- Images are uploaded to IPFS first
- Metadata JSON is then uploaded to IPFS
- The metadata URI is stored in the smart contract

## 🐛 Troubleshooting

### Common Issues

**MetaMask not connecting**
- Ensure MetaMask is installed and unlocked
- Check site permissions
- Try refreshing the page

**Transaction fails**
- Check you have enough ETH for gas
- Verify correct network
- Confirm contract address

**Images not loading**
- Verify Pinata API keys
- Check file size (max 10MB)
- Test IPFS gateway

## 🌐 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

Built with ❤️ for the Web3 community
