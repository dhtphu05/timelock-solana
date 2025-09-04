# 🔒 Time-Locked Wallet on Solana

A Solana smart contract and frontend for time-locked funds - deposit SOL and withdraw only after a specified unlock timestamp.

**Built by**: Doan Hoang Thien Phu ([@dhtphu05](https://x.com/dhtphu))  
**From**: DUT Superteam University Club  
**Contact**: dhtphu05@gmail.com

## 🏆 Bounty Project

This project was built for the "Build a Time-Locked Wallet on Solana" bounty challenge.

**Prize Pool**: 150 - 100 - 50 USDC  
**Duration**: 7 days  
**Level**: Beginner-friendly

## ✨ Features

### Smart Contract (Anchor Program)
- ✅ **`initialize_lock`** - Deposit SOL with unlock timestamp
- ✅ **`withdraw`** - Withdraw funds after unlock time
- ✅ **PDA-based vault** - Secure fund storage
- ✅ **On-chain enforcement** - Time lock validated by blockchain

### Frontend (React + TypeScript)
- ✅ **Create Time Lock** - Form to lock SOL with date/time picker
- ✅ **Wallet Balance** - Real-time SOL balance display with airdrop functions
- ✅ **My Locks** - View all created time locks
- ✅ **Withdraw Interface** - Withdraw unlocked funds
- ✅ **Development Tools** - RPC endpoint checker, explorer links

## 🛠 Tech Stack

- **Blockchain**: Solana + Anchor Framework
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Wallet**: @solana/wallet-adapter (Phantom, Solflare, etc.)
## Preview
<img width="1920" height="1536" alt="image" src="https://github.com/user-attachments/assets/ccc02446-4a7a-4c1b-b1e0-70a3f3ec7161" />

## 🚀 Quick Start Guide

### Prerequisites

```bash
# 1. Install Solana CLI (required)
sh -c "$(curl -sSfL https://release.solana.com/v2.0.20/install)"

# 2. Install Anchor CLI (required)
npm install -g @coral-xyz/anchor-cli

# 3. Install Node.js (v18+ recommended)
# Download from https://nodejs.org/
node --version  # Should show v18+
```

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd timelock

# Verify installations
solana --version    # Should show v2.0.20+
anchor --version    # Should show 0.31.1+
node --version      # Should show v18+
```

### Step 2: Start Local Solana Network

```bash
# Terminal 1: Start local validator
solana-test-validator

# You should see output like:
# Ledger location: test-ledger
# Log messages: test-ledger/validator.log
# JSON RPC URL: http://127.0.0.1:8899
# WebSocket PubSub URL: ws://127.0.0.1:8900

# Keep this terminal running!
```

### Step 3: Configure Solana CLI

```bash
# Terminal 2: Configure Solana to use localhost
solana config set --url localhost

# Verify configuration
solana config get
# Should show:
# RPC URL: http://localhost:8899
# WebSocket URL: ws://localhost:8900
# Keypair Path: /Users/<your-user>/.config/solana/id.json
```

### Step 4: Deploy Smart Contract

```bash
# In the timelock directory
# Build the program
anchor build

# Deploy to localhost
anchor deploy

# You should see output like:
# Deploying cluster: http://127.0.0.1:8899
# Upgrade authority: /Users/<user>/.config/solana/id.json
# Deploying program "timelock"...
# Program Id: HFamjVWTqbLba9TL3Yr2cx19y38RHHsFHRRBXk53wAVy
# Deploy success
```

### Step 5: Setup Frontend

```bash
# Navigate to frontend directory
cd timelock-wallet

# Install dependencies (this may take a few minutes)
npm install

# Start development server
npm run dev

# You should see:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
```

### Step 6: Open Application

```bash
# Open your browser and go to:
http://localhost:5173

# You should see the Time-Locked Wallet interface
```

## 📋 Complete Step-by-Step Usage

### 1. Connect Your Wallet

```bash
# If you don't have a wallet extension:
# 1. Install Phantom: https://phantom.app/
# 2. Or Solflare: https://solflare.com/
# 3. Create a new wallet (save your seed phrase!)

# In the application:
# 1. Click "Connect Wallet" (top right)
# 2. Select your wallet (Phantom/Solflare)
# 3. Approve the connection
```

### 2. Fund Your Wallet

```bash
# Your wallet starts with 0 SOL on localhost
# Use the built-in airdrop feature:

# Method 1: Use UI buttons
# - Click "💧 Airdrop 1 SOL" for small amount
# - Click "🚀 Airdrop 5 SOL" for larger amount

# Method 2: Use CLI (alternative)
# Get your wallet address from the UI, then:
solana airdrop 5 <YOUR_WALLET_ADDRESS>

# Verify balance
solana balance <YOUR_WALLET_ADDRESS>
```

### 3. Create Your First Time Lock

```bash
# In the application interface:
# 1. Go to "Create Lock" tab
# 2. Enter amount: 0.1 (SOL)
# 3. Set unlock date: Select future date/time
# 4. Optional: Enter recipient address (leave empty for self)
# 5. Click "Create Time Lock"
# 6. Approve transaction in your wallet

# You should see:
# - Transaction success message
# - New vault created
# - Balance updated
```

### 4. View Your Locks

```bash
# 1. Click "My Locks" tab
# 2. You'll see all your time locks with:
#    - Amount locked
#    - Unlock date/time
#    - Current status (Locked/Unlocked)
#    - Withdraw button (if unlocked)
```

### 5. Withdraw Funds

```bash
# When lock time expires:
# 1. Go to "My Locks" tab
# 2. Find the unlocked vault
# 3. Click "Withdraw" button
# 4. Approve transaction in wallet
# 5. Funds return to your wallet
```

## 🧪 Testing Scenarios

### Test 1: Basic Functionality

```bash
# 1. Fund wallet with airdrop
# 2. Create lock for 0.1 SOL, unlock in 1 minute
# 3. Wait for unlock time
# 4. Successfully withdraw funds
```

### Test 2: Early Withdrawal (Should Fail)

```bash
# 1. Create lock for 0.1 SOL, unlock in 10 minutes
# 2. Try to withdraw immediately
# 3. Transaction should fail with "Time lock not expired" error
```

### Test 3: Multiple Locks

```bash
# 1. Create 3 different locks:
#    - 0.1 SOL unlock in 1 minute
#    - 0.2 SOL unlock in 5 minutes  
#    - 0.3 SOL unlock in 10 minutes
# 2. View all in "My Locks"
# 3. Withdraw them as they unlock
```

### Test 4: Recipient Lock

```bash
# 1. Create lock with different recipient address
# 2. Only recipient can withdraw (not original creator)
# 3. Test with second wallet/account
```

## 🔧 Development Tools

The application includes helpful development features:

### Wallet Balance Panel
- **Real-time SOL balance** - Updates every 10 seconds
- **Quick airdrop buttons** - Get 1 SOL or 5 SOL instantly
- **Network status** - Shows "Localhost" connection
- **Address copy** - Click 📋 to copy wallet address

### Development Tools Section
- **RPC Endpoint** - Opens http://localhost:8899
- **Check Connection** - Logs connection info to console
- **View on Explorer** - Opens Solana Explorer with custom localhost URL

### Browser Console
```bash
# Open browser console (F12) to see:
# - Transaction signatures
# - Vault addresses
# - Connection status
# - Error messages
```

## 📁 Project Structure

```
timelock/
├── programs/
│   └── timelock/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs                    # Main Anchor program
├── timelock-wallet/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletBalance.tsx         # Balance + airdrop UI
│   │   │   ├── CreateTimelock.tsx        # Lock creation form  
│   │   │   ├── MyLocks.tsx              # View existing locks
│   │   │   └── Header.tsx               # Navigation
│   │   ├── hooks/
│   │   │   └── useTimelockProgram.ts    # Program integration
│   │   ├── pages/
│   │   │   ├── HomePage.tsx             # Create lock page
│   │   │   └── LocksPage.tsx            # View locks page
│   │   ├── App.tsx                      # Main app component
│   │   └── main.tsx                     # React entry point
│   ├── package.json
│   ├── vite.config.js                   # Vite configuration
│   └── tailwind.config.js               # Tailwind CSS config
├── Anchor.toml                          # Anchor configuration
├── Cargo.toml                           # Rust workspace config
└── README.md                            # This file
```

## 🚨 Troubleshooting

### "Insufficient funds" error
```bash
# Problem: Wallet has 0 SOL
# Solution: Use airdrop buttons or CLI command
solana airdrop 5 <YOUR_WALLET_ADDRESS>
```

### "Program not found" error
```bash
# Problem: Program not deployed or wrong ID
# Solution: Rebuild and redeploy
anchor clean
anchor build
anchor deploy

# Update Program ID in:
# - Anchor.toml [programs.localnet]
# - src/lib.rs declare_id!()
# - frontend useTimelockProgram.ts PROGRAM_ID
```

### "Failed to connect" error
```bash
# Problem: Local validator not running
# Solution: Start validator
solana-test-validator

# Check if running:
solana cluster-version
```

### Frontend won't start
```bash
# Problem: Dependencies not installed
# Solution: Reinstall
cd timelock-wallet
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Buffer is not defined" error
```bash
# Problem: Browser polyfill issue
# Solution: Already fixed in vite.config.js
# If persists, check if vite-plugin-node-polyfills is installed:
npm install buffer vite-plugin-node-polyfills
```

### Wallet won't connect
```bash
# Problem: Wrong network or extension issue
# Solutions:
# 1. Refresh page
# 2. Disconnect and reconnect wallet
# 3. Check if wallet extension is installed
# 4. Try different wallet (Phantom vs Solflare)
```

### Transactions failing
```bash
# Problem: Network congestion or RPC issues
# Solutions:
# 1. Wait and retry
# 2. Check console for error details
# 3. Restart local validator:
#    Ctrl+C (stop validator)
#    solana-test-validator (restart)
```

## 📊 Technical Details

### Smart Contract

**Program ID**: `HFamjVWTqbLba9TL3Yr2cx19y38RHHsFHRRBXk53wAVy`

#### Instructions:

```rust
// Create a new time lock
initialize_lock(amount: u64, unlock_timestamp: i64)

// Withdraw from unlocked vault  
withdraw()
```

#### Account Structure:

```rust
pub struct Vault {
    pub owner: Pubkey,           // Lock creator
    pub recipient: Pubkey,       // Who can withdraw  
    pub amount: u64,            // Amount in lamports
    pub unlock_ts: i64,         // Unix timestamp
    pub is_initialized: bool,   // Status flag
}
```

#### PDA Derivation:

```rust
// Vault address derived from:
seeds = [
    b"vault",
    owner.key().as_ref(),
    recipient.key().as_ref(), 
    unlock_timestamp.to_le_bytes().as_ref()
]
```

### Frontend Integration

**Key Files:**
- `useTimelockProgram.ts` - Anchor program integration
- `WalletBalance.tsx` - Balance display + airdrop functionality
- `CreateTimelock.tsx` - Lock creation interface
- `MyLocks.tsx` - View and withdraw interface

## 🌐 Deployment Information

### Current Deployment
- **Network**: Localhost (solana-test-validator)
- **RPC URL**: http://localhost:8899
- **Program ID**: HFamjVWTqbLba9TL3Yr2cx19y38RHHsFHRRBXk53wAVy

### Deploy to Devnet (Optional)

```bash
# Switch to devnet
solana config set --url devnet

# Fund your deployer wallet
solana airdrop 2

# Deploy program
anchor deploy --provider.cluster devnet

# Update frontend configuration to use devnet
```

## ✅ Deliverables Checklist

### ✅ Smart Contract (Anchor Program)
- [x] `initialize_lock(amount, unlock_timestamp)` instruction
- [x] `withdraw()` instruction  
- [x] PDA account holds locked funds
- [x] On-chain time lock enforcement
- [x] Proper error handling

### ✅ Frontend Application
- [x] Form to create time-locked wallet
- [x] Display wallet state (amount, unlock date)
- [x] Withdraw button (fails if too early)
- [x] Works with Phantom/Solflare wallets
- [x] Real-time balance display
- [x] Development tools integration

### ✅ Repository Structure  
- [x] Program folder (Anchor)
- [x] Frontend folder (React + TypeScript)
- [x] Clear README with run instructions
- [x] All code documented and commented

### 🎁 Bonus Features Implemented
- [x] Real-time wallet balance with auto-refresh
- [x] Integrated airdrop functionality for testing
- [x] Multiple lock management interface
- [x] Development tools (RPC checker, explorer links)
- [x] Comprehensive error handling
- [x] Professional UI/UX with Tailwind CSS

## 👨‍💻 About the Author

**Doan Hoang Thien Phu**  
- 🐦 Twitter: [@dhtphu](https://x.com/dhtphu)
- 🏫 DUT Superteam University Club Member
- 🌟 Blockchain Developer & Solana Enthusiast
- 📧 Connect with me on X for questions or collaborations!

*Built with ❤️ for the Solana community*

## 🤝 Contributing

```bash
# Fork the repository
git fork <repo-url>

# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm test

# Commit changes
git commit -m "Add my feature"

# Push and create PR
git push origin feature/my-feature
```

## 📄 License

MIT License - Open source and free to use!

## 🙏 Acknowledgments

Built with:
- [Anchor Framework](https://www.anchor-lang.com/) - Solana program development
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) - Wallet integration
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) - Frontend
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

Special thanks to:
- **Solana Foundation** for the amazing blockchain platform
- **DUT Superteam University Club** for the learning community
- **Bounty organizers** for the opportunity to build and learn

---

## 📞 Support & FAQ

**Q: Why can't I see my balance?**  
A: Make sure wallet is connected and you've used the airdrop feature or CLI to fund your wallet.

**Q: Transaction failed with "custom program error"**  
A: Check the browser console for detailed error. Usually insufficient funds or trying to withdraw too early.

**Q: Can I use this on mainnet?**  
A: This is for testing only. DO NOT deploy to mainnet without proper security audits.

**Q: How do I change the unlock time?**  
A: You cannot change existing locks. Create a new lock with different parameters.

**Q: Want to connect?**  
A: Follow me [@dhtphu on X](https://x.com/dhtphu) - always happy to discuss Solana development!

**Happy Time Locking! 🔒✨**

---
*Built by Doan Hoang Thien Phu ([@dhtphu05](https://x.com/dhtphu)) from DUT Superteam University Club*  
*For the Solana Time-Locked Wallet Bounty Challenge*
