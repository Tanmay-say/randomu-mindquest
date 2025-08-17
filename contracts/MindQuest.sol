// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MindQuest - AI Personality Game NFT Contract
 * @dev A gamified personality test that mints unique NFTs based on user responses
 */
contract MindQuest is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // Structs
    struct PersonalityTraits {
        uint8 bravery;
        uint8 logic;
        uint8 empathy;
        uint8 creativity;
        uint8 greed;
        uint8 wisdom;
    }

    struct GameSession {
        address player;
        uint256 sessionId;
        PersonalityTraits traits;
        string[] responses;
        bool isCompleted;
        uint256 timestamp;
        string aiGeneratedStory;
        string nftImageHash;
    }

    // State variables
    uint256 private _nextTokenId = 1;
    uint256 private _sessionCounter = 1;
    
    mapping(uint256 => GameSession) public gameSessions;
    mapping(address => uint256[]) public playerSessions;
    mapping(uint256 => PersonalityTraits) public tokenTraits;
    
    // Events
    event SessionStarted(address indexed player, uint256 indexed sessionId);
    event ResponseSubmitted(uint256 indexed sessionId, uint8 questionIndex, string response);
    event SessionCompleted(uint256 indexed sessionId, address indexed player, uint256 tokenId);
    event NFTMinted(address indexed player, uint256 indexed tokenId, string personalityType);

    // Randomness source (using blockhash for simplicity - in production use Chainlink VRF)
    uint256 private nonce = 0;

    constructor() ERC721("MindQuest Personality", "MQP") Ownable(msg.sender) {}

    /**
     * @dev Start a new game session
     */
    function startSession() external returns (uint256) {
        uint256 sessionId = _sessionCounter++;
        
        gameSessions[sessionId] = GameSession({
            player: msg.sender,
            sessionId: sessionId,
            traits: PersonalityTraits(50, 50, 50, 50, 50, 50), // Initialize with neutral values
            responses: new string[](0),
            isCompleted: false,
            timestamp: block.timestamp,
            aiGeneratedStory: "",
            nftImageHash: ""
        });
        
        playerSessions[msg.sender].push(sessionId);
        
        emit SessionStarted(msg.sender, sessionId);
        return sessionId;
    }

    /**
     * @dev Submit a response to a question
     */
    function submitResponse(
        uint256 sessionId,
        string calldata response,
        uint8[6] calldata traitChanges // Changes to [bravery, logic, empathy, creativity, greed, wisdom]
    ) external {
        require(gameSessions[sessionId].player == msg.sender, "Not your session");
        require(!gameSessions[sessionId].isCompleted, "Session already completed");
        
        GameSession storage session = gameSessions[sessionId];
        session.responses.push(response);
        
        // Update personality traits based on response
        session.traits.bravery = _adjustTrait(session.traits.bravery, traitChanges[0]);
        session.traits.logic = _adjustTrait(session.traits.logic, traitChanges[1]);
        session.traits.empathy = _adjustTrait(session.traits.empathy, traitChanges[2]);
        session.traits.creativity = _adjustTrait(session.traits.creativity, traitChanges[3]);
        session.traits.greed = _adjustTrait(session.traits.greed, traitChanges[4]);
        session.traits.wisdom = _adjustTrait(session.traits.wisdom, traitChanges[5]);
        
        emit ResponseSubmitted(sessionId, uint8(session.responses.length - 1), response);
    }

    /**
     * @dev Complete a session and mint NFT
     */
    function completeSession(
        uint256 sessionId,
        string calldata aiStory,
        string calldata imageHash
    ) external {
        require(gameSessions[sessionId].player == msg.sender, "Not your session");
        require(!gameSessions[sessionId].isCompleted, "Session already completed");
        require(gameSessions[sessionId].responses.length >= 5, "Need at least 5 responses");
        
        GameSession storage session = gameSessions[sessionId];
        session.isCompleted = true;
        session.aiGeneratedStory = aiStory;
        session.nftImageHash = imageHash;
        
        // Mint NFT
        uint256 tokenId = _mintPersonalityNFT(msg.sender, session.traits, sessionId);
        
        emit SessionCompleted(sessionId, msg.sender, tokenId);
    }

    /**
     * @dev Internal function to mint personality NFT
     */
    function _mintPersonalityNFT(
        address to,
        PersonalityTraits memory traits,
        uint256 sessionId
    ) internal returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        tokenTraits[tokenId] = traits;
        
        // Generate personality type string
        string memory personalityType = _generatePersonalityType(traits);
        
        // Create metadata URI (would be hosted on IPFS in production)
        string memory tokenURI = _generateTokenURI(tokenId, traits, sessionId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(to, tokenId, personalityType);
        return tokenId;
    }

    /**
     * @dev Generate personality type based on dominant traits
     */
    function _generatePersonalityType(PersonalityTraits memory traits) internal pure returns (string memory) {
        if (traits.bravery >= 80) return "The Fearless Warrior";
        if (traits.logic >= 80) return "The Analytical Mind";
        if (traits.empathy >= 80) return "The Compassionate Soul";
        if (traits.creativity >= 80) return "The Innovative Dreamer";
        if (traits.greed >= 80) return "The Ambitious Collector";
        if (traits.wisdom >= 80) return "The Enlightened Sage";
        
        // Balanced personality
        if (traits.bravery >= 60 && traits.wisdom >= 60) return "The Brave Wise One";
        if (traits.logic >= 60 && traits.creativity >= 60) return "The Creative Analyst";
        if (traits.empathy >= 60 && traits.logic >= 60) return "The Rational Healer";
        
        return "The Balanced Seeker";
    }

    /**
     * @dev Generate token URI with metadata (simplified)
     */
    function _generateTokenURI(
        uint256 tokenId,
        PersonalityTraits memory traits,
        uint256 sessionId
    ) internal view returns (string memory) {
        // Simple URI pointing to off-chain metadata (for production, use IPFS)
        return string(abi.encodePacked(
            "https://api.mindquest.game/metadata/",
            tokenId.toString()
        ));
    }

    /**
     * @dev Adjust trait value safely
     */
    function _adjustTrait(uint8 currentValue, uint8 change) internal pure returns (uint8) {
        if (change > 100) { // Positive change
            uint8 increase = change - 100;
            return currentValue + increase > 100 ? 100 : currentValue + increase;
        } else { // Negative change
            uint8 decrease = 100 - change;
            return currentValue < decrease ? 0 : currentValue - decrease;
        }
    }

    /**
     * @dev Get random number for questions (simplified)
     */
    function getRandomQuestion(uint256 maxQuestions) external returns (uint256) {
        nonce++;
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % maxQuestions;
    }

    // View functions
    function getSession(uint256 sessionId) external view returns (GameSession memory) {
        return gameSessions[sessionId];
    }

    function getPlayerSessions(address player) external view returns (uint256[] memory) {
        return playerSessions[player];
    }

    function getTokenTraits(uint256 tokenId) external view returns (PersonalityTraits memory) {
        return tokenTraits[tokenId];
    }

    // Override functions
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
