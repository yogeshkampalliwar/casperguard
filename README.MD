# 🛡️ CasperGuard

**AI Agent Security Layer | x402 Micropayments | GitPaid | Casper Network**

> Built for Casper Agentic Buildathon 2026

---

## 🌐 Live Demo
https://casperguard-bay.vercel.app

## 🎬 Demo Videos
- https://youtube.com/shorts/y_jFBxfJE2I
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

---

## 💡 What is CasperGuard?

The first real-time AI security firewall on Casper Network. Every AI agent transaction is scored and either approved or blocked before execution. Agents pay 0.1 CSPR per scan via x402 micropayments — creating a self-sustaining security layer.

---

## 🤖 Features

- 🛡️ **AI Security** — APPROVES low-risk, BLOCKS high-risk transactions in real time
- 🚨 **Auto-Pause** — Contract automatically stops when threat level hits 3/3
- ⚡ **x402 Micropayments** — Real Casper testnet transactions per scan (casper-js-sdk v5)
- 🤖 **MCP Server** — Live blockchain tools for AI agents via Model Context Protocol
- 💰 **GitPaid** — ETH bounties for GitHub contributors (Base Sepolia)
- 🔗 **Casper Wallet** — Real wallet connect, real balance, real signing

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Node.js + Casper RPC v2 |
| Smart Contract | Rust + Odra Framework v2.8 |
| Contract Deploy | casper-js-sdk v5 + SessionBuilder |
| GitPaid | Solidity + Ethers.js v6 (Base Sepolia) |
| Payments | x402 + EIP-712 |
| MCP | Model Context Protocol (Python) |

---

## 📖 Setup Guide

### Step 1: Create Casper Testnet Wallet
1. Go to https://testnet.cspr.live
2. Click **"Create Account"**
3. Download your `secret_key.pem` — keep it safe, never share!
4. Copy your **public key** from the wallet

### Step 2: Get Free Testnet CSPR
1. Go to https://testnet.cspr.live/tools/faucet
2. Paste your **public key**
3. Click **"Request tokens"** — get 1000 CSPR free
4. Wait ~30 seconds for confirmation

### Step 3: Clone & Install
```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
Step 4: Add Your Wallet Key
cp /path/to/your/secret_key.pem contract/keys/secret_key.pem
Step 5: Build Smart Contract
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Odra
cargo install cargo-odra

# Build WASM
cd contract && cargo odra build
cd ..

Step 6: Deploy Contract to Casper Testnet
node deploy.mjs
What deploy.mjs does:
Uses casper-js-sdk v5 with SessionBuilder + putTransaction (Casper 2.0 API)
Loads secret_key.pem via PrivateKey.fromPem()
Reads compiled CasperGuard_opt.wasm (Odra + wasm-opt optimized)
Signs and submits real transaction to Casper testnet
Returns TX hash + Explorer link
Our Deploy TX:
b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac
https://testnet.cspr.live/transaction/b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac
Step 7: Run Frontend
node server.cjs &
npm run dev -- --host
Open http://localhost:5173
Step 8: Connect Casper Wallet
Open app in Casper Wallet browser (Play Store)
Click "Connect Casper Wallet"
Click "PAY & SCAN" — real 0.1 CSPR transaction
cat > /workspaces/casperguard/README.MD << 'ENDOFFILE'
# 🛡️ CasperGuard

**AI Agent Security Layer | x402 Micropayments | GitPaid | Casper Network**

> Built for Casper Agentic Buildathon 2026

---

## 🌐 Live Demo
https://casperguard-bay.vercel.app

## 🎬 Demo Videos
- https://youtube.com/shorts/y_jFBxfJE2I
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

---

## 💡 What is CasperGuard?

The first real-time AI security firewall on Casper Network. Every AI agent transaction is scored and either approved or blocked before execution. Agents pay 0.1 CSPR per scan via x402 micropayments — creating a self-sustaining security layer.

---

## 🤖 Features

- 🛡️ **AI Security** — APPROVES low-risk, BLOCKS high-risk transactions in real time
- 🚨 **Auto-Pause** — Contract automatically stops when threat level hits 3/3
- ⚡ **x402 Micropayments** — Real Casper testnet transactions per scan (casper-js-sdk v5)
- 🤖 **MCP Server** — Live blockchain tools for AI agents via Model Context Protocol
- 💰 **GitPaid** — ETH bounties for GitHub contributors (Base Sepolia)
- 🔗 **Casper Wallet** — Real wallet connect, real balance, real signing

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Node.js + Casper RPC v2 |
| Smart Contract | Rust + Odra Framework v2.8 |
| Contract Deploy | casper-js-sdk v5 + SessionBuilder |
| GitPaid | Solidity + Ethers.js v6 (Base Sepolia) |
| Payments | x402 + EIP-712 |
| MCP | Model Context Protocol (Python) |

---

## 📖 Setup Guide

### Step 1: Create Casper Testnet Wallet
1. Go to https://testnet.cspr.live
2. Click **"Create Account"**
3. Download your `secret_key.pem` — keep it safe, never share!
4. Copy your **public key** from the wallet

### Step 2: Get Free Testnet CSPR
1. Go to https://testnet.cspr.live/tools/faucet
2. Paste your **public key**
3. Click **"Request tokens"** — get 1000 CSPR free
4. Wait ~30 seconds for confirmation

### Step 3: Clone & Install
```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
Step 4: Add Your Wallet Key
cp /path/to/your/secret_key.pem contract/keys/secret_key.pem
Step 5: Build Smart Contract
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Odra
cargo install cargo-odra

# Build WASM
cd contract && cargo odra build
cd ..

Step 6: Deploy Contract to Casper Testnet
node deploy.mjs
What deploy.mjs does:
Uses casper-js-sdk v5 with SessionBuilder + putTransaction (Casper 2.0 API)
Loads secret_key.pem via PrivateKey.fromPem()
Reads compiled CasperGuard_opt.wasm (Odra + wasm-opt optimized)
Signs and submits real transaction to Casper testnet
Returns TX hash + Explorer link
Our Deploy TX:
b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac
https://testnet.cspr.live/transaction/b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac
Step 7: Run Frontend
node server.cjs &
npm run dev -- --host
Open http://localhost:5173
Step 8: Connect Casper Wallet
Open app in Casper Wallet browser (Play Store)
Click "Connect Casper Wallet"
Click "PAY & SCAN" — real 0.1 CSPR transaction

🤖 Agent Commands
# Run AI Security Agent (simulated)
node worker/agent.mjs

# Run x402 Real Payment Agent (Real Casper testnet transactions)
node worker/x402_real_payment.mjs

# Run MCP Server (Model Context Protocol)
python3 worker/mcp_server.py

# Run Unit Tests
node tests/casperguard.test.cjs
# ✅ 10000 passed | ❌ 0 failed

# Build Smart Contract
cd contract && cargo odra build

# Deploy Contract (Odra native way)
cd contract && cargo run --bin deploy_on_livenet --features=livenet

# Deploy Contract (JS SDK way - recommended)
node deploy.mjs
🤖 How It Works
Agent Transaction Request
        ↓
CasperGuard Risk Scorer
        ↓
Amount > 100 CSPR? → HIGH RISK  → BLOCKED 🔴
Amount > 10 CSPR?  → MEDIUM RISK → WARNING 🟡
Amount <= 10 CSPR? → LOW RISK   → APPROVED ✅
        ↓
Auto-Pause if threats >= 3/3 🚨
        ↓
x402 Payment: 0.1 CSPR per scan → Real Casper TX

📜 On-Chain Proof (Casper Testnet)
What
Hash
Contract
hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
Deploy TX
3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb
GitPaid Contract
0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia)
🔗 View Contract on Explorer
⚡ Real x402 Testnet Transactions
Agent
Amount
Status
TX
trading-bot-001
5 CSPR
✅ APPROVED
d0280339...
defi-agent-007
150 CSPR
🔴 BLOCKED
54783ee7...
rwa-oracle-003
2 CSPR
✅ APPROVED
4e43c334...
🧪 Testing
node tests/casperguard.test.cjs
# ✅ 10000 passed | ❌ 0 failed
🚀 Challenges Solved
CORS Block — Built Vercel serverless /api/block proxy to fetch live block height
x402 No JS SDK — Built custom EIP-712 payment client from scratch
Auto-Pause Loop — Fixed infinite threat detection with proper state management
pycspr API mismatch — Switched to casper-js-sdk v5 putTransaction (Casper 2.0)
WASM Deploy — Used SessionBuilder with Odra init args for correct contract deployment
Mobile Wallet — Integrated Casper Wallet app (Play Store) via CasperWalletProvider
🔒 Security Policy
Report vulnerabilities to: yogeshroy98@gmail.com
Do NOT open public GitHub issues for security bugs
Response time: 48 hours
See SECURITY.md for full policy
🗺️ Roadmap
Month
Milestone
1
✅ Testnet deployed + x402 live
2
ML-based risk engine
3
Mainnet + Halborn security audit
4
x402 SDK open source release
5
CasperGuard DAO governance
6
1000+ agents/day monitored
👤 Builder
Yogesh Kampalliwar — Solo Builder
GitHub: https://github.com/yogeshkampalliwar
Twitter: https://twitter.com/yogeshr50283421
Live: https://casperguard-bay.vercel.app
📄 License
MIT
