const hre = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("Deploying NFTMarketplace contract...");
    
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();

    // Wait for deployment to be mined
    await nftMarketplace.waitForDeployment();
    
    const contractAddress = await nftMarketplace.getAddress();
    console.log("NFTMarketplace deployed to:", contractAddress);
    console.log("Network:", hre.network.name);
    
    // Save the contract address to a file for frontend use
    const contractData = {
        address: contractAddress,
        network: hre.network.name,
        chainId: hre.network.config.chainId || 'unknown'
    };
    
    fs.writeFileSync('./contract-address.json', JSON.stringify(contractData, null, 2));
    console.log("Contract address saved to contract-address.json");
    
    // Get the listing price for reference
    const listingPrice = await nftMarketplace.getListingPrice();
    console.log("Listing Price:", hre.ethers.formatEther(listingPrice), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
