// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MindQuest - AI Personality Game NFT Contract
 * @dev A gamified personality test that mints unique NFTs based on user responses
 * @dev Optimized to only require gas fees for NFT minting
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

    struct PersonalityData {
        address player;
        PersonalityTraits traits;
        string aiGeneratedStory;
        string personalityType;
        uint256 timestamp;
    }

    // State variables
    uint256 private _nextTokenId = 1;
    mapping(uint256 => PersonalityData) public personalityData;
    mapping(uint256 => PersonalityTraits) public tokenTraits;
    
    // Events
    event NFTMinted(
        address indexed player, 
        uint256 indexed tokenId, 
        string personalityType,
        PersonalityTraits traits
    );

    constructor() ERC721("MindQuest Personality", "MQP") Ownable(msg.sender) {}

    /**
     * @dev Mint personality NFT with all data (only gas fee required)
     * @param traits The calculated personality traits
     * @param aiStory The AI-generated personality story
     * @param personalityType The determined personality type
     */
    function mintPersonalityNFT(
        PersonalityTraits calldata traits,
        string calldata aiStory,
        string calldata personalityType
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        
        // Store personality data
        personalityData[tokenId] = PersonalityData({
            player: msg.sender,
            traits: traits,
            aiGeneratedStory: aiStory,
            personalityType: personalityType,
            timestamp: block.timestamp
        });
        
        // Store traits for easy access
        tokenTraits[tokenId] = traits;
        
        // Set token URI
        string memory tokenURI = _generateTokenURI(tokenId, traits, personalityType);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(msg.sender, tokenId, personalityType, traits);
        return tokenId;
    }

    /**
     * @dev Generate token URI with metadata
     */
    function _generateTokenURI(
        uint256 tokenId,
        PersonalityTraits memory traits,
        string memory personalityType
    ) internal view returns (string memory) {
        // For production, this would be IPFS metadata
        return string(abi.encodePacked(
            "https://api.mindquest.game/metadata/",
            tokenId.toString()
        ));
    }

    // View functions
    function getPersonalityData(uint256 tokenId) external view returns (PersonalityData memory) {
        return personalityData[tokenId];
    }

    function getTokenTraits(uint256 tokenId) external view returns (PersonalityTraits memory) {
        return tokenTraits[tokenId];
    }

    function getTotalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
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
