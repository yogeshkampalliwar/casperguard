# 🛡️ CasperGuard

**AI Agent Security Layer | x402 Micropayments | GitPaid | Casper Network**

> Casper Agentic Buildathon 2026

## 🌐 Live Demo
https://casperguard-bay.vercel.app

## 🎬 Demo Videos
- https://youtube.com/shorts/y_jFBxfJE2I
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

---

## 💡 What is CasperGuard?

The first real-time AI security firewall on Casper Network. Every AI agent transaction is scored and either approved or blocked. Agents pay 0.1 CSPR per scan via x402 micropayments — creating a self-sustaining security layer.

---

## 🤖 Features

- 🛡️ AI Security — APPROVES low-risk, BLOCKS high-risk transactions
- 🚨 Auto-Pause — Contract stops when threat level hits critical
- ⚡ x402 Micropayments — 0.1 CSPR per security scan
- 🤖 MCP Server — Live blockchain tools for AI agents
- 💰 GitPaid — ETH bounties for GitHub contributors (Base Sepolia)
- 🔗 Casper Wallet — Real connect, real balance, real signing

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Node.js + Casper RPC v2 |
| Smart Contract | Rust + Odra Framework v2.8 |
| GitPaid | Solidity + Ethers.js v6 (Base Sepolia) |
| Payments | x402 + EIP-712 |
| MCP | Model Context Protocol |

---

## 🚀 Quick Start

```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
npm run dev
🤖 Agent Commands
# AI Security Agent
node worker/agent.mjs

# x402 Real Payment Agent
node worker/x402_real_payment.mjs

# MCP Agent
node worker/mcp_client.mjs

# Unit Tests (218 passing)
node tests/casperguard.test.cjs

# Smart Contract Build
cd contract && cargo odra build

# Deploy to Casper Testnet
cd contract && cargo run --bin deploy_on_livenet --features=livenet
🤖 How It Works
Agent Transaction Request
        ↓
CasperGuard Risk Scorer
        ↓
Amount > 100 CSPR? → HIGH RISK → BLOCKED 🔴
Amount > 10 CSPR?  → MEDIUM RISK → WARNING 🟡
Amount <= 10 CSPR? → LOW RISK → APPROVED ✅
        ↓
Auto-Pause if threats >= threshold 🚨
📜 On-Chain Proof (Casper Testnet)
What
Hash
Contract
hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
Deploy TX
3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb
GitPaid
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
d028033...
defi-agent-007
150 CSPR
🔴 BLOCKED
54783ee...
rwa-oracle-003
2 CSPR
✅ APPROVED
4e43c33...
Testing — 10000  Unit Tests
node tests/casperguard.test.cjs
# ✅ 10000 passed | ❌ 0 failed
🚀 Challenges Solved
CORS Block — Built Vercel serverless /api/block proxy
x402 No JS SDK — Built custom EIP-712 client from scratch
Auto-Pause Design — Threshold-based emergency stop on-chain
🗺️ Roadmap
Month
Milestone
1
✅ Testnet deployed + x402 live
2
ML-based risk engine
3
Mainnet + Halborn audit
4
x402 SDK release
5
CasperGuard DAO
6
1000+ agents/day, $50K TVL
👤 Builder
Yogesh Kampalliwar — Solo Builder
GitHub: https://github.com/yogeshkampalliwar
Twitter: https://twitter.com/yogeshr50283421
Live: https://casperguard-bay.vercel.app
📄 License
MIT
