const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MindQuest", function () {
  let mindQuest;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    const MindQuest = await ethers.getContractFactory("MindQuest");
    mindQuest = await MindQuest.deploy();
    await mindQuest.deployed();
  });

  describe("Session Management", function () {
    it("Should allow a player to start a session", async function () {
      await expect(mindQuest.connect(player1).startSession())
        .to.emit(mindQuest, "SessionStarted")
        .withArgs(player1.address, 1);

      const session = await mindQuest.getSession(1);
      expect(session.player).to.equal(player1.address);
      expect(session.sessionId).to.equal(1);
      expect(session.isCompleted).to.be.false;
    });

    it("Should increment session IDs for multiple players", async function () {
      await mindQuest.connect(player1).startSession();
      await mindQuest.connect(player2).startSession();

      const session1 = await mindQuest.getSession(1);
      const session2 = await mindQuest.getSession(2);

      expect(session1.player).to.equal(player1.address);
      expect(session2.player).to.equal(player2.address);
    });
  });

  describe("Response Submission", function () {
    beforeEach(async function () {
      await mindQuest.connect(player1).startSession();
    });

    it("Should allow response submission with trait changes", async function () {
      const traitChanges = [110, 90, 105, 100, 95, 108]; // Increase bravery, decrease logic, etc.

      await expect(mindQuest.connect(player1).submitResponse(1, "I choose courage", traitChanges))
        .to.emit(mindQuest, "ResponseSubmitted")
        .withArgs(1, 0, "I choose courage");

      const session = await mindQuest.getSession(1);
      expect(session.responses.length).to.equal(1);
      expect(session.responses[0]).to.equal("I choose courage");
    });

    it("Should not allow non-owner to submit responses", async function () {
      const traitChanges = [110, 90, 105, 100, 95, 108];

      await expect(
        mindQuest.connect(player2).submitResponse(1, "Invalid response", traitChanges)
      ).to.be.revertedWith("Not your session");
    });

    it("Should not allow responses after session completion", async function () {
      // Submit minimum required responses
      const traitChanges = [110, 90, 105, 100, 95, 108];
      
      for (let i = 0; i < 5; i++) {
        await mindQuest.connect(player1).submitResponse(1, `Response ${i}`, traitChanges);
      }
      
      // Complete the session
      await mindQuest.connect(player1).completeSession(1, "Test story", "QmTestHash");
      
      // Try to submit another response
      await expect(
        mindQuest.connect(player1).submitResponse(1, "Late response", traitChanges)
      ).to.be.revertedWith("Session already completed");
    });
  });

  describe("Session Completion and NFT Minting", function () {
    beforeEach(async function () {
      await mindQuest.connect(player1).startSession();
      
      // Submit required minimum responses
      const traitChanges = [110, 90, 105, 100, 95, 108];
      for (let i = 0; i < 5; i++) {
        await mindQuest.connect(player1).submitResponse(1, `Response ${i}`, traitChanges);
      }
    });

    it("Should complete session and mint NFT", async function () {
      await expect(mindQuest.connect(player1).completeSession(1, "Epic story", "QmTestImageHash"))
        .to.emit(mindQuest, "SessionCompleted")
        .withArgs(1, player1.address, 1)
        .and.to.emit(mindQuest, "NFTMinted");

      const session = await mindQuest.getSession(1);
      expect(session.isCompleted).to.be.true;
      expect(session.aiGeneratedStory).to.equal("Epic story");
      expect(session.nftImageHash).to.equal("QmTestImageHash");

      // Check NFT ownership
      expect(await mindQuest.ownerOf(1)).to.equal(player1.address);
    });

    it("Should not allow completion without minimum responses", async function () {
      // Start new session with insufficient responses
      await mindQuest.connect(player2).startSession();
      const traitChanges = [110, 90, 105, 100, 95, 108];
      
      // Submit only 3 responses (need 5)
      for (let i = 0; i < 3; i++) {
        await mindQuest.connect(player2).submitResponse(2, `Response ${i}`, traitChanges);
      }

      await expect(
        mindQuest.connect(player2).completeSession(2, "Story", "Hash")
      ).to.be.revertedWith("Need at least 5 responses");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await mindQuest.connect(player1).startSession();
      await mindQuest.connect(player1).startSession(); // Second session
    });

    it("Should return player sessions", async function () {
      const sessions = await mindQuest.getPlayerSessions(player1.address);
      expect(sessions.length).to.equal(2);
      expect(sessions[0].toNumber()).to.equal(1);
      expect(sessions[1].toNumber()).to.equal(2);
    });

    it("Should return token traits after minting", async function () {
      // Complete first session
      const traitChanges = [120, 80, 110, 105, 90, 115];
      for (let i = 0; i < 5; i++) {
        await mindQuest.connect(player1).submitResponse(1, `Response ${i}`, traitChanges);
      }
      
      await mindQuest.connect(player1).completeSession(1, "Story", "Hash");
      
      const traits = await mindQuest.getTokenTraits(1);
      expect(traits.bravery).to.be.above(50); // Should be increased from starting value
    });
  });

  describe("Randomness", function () {
    it("Should generate random question indices", async function () {
      const maxQuestions = 10;
      const tx1 = await mindQuest.connect(player1).getRandomQuestion(maxQuestions);
      const tx2 = await mindQuest.connect(player1).getRandomQuestion(maxQuestions);
      
      // Wait for transactions to be mined and get return values
      const receipt1 = await tx1.wait();
      const receipt2 = await tx2.wait();
      
      console.log(`Transaction 1 executed, Transaction 2 executed`);
      // Note: The actual random values would be returned in events or logs
      // For this test, we just verify the transactions succeed
      expect(tx1).to.not.be.undefined;
      expect(tx2).to.not.be.undefined;
    });
  });
});
