# 🌐 MindQuest Sepolia Deployment Guide

Deploy your MindQuest smart contract to Ethereum Sepolia testnet in just a few steps!

## 🚀 Quick Setup

### Step 1: Set Your Private Key

Create a `.env` file in the project root with your MetaMask private key:

```bash
# Add your MetaMask private key (the one that has Sepolia ETH)
PRIVATE_KEY=0x_your_private_key_here
```

**⚠️ Important**: 
- Never share your private key
- Use a test wallet, not your main wallet
- The `.env` file is automatically ignored by Git

### Step 2: Get Sepolia ETH

Get free Sepolia testnet ETH from these faucets:
- 🔗 [Chainlink Faucet](https://faucets.chain.link/sepolia) (Recommended)
- 🔗 [Alchemy Faucet](https://sepoliafaucet.com/)
- 🔗 [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

**How to get your address:**
1. Open MetaMask
2. Click on your account name to copy your address
3. Paste it into any faucet above
4. Wait for the ETH to arrive (usually 1-2 minutes)

### Step 3: Deploy to Sepolia

```bash
# Compile the contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy
```

That's it! 🎉

## 🦊 MetaMask Sepolia Configuration

Sepolia should already be available in MetaMask, but if you need to add it manually:

```
Network Name: Sepolia Test Network
RPC URL: https://sepolia.infura.io/v3/
Chain ID: 11155111
Currency Symbol: SEP
Block Explorer: https://sepolia.etherscan.io/
```

## 🎮 Playing the Game

After deployment:

1. **Start the frontend**: `npm run frontend:dev`
2. **Open**: [http://localhost:3000](http://localhost:3000)
3. **Connect MetaMask** (make sure you're on Sepolia network)
4. **Start playing** your AI personality game!

## 🔧 Troubleshooting

**"Insufficient funds" error:**
- Get more Sepolia ETH from the faucets above
- Check that you're using the right wallet address

**"Wrong network" error:**
- Switch MetaMask to Sepolia testnet
- Check that Chain ID is 11155111

**"Private key too short" error:**
- Make sure your private key starts with `0x`
- Private key should be 66 characters long (including 0x)

**Where to find your private key:**
1. Open MetaMask
2. Click on the three dots menu
3. Account Details → Export Private Key
4. Enter your password
5. Copy the private key (including the 0x)

## 📊 Expected Costs

Deploying on Sepolia (free testnet ETH):
- Contract deployment: ~0.005 ETH
- Playing the game (5 transactions): ~0.001 ETH
- Total: ~0.006 Sepolia ETH (worth $0 - it's free!)

---

## 🎉 Ready to Deploy!

Run these commands to get started:

```bash
# 1. Compile contracts
npm run compile

# 2. Deploy to Sepolia  
npm run deploy

# 3. Start frontend
npm run frontend:dev
```

Your MindQuest game will be live on Sepolia testnet! 🧙‍♂️✨
