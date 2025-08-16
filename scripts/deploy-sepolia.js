const hre = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🚀 Deploying NFTMarketplace contract to Sepolia...");
    
    // Check if private key is set
    if (!process.env.PRIVATE_KEY) {
        throw new Error("❌ PRIVATE_KEY not found in environment variables");
    }

    // Check if RPC URL is set
    if (!process.env.SEPOLIA_RPC_URL) {
        throw new Error("❌ SEPOLIA_RPC_URL not found in environment variables");
    }

    console.log("📋 Network: Sepolia Testnet");
    console.log("🔗 RPC URL:", process.env.SEPOLIA_RPC_URL);
    
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    console.log("📦 Contract factory created");
    
    const nftMarketplace = await NFTMarketplace.deploy();
    console.log("⏳ Deploying contract...");

    // Wait for deployment to be mined
    await nftMarketplace.waitForDeployment();
    
    const contractAddress = await nftMarketplace.getAddress();
    console.log("✅ NFTMarketplace deployed to:", contractAddress);
    console.log("🌐 Network:", hre.network.name);
    console.log("🔗 Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    
    // Save the contract address to a file for frontend use
    const contractData = {
        address: contractAddress,
        network: hre.network.name,
        chainId: hre.network.config.chainId || 11155111,
        deploymentTime: new Date().toISOString()
    };
    
    fs.writeFileSync('./contract-address.json', JSON.stringify(contractData, null, 2));
    console.log("💾 Contract address saved to contract-address.json");
    
    // Get the listing price for reference
    const listingPrice = await nftMarketplace.getListingPrice();
    console.log("💰 Listing Price:", hre.ethers.formatEther(listingPrice), "ETH");
    
    console.log("\n🎉 Deployment successful!");
    console.log("📝 Next steps:");
    console.log("1. Copy the contract address to your frontend .env.local file");
    console.log("2. Verify the contract on Etherscan (optional)");
    console.log("3. Test the marketplace functionality");
    
    return contractAddress;
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});

