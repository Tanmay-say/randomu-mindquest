const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying MindQuest contract to Sepolia testnet...");

  // Check if we have any signers available
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    console.error("❌ Error: No deployer account found!");
    console.log("📋 Please add your private key to .env file:");
    console.log("PRIVATE_KEY=0x_your_private_key_here");
    console.log("");
    console.log("🔑 How to get your private key:");
    console.log("1. Open MetaMask → 3 dots → Account Details");
    console.log("2. Export Private Key → Enter password");
    console.log("3. Copy the private key (starts with 0x)");
    console.log("");
    console.log("💰 Don't forget to get Sepolia ETH:");
    console.log("Visit: https://faucets.chain.link/sepolia");
    process.exit(1);
  }

  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.eq(0)) {
    console.error("❌ Error: Deployer account has no ETH!");
    console.log("Please add Sepolia ETH to your account:");
    console.log("- Visit: https://faucets.chain.link/sepolia");
    console.log("- Get free Sepolia ETH for:", deployer.address);
    process.exit(1);
  }

  // Get the ContractFactory
  const MindQuest = await ethers.getContractFactory("MindQuest");

  console.log("📋 Deploying contract...");
  // Deploy the contract
  const mindQuest = await MindQuest.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await mindQuest.deployed();

  const contractAddress = mindQuest.address;
  const network = await ethers.provider.getNetwork();
  
  console.log("✅ MindQuest deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("👤 Deployer:", deployer.address);
  console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deploymentTime: new Date().toISOString(),
    network: "sepolia",
    chainId: network.chainId,
    deployer: deployer.address,
    etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`
  };
  
  fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json");
  
  // Update frontend environment
  const frontendEnvPath = './frontend/.env.local';
  let envContent = `# Sepolia Deployment Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GROQ_API_KEY=demo-key`;
  
  try {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("🎨 Frontend environment updated automatically!");
  } catch (error) {
    console.log("⚠️  Please manually update frontend/.env.local with:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`NEXT_PUBLIC_CHAIN_ID=11155111`);
  }
  
  console.log("\n🎉 Deployment Complete!");
  console.log("\n📋 Next Steps:");
  console.log("1. 🦊 Configure MetaMask for Sepolia testnet");
  console.log("2. 💰 Get Sepolia ETH: https://faucets.chain.link/sepolia");
  console.log("3. 🎮 Visit http://localhost:3000 to play!");
  console.log("\n🔍 Optional - Verify contract:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });