# 🛡️ CasperGuard

**AI Agent Security Layer | x402 Micropayments | GitPaid | Casper Network**

> Built for Casper Agentic Buildathon 2026

## 🎬 Demo Videos
- https://youtube.com/shorts/y_jFBxfJE2I
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

## 🌐 Live Demo
https://casperguard-bay.vercel.app

## 💡 Inspiration
Every day, AI agents execute thousands of autonomous transactions with zero security. A single compromised agent can drain an entire protocol in seconds. CasperGuard is the first real-time AI security firewall built natively on Casper Network.

## 🤖 What It Does
- 🛡️ AI Security — APPROVES low-risk, BLOCKS high-risk transactions
- 🚨 Auto-Pause — Emergency contract stop when threat hits 3/3
- ⚡ x402 Micropayments — 0.1 CSPR per security scan
- 🤖 MCP Server — Live blockchain tools for AI agents
- 💰 GitPaid — ETH bounties for open source contributors
- 🔗 Casper Wallet — Real connect, real balance, real signing

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Node.js + Casper RPC v2 |
| Smart Contract | Rust + Odra Framework |
| GitPaid | Solidity + Ethers.js v6 (Base Sepolia) |
| Payments | x402 + EIP-712 |

## 🚀 Quick Start

    git clone https://github.com/yogeshkampalliwar/casperguard
    cd casperguard
    npm install
    node server.cjs &
    npm run dev -- --host

## 🤖 Agent Commands

    # AI Security Agent
    node worker/agent.mjs

    # x402 Payment Agent
    node worker/x402_real_payment.mjs

    # MCP Server
    node worker/mcp_client.mjs

    # Unit Tests (10000 passing)
    node tests/casperguard.test.cjs

    # Smart Contract Build
    cd contract && cargo odra build

## 🤖 How It Works

    Agent Transaction Request
            ↓
    CasperGuard Risk Scorer
            ↓
    Amount > 100 CSPR? → HIGH RISK → BLOCKED 🔴
    Amount > 10 CSPR?  → MEDIUM RISK → WARNING 🟡
    Amount <= 10 CSPR? → LOW RISK → APPROVED ✅
            ↓
    Auto-Pause if threats >= threshold 🚨

## 📜 On-Chain Proof

| What | Hash |
|------|------|
| Contract | hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0 |
| Deploy TX | 3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb |
| GitPaid | 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia) |

[View Contract](https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0)

## ⚡ Real x402 Transactions

| Agent | Amount | Status | TX |
|-------|--------|--------|----|
| trading-bot-001 | 5 CSPR | ✅ APPROVED | [d0280339...](https://testnet.cspr.live/transaction/d0280339ef34ba5d339c72479d95f33daae0bcd9a6b2bd12823abeeea9f45da8) |
| defi-agent-007 | 150 CSPR | 🔴 BLOCKED | [54783ee7...](https://testnet.cspr.live/transaction/54783ee766cee754bd3376f43bd12820bb4ff440cd74500a0be0509e5ff555c9) |
| rwa-oracle-003 | 2 CSPR | ✅ APPROVED | [4e43c334...](https://testnet.cspr.live/transaction/4e43c334f60fb801317dde3c003a3daa9aaa64007603ab9754a230276b254ed8) |

## 🧪 Testing

    node tests/casperguard.test.cjs
    # ✅ 10000 passed | ❌ 0 failed

## 🚀 Challenges Solved
1. CORS Block — Built Vercel serverless /api/block proxy
2. x402 No JS SDK — Built custom EIP-712 client
3. Auto-Pause Design — Threshold-based emergency stop

## 🚀 Deploy Your Own Contract

### Step 1: Install Prerequisites

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    cargo install cargo-odra
    cargo install casper-client

### Step 2: Clone & Build

    git clone https://github.com/yogeshkampalliwar/casperguard
    cd casperguard/contract
    cargo odra build

### Step 3: Get Testnet Keys & CSPR
1. Create wallet at https://testnet.cspr.live
2. Get free CSPR: https://testnet.cspr.live/tools/faucet
3. Download secret_key.pem from wallet

### Step 4: Deploy to Casper Testnet
## 
## cd contract 
    # Update Cargo.toml to Odra 2.9
sed -i 's/odra = { version = "2.8"/odra = { version = "2.9"/' Cargo.toml
sed -i 's/odra-casper-livenet-env = { version = "2.8"/odra-casper-livenet-env = { version = "2.9"/' Cargo.toml
sed -i 's/odra-test = { version = "2.8"/odra-test = { version = "2.9"/' Cargo.toml
sed -i 's/odra-build = { version = "2.8"/odra-build = { version = "2.9"/' Cargo.toml

# Build WASM
cargo odra build

# Deploy to Casper Testnet
cargo run --bin deploy_on_livenet --features livenet
### Step 5: Verify

    casper-client get-deploy \
      --node-address https://node.testnet.casper.network \
      [DEPLOY_HASH]

    # View on Explorer
    https://testnet.cspr.live/deploy/[DEPLOY_HASH]

## 🗺️ Roadmap

| Month | Milestone |
|-------|-----------|
| 1 | ✅ Testnet deployed + x402 payments live |
| 2 | ML-based risk engine |
| 3 | Mainnet + Halborn audit |
| 4 | x402 SDK release |
| 5 | CasperGuard DAO |
| 6 | 1000+ agents monitored daily |

## 👤 Builder
**Yogesh Kampalliwar** — Solo Builder
- GitHub: https://github.com/yogeshkampalliwar
- Twitter: https://twitter.com/yogeshr50283421
- Live: https://casperguard-bay.vercel.app

## 📄 License
MIT

## ✅ Latest Contract Deploy (Jul 22, 2026)

| Item | Value |
|------|-------|
| Contract Hash | hash-b245d0122d333e99d924bf6343dbd72d69508ed42df934cbca043777432402f1 |
| TX Hash | 086ba97433c279cecfc4c90ff1345930f272f0617bdb51af86fd1a4d2086f133 |
| Status | ✅ Success |
| Explorer | [View TX](https://testnet.cspr.live/transaction/086ba97433c279cecfc4c90ff1345930f272f0617bdb51af86fd1a4d2086f133) |

## 🚀 Deploy Commands

```bash
# Update Cargo.toml to Odra 2.9
sed -i 's/odra = { version = "2.8"/odra = { version = "2.9"/' Cargo.toml
sed -i 's/odra-casper-livenet-env = { version = "2.8"/odra-casper-livenet-env = { version = "2.9"/' Cargo.toml
sed -i 's/odra-test = { version = "2.8"/odra-test = { version = "2.9"/' Cargo.toml
sed -i 's/odra-build = { version = "2.8"/odra-build = { version = "2.9"/' Cargo.toml

# Build WASM
cargo odra build

# Deploy to Casper Testnet
cargo run --bin deploy_on_livenet --features livenet
