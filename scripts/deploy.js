const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MindQuest Smart Contract to Sepolia...");
  
  // Check if private key is available
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("❌ PRIVATE_KEY environment variable is missing!");
  }

  // Ensure private key has 0x prefix
  const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  
  // Get deployer account
  const deployer = new ethers.Wallet(formattedPrivateKey, ethers.provider);
  console.log("📱 Deployer address:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Deployer balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    throw new Error("❌ Insufficient balance! Need at least 0.01 ETH for deployment.");
  }

  try {
    // Deploy the contract
    console.log("📜 Deploying MindQuest contract...");
    const MindQuest = await ethers.getContractFactory("MindQuest");
    const mindQuest = await MindQuest.deploy();
    
    console.log("⏳ Waiting for deployment confirmation...");
    await mindQuest.deployed();
    
    console.log("✅ MindQuest deployed to:", mindQuest.address);
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: mindQuest.address,
      deployer: deployer.address,
      network: "sepolia",
      timestamp: new Date().toISOString(),
      contractName: "MindQuest",
      description: "AI Personality Game NFT Contract - Optimized for single gas fee"
    };
    
    const fs = require('fs');
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment info saved to deployment-info.json");
    
    // Update frontend environment file
    const envContent = `# MindQuest Frontend Environment Variables
NEXT_PUBLIC_CONTRACT_ADDRESS=${mindQuest.address}
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_GROQ_API_KEY=${process.env.GROQ_API_KEY || 'demo-key'}

# Contract Details
# This contract is optimized to only require gas fees for NFT minting
# All questions and AI generation happen locally - NO BLOCKCHAIN CALLS until minting!
`;
    
    fs.writeFileSync('frontend/.env.local', envContent);
    console.log("📁 Frontend .env.local updated");
    
    // Display deployment summary
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" .repeat(50));
    console.log("Contract Address:", mindQuest.address);
    console.log("Network: Sepolia Testnet");
    console.log("Deployer:", deployer.address);
    console.log("Gas Used:", (await mindQuest.deployTransaction.wait()).gasUsed.toString());
    console.log("\n💡 NEXT STEPS:");
    console.log("1. Copy the contract address above");
    console.log("2. Verify the contract on Sepolia Etherscan");
    console.log("3. Test the frontend with the new contract");
    console.log("4. Users will now only pay gas fees when minting NFTs!");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });