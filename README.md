# MindQuest - AI Personality Game

🎮 **A gamified AI-powered personality test that mints unique NFTs based on your choices**

MindQuest combines blockchain technology, artificial intelligence, and game design to create an immersive personality journey. Players navigate through mystical narrative scenarios, make choices that shape their personality traits, and receive unique NFTs that represent their psychological profile.

## 🌟 Features

- **AI-Powered Narratives**: Questions presented through immersive storytelling using QROQ (Groq) AI
- **Blockchain Integration**: Smart contracts deployed on Ethereum Sepolia testnet
- **Dynamic NFT Minting**: Unique personality-based NFTs with metadata reflecting player choices
- **Personality Scoring**: Six-trait system (Bravery, Logic, Empathy, Creativity, Greed, Wisdom)
- **Modern UI**: Responsive React frontend with Tailwind CSS
- **Wallet Integration**: MetaMask and other Web3 wallet support

## 🏗️ Architecture

```
MindQuest/
├── contracts/          # Solidity smart contracts
│   └── MindQuest.sol   # Main game contract with NFT minting
├── scripts/            # Deployment scripts
│   └── deploy.js       # Contract deployment to Sepolia
├── test/               # Smart contract tests
│   └── MindQuest.test.js
├── frontend/           # Next.js React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities (AI, blockchain)
│   │   └── app/        # Next.js app router
│   └── package.json
└── hardhat.config.js   # Hardhat configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask wallet extension
- Sepolia testnet ETH ([Get from faucet](https://faucets.chain.link/sepolia))
- GROQ API key ([Get from Groq](https://groq.com))

### 1. Clone and Install

```bash
git clone <repository-url>
cd mindquest
npm install
cd frontend && npm install
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# Blockchain Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# AI Configuration  
GROQ_API_KEY=your_groq_api_key_here
```

Create `.env.local` in the `frontend/` directory:

```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 3. Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract (optional)
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### 4. Frontend Development

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to start playing!

## 🎮 How to Play

1. **Connect Wallet**: Connect your MetaMask wallet and switch to Sepolia testnet
2. **Start Session**: Begin a new personality journey
3. **Answer Questions**: Navigate through 5 mystical scenarios, each with multiple choice options
4. **Watch Traits Evolve**: See your personality scores change based on your choices
5. **Mint NFT**: Complete the journey and mint a unique NFT representing your personality
6. **View Results**: Your NFT contains your personality story, traits, and journey metadata

## 🧠 Personality Traits System

The game tracks six core traits:

- **🛡️ Bravery**: Willingness to take risks and face challenges
- **🧮 Logic**: Analytical thinking and rational decision-making  
- **❤️ Empathy**: Understanding and caring for others
- **🎨 Creativity**: Innovation and original thinking
- **💰 Greed**: Desire for material gain and self-interest
- **🧙 Wisdom**: Learning from experience and making thoughtful choices

## 🔮 AI Integration

MindQuest uses **QROQ (Groq)** for:

- **Narrative Generation**: Creating immersive, game-like question presentations
- **Personality Analysis**: Generating unique stories based on player choices
- **Dynamic Content**: Adapting scenarios to player responses

## 🔗 Blockchain Features

### Smart Contract (`MindQuest.sol`)

- **ERC-721 NFTs**: Each personality journey results in a unique NFT
- **Session Management**: Track player progress through game sessions
- **Trait Calculation**: On-chain personality scoring system
- **Metadata Storage**: NFT metadata includes traits, story, and choices
- **Access Control**: Ensure only session owners can submit responses

### Key Functions

```solidity
function startSession() external returns (uint256)
function submitResponse(uint256 sessionId, string calldata response, uint8[6] calldata traitChanges) external  
function completeSession(uint256 sessionId, string calldata aiStory, string calldata imageHash) external
function getSession(uint256 sessionId) external view returns (GameSession memory)
```

## 🛠️ Development

### Running Tests

```bash
# Smart contract tests
npx hardhat test

# Frontend tests (if implemented)
cd frontend && npm test
```

### Local Development

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
cd frontend && npm run dev
```

## 🌐 Deployment

### Smart Contract Deployment

The contract is deployed on **Ethereum Sepolia Testnet**. Get testnet ETH from:
- [Chainlink Faucet](https://faucets.chain.link/sepolia)
- [Alchemy Faucet](https://sepoliafaucet.com/)

### Frontend Deployment

Deploy the Next.js app to Vercel:

```bash
cd frontend
npm run build
npm run start

# Or deploy to Vercel
npx vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- **Chainlink VRF**: True randomness for question selection
- **IPFS Integration**: Decentralized storage for NFT metadata and images
- **Multiplayer Mode**: Compare personalities with friends
- **Advanced AI**: More sophisticated personality analysis
- **Cross-chain Deployment**: Support for multiple blockchain networks
- **Gamification**: Achievement system, leaderboards, and rewards

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/mindquest/issues) for common problems
- Join our [Discord](https://discord.gg/mindquest) for community support
- Read the [Documentation](https://docs.mindquest.game) for detailed guides

---

**Built with ❤️ using Hardhat, Next.js, QROQ AI, and Ethereum**
