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

# 💡 What is CasperGuard?

CasperGuard is a real-time AI security firewall for the Casper Network.

Every AI agent transaction is analyzed before execution and is automatically:

- ✅ Approved (Low Risk)
- ⚠️ Warned (Medium Risk)
- ❌ Blocked (High Risk)

Each security scan is paid using **x402 micropayments**, creating a self-sustaining AI security layer.

---

# ✨ Features

- 🛡️ AI Risk Detection
- 🚨 Auto Pause after 3 threats
- ⚡ x402 Micropayments
- 🤖 MCP Server Support
- 💰 GitPaid Integration
- 🔗 Casper Wallet Integration
- 📊 Live Risk Dashboard
- 🔒 Real On-chain Transactions

---

# 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js |
| Smart Contract | Rust + Odra |
| SDK | casper-js-sdk v5 |
| Payments | x402 |
| GitPaid | Solidity + Ethers.js |
| AI | MCP Server |

---

# 📖 Setup Guide

## Step 1 — Clone Repository

```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
```

---

## Step 2 — Create Casper Wallet

Visit

https://testnet.cspr.live

- Create Account
- Download `secret_key.pem`
- Save your Public Key

---

## Step 3 — Get Free Testnet Tokens

https://testnet.cspr.live/tools/faucet

Request free Testnet CSPR.

---

## Step 4 — Add Wallet Key

```bash
mkdir -p contract/keys
cp /sdcard/Download/Account_secret_key.pem contract/keys/secret_key.pem
```

---

## Step 5 — Install Rust

```bash
# Termux (Android)
pkg install rust -y

# Or standard Linux/Mac
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

source $HOME/.cargo/env
```

---

## Step 6 — Install Odra

```bash
cargo install cargo-odra
```

---

## Step 7 — Build Smart Contract

```bash
cd contract

cargo odra build

cd ..
```

---

## Step 8 — Deploy Contract

```bash
node deploy.mjs
```

Deploy script:

- Loads secret_key.pem
- Builds Session
- Signs Transaction
- Deploys to Casper Testnet
- Returns Explorer Link

---

## Step 9 — Run Frontend

```bash
node server.cjs &

npm run dev -- --host
```

Open

http://localhost:5173

---

## Step 10 — Connect Casper Wallet

Open the app inside Casper Wallet Browser.

Click

**Connect Wallet**

Then

**PAY & SCAN**

---

# 🤖 Agent Commands

Run AI Agent

```bash
node worker/agent.mjs
```

Run x402 Payment Agent

```bash
node worker/x402_real_payment.mjs
```

Run MCP Server

```bash
python3 worker/mcp_server.py
```

Run Tests

```bash
node tests/casperguard.test.cjs
```

---

# 🧠 How It Works

```
AI Agent

↓

Risk Engine

↓

LOW RISK
↓

APPROVED

----------------

MEDIUM RISK
↓

WARNING

----------------

HIGH RISK
↓

BLOCKED

↓

Threat Count

↓

3 Threats

↓

AUTO PAUSE

↓

0.1 CSPR x402 Payment
```

---

# 📜 On-chain Proof

Deploy TX

```
b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac
```

Explorer

https://testnet.cspr.live/transaction/b3aa90e60c2939a1694d832e93b05263ef2e586348a7c2fcd6c9886dab588cac

---

# 🧪 Testing

```bash
node tests/casperguard.test.cjs
```

✅ 10000 Passed

❌ 0 Failed

---

# 🚀 Challenges Solved

- CORS Proxy
- Casper SDK v5 Migration
- WASM Deployment
- Mobile Wallet Support
- x402 Payment Flow
- Auto Pause Engine

---

# 🛣️ Roadmap

- Testnet Launch
- AI Risk Engine v2
- Mainnet
- Security Audit
- DAO Governance
- 1000+ AI Agents

---

# 👤 Builder

**Yogesh Kampalliwar**

GitHub

https://github.com/yogeshkampalliwar

Twitter

https://twitter.com/yogeshr50283421

Live Demo

https://casperguard-bay.vercel.app

---

# 📄 License

MIT License

## 📱 Fresh Termux Setup — Deploy CasperGuard

### Step 1: Install packages
pkg update && pkg install git nodejs python rust clang make
### Step 2: Install Rust via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
### Step 3: Add WASM target
rustup target add wasm32-unknown-unknown
### Step 4: Install Odra CLI
cargo install cargo-odra
### Step 5: Clone repo
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard/contract
### Step 6: Update Odra to 2.9
sed -i 's/version = "2.8"/version = "2.9"/g' Cargo.toml
cargo update
### Step 7: Setup .env
cat > .env << EOF
ODRA_CASPER_LIVENET_SECRET_KEY_PATH=./keys/secret_key.pem
ODRA_CASPER_LIVENET_NODE_ADDRESS=https://node.testnet.casper.network/rpc
ODRA_CASPER_LIVENET_CHAIN_NAME=casper-test
ODRA_CASPER_LIVENET_EVENTS_URL=https://node.testnet.casper.network/events
EOF
### Step 8: Build WASM
cargo odra build
### Step 9: Deploy
cargo run --bin deploy_on_livenet --features livenet
