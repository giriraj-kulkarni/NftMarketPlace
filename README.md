# 🛒 NFT Marketplace (Hardhat + Next.js)

A decentralized NFT Marketplace built with **Hardhat**, **Solidity**, and **Next.js**.  
Users can mint, buy, and sell NFTs locally on a Hardhat blockchain.

---

## 🚀 Quick Start

Clone the repo, install dependencies, start Hardhat, deploy contracts, and launch the frontend:

```bash
git clone https://github.com/giriraj-kulkarni/nft-marketplace.git
cd nft-marketplace
npm install
npx hardhat node & npx hardhat run scripts/deploy.js --network localhost & npm run dev


### Now open 👉 http://localhost:3000 in your browser and connect MetaMask to the Hardhat local network (http://127.0.0.1:8545).

# Useful Commands

npx hardhat compile   # Compile contracts
npx hardhat test      # Run tests
npx hardhat node      # Start local blockchain
npm run dev           # Run Next.js frontend



License

MIT