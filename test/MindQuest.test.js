const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MindQuest", function () {
  let MindQuest;
  let mindQuest;
  let owner;
  let player;

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();
    
    MindQuest = await ethers.getContractFactory("MindQuest");
    mindQuest = await MindQuest.deploy();
    await mindQuest.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mindQuest.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await mindQuest.name()).to.equal("MindQuest Personality");
      expect(await mindQuest.symbol()).to.equal("MQP");
    });

    it("Should start with 0 total minted", async function () {
      expect(await mindQuest.getTotalMinted()).to.equal(0);
    });
  });

  describe("NFT Minting", function () {
    const sampleTraits = [80, 70, 60, 75, 45, 85]; // [bravery, logic, empathy, creativity, greed, wisdom]
    const sampleStory = "You are a brave and wise individual who values logic and creativity.";
    const sampleType = "The Brave Wise One";

    it("Should mint NFT successfully", async function () {
      const tx = await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      // Check total minted increased
      expect(await mindQuest.getTotalMinted()).to.equal(1);
    });

    it("Should store personality data correctly", async function () {
      await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      const tokenId = 1;
      const data = await mindQuest.getPersonalityData(tokenId);
      
      expect(data.player).to.equal(player.address);
      expect(data.traits.bravery).to.equal(sampleTraits[0]);
      expect(data.traits.logic).to.equal(sampleTraits[1]);
      expect(data.traits.empathy).to.equal(sampleTraits[2]);
      expect(data.traits.creativity).to.equal(sampleTraits[3]);
      expect(data.traits.greed).to.equal(sampleTraits[4]);
      expect(data.traits.wisdom).to.equal(sampleTraits[5]);
      expect(data.aiGeneratedStory).to.equal(sampleStory);
      expect(data.personalityType).to.equal(sampleType);
    });

    it("Should emit NFTMinted event", async function () {
      await expect(
        mindQuest.connect(player).mintPersonalityNFT(
          sampleTraits,
          sampleStory,
          sampleType
        )
      ).to.emit(mindQuest, "NFTMinted")
        .withArgs(player.address, 1, sampleType, sampleTraits);
    });

    it("Should assign NFT to the correct owner", async function () {
      await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      expect(await mindQuest.ownerOf(1)).to.equal(player.address);
    });

    it("Should allow multiple NFTs to be minted", async function () {
      // Mint first NFT
      await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      // Mint second NFT with different data
      const traits2 = [60, 80, 70, 65, 55, 75];
      const story2 = "You are a logical and empathetic person.";
      const type2 = "The Analytical Mind";

      await mindQuest.connect(player).mintPersonalityNFT(
        traits2,
        story2,
        type2
      );

      expect(await mindQuest.getTotalMinted()).to.equal(2);
      expect(await mindQuest.ownerOf(1)).to.equal(player.address);
      expect(await mindQuest.ownerOf(2)).to.equal(player.address);
    });
  });

  describe("View Functions", function () {
    it("Should return correct token traits", async function () {
      const sampleTraits = [80, 70, 60, 75, 45, 85];
      const sampleStory = "Test story";
      const sampleType = "Test Type";

      await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      const traits = await mindQuest.getTokenTraits(1);
      expect(traits.bravery).to.equal(sampleTraits[0]);
      expect(traits.logic).to.equal(sampleTraits[1]);
      expect(traits.empathy).to.equal(sampleTraits[2]);
      expect(traits.creativity).to.equal(sampleTraits[3]);
      expect(traits.greed).to.equal(sampleTraits[4]);
      expect(traits.wisdom).to.equal(sampleTraits[5]);
    });

    it("Should return correct total minted count", async function () {
      expect(await mindQuest.getTotalMinted()).to.equal(0);

      const sampleTraits = [80, 70, 60, 75, 45, 85];
      const sampleStory = "Test story";
      const sampleType = "Test Type";

      await mindQuest.connect(player).mintPersonalityNFT(
        sampleTraits,
        sampleStory,
        sampleType
      );

      expect(await mindQuest.getTotalMinted()).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle empty strings for story and type", async function () {
      const sampleTraits = [80, 70, 60, 75, 45, 85];
      
      await expect(
        mindQuest.connect(player).mintPersonalityNFT(
          sampleTraits,
          "",
          ""
        )
      ).to.not.be.reverted;
    });

    it("Should handle very long strings", async function () {
      const sampleTraits = [80, 70, 60, 75, 45, 85];
      const longStory = "A".repeat(1000); // Very long story
      const longType = "B".repeat(100);   // Very long type
      
      await expect(
        mindQuest.connect(player).mintPersonalityNFT(
          sampleTraits,
          longStory,
          longType
        )
      ).to.not.be.reverted;
    });
  });
});
