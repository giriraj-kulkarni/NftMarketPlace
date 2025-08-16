const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying NFT Marketplace to Hardhat Local Network...");

  // Get the contract factory
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  
  // Deploy the contract
  const nftMarketplace = await NFTMarketplace.deploy();
  
  // Wait for deployment to finish
  await nftMarketplace.deploymentTransaction().wait();

  console.log("NFT Marketplace deployed to:", await nftMarketplace.getAddress());
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.chainId);
  
  // Save the contract address to a file for the frontend
  const fs = require('fs');
  const contractInfo = {
    address: await nftMarketplace.getAddress(),
    networkId: network.chainId,
    networkName: 'localhost'
  };
  
  fs.writeFileSync(
    './nft-marketplace-frontend/.env.local',
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractInfo.address}\nNEXT_PUBLIC_NETWORK_ID=${contractInfo.networkId}\nNEXT_PUBLIC_NETWORK_NAME=${contractInfo.networkName}\nNEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`
  );
  
  console.log("Contract info saved to .env.local");
  console.log("Contract Address:", contractInfo.address);
  console.log("Network ID:", contractInfo.networkId);
  
  // Verify the contract deployment
  const listingPrice = await nftMarketplace.getListingPrice();
  console.log("Listing Price:", ethers.formatEther(listingPrice), "ETH");
  
  return nftMarketplace;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
