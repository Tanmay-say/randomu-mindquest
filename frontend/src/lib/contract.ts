import { ethers } from 'ethers';

// TypeScript declarations for ethereum window object
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (params: unknown) => void) => void;
      removeListener: (event: string, callback: (params: unknown) => void) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

// Simplified ABI for the new MindQuest contract
export const MINDQUEST_ABI = [
  "function mintPersonalityNFT(tuple(uint8 bravery, uint8 logic, uint8 empathy, uint8 creativity, uint8 greed, uint8 wisdom) traits, string aiStory, string personalityType) external returns (uint256)",
  "function getPersonalityData(uint256 tokenId) external view returns (tuple(address player, tuple(uint8 bravery, uint8 logic, uint8 empathy, uint8 creativity, uint8 greed, uint8 wisdom) traits, string aiGeneratedStory, string personalityType, uint256 timestamp))",
  "function getTokenTraits(uint256 tokenId) external view returns (tuple(uint8 bravery, uint8 logic, uint8 empathy, uint8 creativity, uint8 greed, uint8 wisdom))",
  "function getTotalMinted() external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "event NFTMinted(address indexed player, uint256 indexed tokenId, string personalityType, tuple(uint8 bravery, uint8 logic, uint8 empathy, uint8 creativity, uint8 greed, uint8 wisdom) traits)"
];

// Contract address - Updated with newly deployed gas-optimized contract
// This will work in both development and production
export const MINDQUEST_ADDRESS = '0x5F60dB550B7736C4C85F9151BA69Ee4320c71Ed4';

// Environment-aware configuration
export const getEnvironmentConfig = () => {
  const isProduction = typeof window !== 'undefined' 
    ? window.location.hostname !== 'localhost' 
    : process.env.NODE_ENV === 'production';
  
  return {
    isProduction,
    contractAddress: MINDQUEST_ADDRESS,
    network: 'sepolia',
    chainId: 11155111,
    explorerUrl: 'https://sepolia.etherscan.io',
    groqApiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || 'demo-key'
  };
};

export interface PersonalityTraits {
  bravery: number;
  logic: number;
  empathy: number;
  creativity: number;
  greed: number;
  wisdom: number;
}

export interface PersonalityData {
  player: string;
  traits: PersonalityTraits;
  aiGeneratedStory: string;
  personalityType: string;
  timestamp: number;
}

export class MindQuestContract {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(signer: ethers.JsonRpcSigner) {
    if (!MINDQUEST_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    
    this.signer = signer;
    this.contract = new ethers.Contract(MINDQUEST_ADDRESS, MINDQUEST_ABI, signer);
  }

  /**
   * Mint personality NFT (only gas fee required)
   */
  async mintPersonalityNFT(
    traits: PersonalityTraits,
    aiStory: string,
    personalityType: string
  ): Promise<number> {
    try {
      // Convert traits to the format expected by the contract
      const contractTraits = [
        traits.bravery,
        traits.logic,
        traits.empathy,
        traits.creativity,
        traits.greed,
        traits.wisdom
      ];

      console.log('Minting NFT with traits:', contractTraits);
      console.log('AI Story:', aiStory);
      console.log('Personality Type:', personalityType);

      const tx = await this.contract.mintPersonalityNFT(
        contractTraits,
        aiStory,
        personalityType
      );

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      // Parse the NFTMinted event to get the token ID
      const event = receipt.logs.find((log: ethers.Log) => {
        try {
          return this.contract.interface.parseLog(log);
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedLog = this.contract.interface.parseLog(event);
        if (parsedLog && parsedLog.name === 'NFTMinted') {
          const tokenId = parsedLog.args[1]; // tokenId is the second indexed parameter
          console.log('NFT minted successfully with token ID:', tokenId.toString());
          return Number(tokenId);
        }
      }

      // Fallback: get the total minted count
      const totalMinted = await this.contract.getTotalMinted();
      console.log('Total NFTs minted:', totalMinted.toString());
      return Number(totalMinted);

    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  /**
   * Get personality data for a token
   */
  async getPersonalityData(tokenId: number): Promise<PersonalityData | null> {
    try {
      const data = await this.contract.getPersonalityData(tokenId);
      return {
        player: data.player,
        traits: {
          bravery: Number(data.traits.bravery),
          logic: Number(data.traits.logic),
          empathy: Number(data.traits.empathy),
          creativity: Number(data.traits.creativity),
          greed: Number(data.traits.greed),
          wisdom: Number(data.traits.wisdom)
        },
        aiGeneratedStory: data.aiGeneratedStory,
        personalityType: data.personalityType,
        timestamp: Number(data.timestamp)
      };
    } catch (error) {
      console.error('Error getting personality data:', error);
      return null;
    }
  }

  /**
   * Get token traits
   */
  async getTokenTraits(tokenId: number): Promise<PersonalityTraits | null> {
    try {
      const traits = await this.contract.getTokenTraits(tokenId);
      return {
        bravery: Number(traits.bravery),
        logic: Number(traits.logic),
        empathy: Number(traits.empathy),
        creativity: Number(traits.creativity),
        greed: Number(traits.greed),
        wisdom: Number(traits.wisdom)
      };
    } catch (error) {
      console.error('Error getting token traits:', error);
      return null;
    }
  }

  /**
   * Get total minted NFTs
   */
  async getTotalMinted(): Promise<number> {
    try {
      const total = await this.contract.getTotalMinted();
      return Number(total);
    } catch (error) {
      console.error('Error getting total minted:', error);
      return 0;
    }
  }

  /**
   * Get token URI
   */
  async getTokenURI(tokenId: number): Promise<string> {
    try {
      return await this.contract.tokenURI(tokenId);
    } catch (error) {
      console.error('Error getting token URI:', error);
      return '';
    }
  }
}

// Utility functions
export const getSigner = async (): Promise<ethers.JsonRpcSigner | null> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('MetaMask not found');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);
    return null;
  }
};

export const switchToSepolia = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
    });
    return true;
  } catch (error) {
    console.error('Error switching to Sepolia:', error);
    return false;
  }
};
