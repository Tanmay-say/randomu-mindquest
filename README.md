# MindQuest

A local-first personality game that mints a verifiable NFT on Ethereum Sepolia. Game logic and AI run off-chain; the only transaction is the NFT mint (and optional DCIPHER VRF request).

## Screenshots

<p align="center">
  <img src="photos/Screenshot%202025-08-18%20011857.png" alt="Game screenshot 1" width="30%"/>
  <img src="photos/Screenshot%202025-08-18%20011911.png" alt="Game screenshot 2" width="30%"/>
  <img src="photos/Screenshot%202025-08-18%20190830.png" alt="NFT in wallet" width="30%"/>
  <br/>
  <em>Representative UI and minted NFT view (Sepolia).</em>
  
</p>

## Highlights
- Single on-chain transaction for minting; gameplay and AI are off-chain
- Deterministic SVG image generated from traits + randomness
- Optional DCIPHER/Randamu VRF-backed mint for verifiable randomness
- Frontend: Next.js, Tailwind CSS, TypeScript
- Chain: Sepolia, Hardhat, OpenZeppelin, Ethers

## Architecture
- `frontend/`: React UI and local game engine (traits, AI story, tokenURI builder)
- `contracts/MindQuest.sol`: ERC-721 with two flows:
  - `mintPersonalityNFT(...)`: direct mint with provided `tokenUri`
  - `requestMintWithVRF(...)`: requests DCIPHER randomness; mints in `onRandomnessReceived`
- `scripts/deploy.js`: Hardhat deploy. Writes `deployment-info.json` and `frontend/.env.local`

## Prerequisites
- Node.js 18 LTS (recommended)
- MetaMask on Sepolia
- A funded Sepolia account for deployment and mint testing

## Quick start
```bash
# install
npm install
cd frontend && npm install && cd ..

# compile & test
npm run compile
npm run test

# run the app (separate shell)
cd frontend && npm run dev
```
Open `http://localhost:3000`.

## Environment
Create `.env` in the repo root. Minimum:
```bash
# wallet used by Hardhat for deploys/tests
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# AI (Groq); "demo-key" works for local fallback
GROQ_API_KEY=demo-key

# Optional: DCIPHER/Randamu VRF
# Find the RandomnessSender address for Sepolia in DCIPHER docs
# If unset, VRF requests are disabled but direct mint works
DCIPHER_RANDOMNESS_SENDER=0xRandomnessSenderOnSepolia
```
Frontend reads the deployed address from `frontend/.env.local` (auto-written by the deploy script). You can also set it manually via `NEXT_PUBLIC_CONTRACT_ADDRESS`.

## Deploy
```bash
# deploy to Sepolia
npm run deploy
```
Notes:
- The deploy script checks balance and fails fast if insufficient. Fund the deployer address with Sepolia ETH (e.g., via Chainlink, Alchemy, or QuickNode faucets).
- If `DCIPHER_RANDOMNESS_SENDER` is not set, the contract deploys with a zero sender. Direct mint works; VRF flow will be disabled until you redeploy or set the sender on a future version.

## Mint flows
1) Direct mint (default)
- Frontend builds SVG + JSON metadata (`tokenUri`) using traits and drand randomness
- Calls `mintPersonalityNFT(traits, story, type, tokenUri)`
- Single transaction (pay gas once)

2) VRF-backed mint (DCIPHER/Randamu)
- Requires `DCIPHER_RANDOMNESS_SENDER` to be set for Sepolia
- Frontend calls `requestMintWithVRF(traits, story, type, tokenUri, callbackGasLimit)` and sends the fee returned by the network (integration exposes a helper to compute price)
- DCIPHER calls back `onRandomnessReceived`, contract mints, and stores `vrfRandomness`

## Where to get `DCIPHER_RANDOMNESS_SENDER`
- Locate the “RandomnessSender” address for Sepolia in the DCIPHER documentation (Networks / Verifiable Randomness). Add that value to your `.env` as `DCIPHER_RANDOMNESS_SENDER`.

## Troubleshooting
- "missing revert data (action=estimateGas)" when minting:
  - The ABI/contract address mismatch. Ensure you redeployed after contract changes and the frontend points to the new address in `frontend/.env.local` (or set `NEXT_PUBLIC_CONTRACT_ADDRESS`).
- Node version warnings from Hardhat:
  - Use Node 18 LTS for best compatibility.
- Not enough test ETH to deploy or mint:
  - Top up via a Sepolia faucet.

## Security and notes
- Do not commit private keys. `.env` is gitignored.
- NFT `tokenUri` is provided by the client. In production, consider pinning metadata/images to IPFS or storing in a controlled backend.
- DCIPHER VRF round/proof can additionally be embedded in metadata for off-chain verification.

## License
MIT
