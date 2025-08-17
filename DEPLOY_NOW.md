# 🚀 Deploy MindQuest to Sepolia NOW!

## ⚡ Quick Start (5 Minutes)

### 1. Get Your MetaMask Private Key

1. Open MetaMask extension
2. Click the 3 dots → **Account Details**
3. Click **Export Private Key** 
4. Enter your MetaMask password
5. **Copy the private key** (starts with 0x...)

### 2. Get Sepolia ETH (FREE)

1. Copy your MetaMask address (click on account name)
2. Visit: **https://faucets.chain.link/sepolia**
3. Paste your address and request ETH
4. Wait 1-2 minutes for ETH to arrive

### 3. Create Environment File

Create a file called `.env` in your project folder:

```
PRIVATE_KEY=0x_your_private_key_here
```

**Replace `0x_your_private_key_here` with your actual private key from step 1**

### 4. Deploy to Sepolia

Open terminal in your project folder and run:

```bash
npm run deploy
```

### 5. Start the Game

```bash
npm run frontend:dev
```

Visit: **http://localhost:3000**

---

## ✅ What You'll See

When deployment succeeds, you'll see:
```
✅ MindQuest deployed successfully!
📍 Contract Address: 0x1234...
🌐 Network: sepolia (Chain ID: 11155111)
🔗 View on Etherscan: https://sepolia.etherscan.io/address/0x1234...
```

## 🎮 Playing the Game

1. Make sure MetaMask is on **Sepolia Test Network**
2. Open http://localhost:3000
3. Click **"Connect Wallet & Enter the Realm"**
4. Answer 5 personality questions
5. Mint your unique personality NFT!

---

## 🛠️ If Something Goes Wrong

**"Insufficient funds":**
- Get more Sepolia ETH from https://faucets.chain.link/sepolia

**"Wrong network":**
- Switch MetaMask to Sepolia testnet

**"Private key too short":**
- Make sure your private key includes `0x` at the start
- Should be 66 characters total

**"Cannot find private key":**
- Check your `.env` file is in the right folder
- Make sure it says `PRIVATE_KEY=0x...` (no spaces)

---

## 🎉 Ready? Let's Deploy!

1. **Get private key** from MetaMask
2. **Get Sepolia ETH** from faucet  
3. **Create `.env` file** with your private key
4. **Run**: `npm run deploy`
5. **Run**: `npm run frontend:dev`
6. **Play** at http://localhost:3000

**Your AI personality game will be live on blockchain in 5 minutes! 🧙‍♂️✨**
