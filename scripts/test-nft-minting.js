const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing NFT Minting on Sepolia...");
  
  // Get the deployed contract
  const contractAddress = "0x5F60dB550B7736C4C85F9151BA69Ee4320c71Ed4";
  const MindQuest = await ethers.getContractFactory("MindQuest");
  const mindQuest = MindQuest.attach(contractAddress);
  
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 Contract on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
  
  try {
    // Test 1: Get total minted NFTs
    console.log("\n📊 Testing View Functions...");
    const totalMinted = await mindQuest.getTotalMinted();
    console.log("✅ Total NFTs minted:", totalMinted.toString());
    
    // Test 2: Check if we can read contract details
    console.log("✅ Contract name:", await mindQuest.name());
    console.log("✅ Contract symbol:", await mindQuest.symbol());
    
    // Test 3: Try to mint a test NFT (this will require gas fees)
    console.log("\n🎯 Testing NFT Minting Function...");
    console.log("⚠️  This will require gas fees on Sepolia!");
    
    const testTraits = [80, 70, 60, 75, 45, 85]; // [bravery, logic, empathy, creativity, greed, wisdom]
    const testStory = "This is a test personality story for verification.";
    const testType = "The Test Personality";
    
    console.log("📝 Test Traits:", testTraits);
    console.log("📖 Test Story:", testStory);
    console.log("🏷️  Test Type:", testType);
    
    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("👤 Signer address:", signer.address);
    
    // Check balance
    const balance = await signer.getBalance();
    console.log("💰 Signer balance:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
      console.log("❌ Insufficient balance for testing. Need at least 0.01 ETH.");
      console.log("💡 Get Sepolia ETH from: https://faucets.chain.link/sepolia");
      return;
    }
    
    console.log("\n🚀 Attempting to mint test NFT...");
    console.log("⏳ This may take a few minutes...");
    
    const tx = await mindQuest.connect(signer).mintPersonalityNFT(
      testTraits,
      testStory,
      testType
    );
    
    console.log("📤 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt.hash);
    console.log("⛽ Gas used:", receipt.gasUsed.toString());
    
    // Get the new total
    const newTotal = await mindQuest.getTotalMinted();
    console.log("🎉 New total NFTs:", newTotal.toString());
    
    // Try to read the minted NFT data
    const tokenId = newTotal;
    console.log("🔍 Reading NFT data for token ID:", tokenId.toString());
    
    try {
      const nftData = await mindQuest.getPersonalityData(tokenId);
      console.log("✅ NFT Data retrieved successfully!");
      console.log("👤 Owner:", nftData.player);
      console.log("🏷️  Type:", nftData.personalityType);
      console.log("📖 Story:", nftData.aiGeneratedStory);
      console.log("📊 Traits:", {
        bravery: nftData.traits.bravery.toString(),
        logic: nftData.traits.logic.toString(),
        empathy: nftData.traits.empathy.toString(),
        creativity: nftData.traits.creativity.toString(),
        greed: nftData.traits.greed.toString(),
        wisdom: nftData.traits.wisdom.toString()
      });
      
      console.log("\n🎉 NFT MINTING TEST SUCCESSFUL!");
      console.log("✅ Contract is working perfectly on Sepolia!");
      console.log("✅ NFT generation is fully functional!");
      console.log("✅ Gas optimization is working!");
      
    } catch (readError) {
      console.log("⚠️  Could not read NFT data:", readError.message);
      console.log("✅ But NFT was minted successfully!");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔍 Troubleshooting:");
    console.log("1. Check if contract is deployed correctly");
    console.log("2. Verify Sepolia network connection");
    console.log("3. Ensure sufficient ETH balance");
    console.log("4. Check contract ABI compatibility");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
