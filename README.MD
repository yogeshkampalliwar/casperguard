# 🛡️ CasperGuard

**AI Agent Security Layer + GitPaid | Casper Network & Base**

CasperGuard is an autonomous AI security agent that monitors and risk-scores AI-driven transactions on Casper blockchain. Now integrated with GitPaid — pay developers automatically for GitHub contributions via Ethereum smart contract.

> Built for **Casper Agentic Buildathon 2026** — $150,000 Prize Pool

## 🎬 Demo Video

👉 [Watch on YouTube](https://youtube.com/shorts/hCfUkW8m-ZU)

## 🎯 Problem

1. AI agents execute on-chain transactions with zero security — malicious agents can drain wallets
2. Open source developers contribute thousands of hours with no payment system

## ✅ Solution

### 🛡️ CasperGuard AI Security
- Real live block height from Casper Testnet RPC
- Real CSPR price from CoinGecko API
- AI risk scoring on every agent transaction
- APPROVES low-risk transactions automatically
- BLOCKS high-risk transactions on-chain

### 💰 GitPaid
- Project owner creates ETH bounty on GitHub issue
- Developer solves issue and submits PR
- Owner pays developer via smart contract
- Instant ETH transfer, no middleman

## 🔴 Real Agent Output

Real Block Height: 16,241,840
Real CSPR Price: $0.001743
Contract Status: DEPLOYED

APPROVED: trading-bot-001 | 5 CSPR | LOW RISK (score=0)
BLOCKED: defi-agent-007 | 150 CSPR | HIGH RISK (score=3)
APPROVED: rwa-oracle-003 | 2 CSPR | LOW RISK (score=0)

Summary: 2 approved, 1 blocked

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Python 3 with real Casper RPC |
| Smart Contract | Rust + Odra Framework (Casper) |
| GitPaid Contract | Solidity (Base Sepolia) |
| Blockchain | Casper Testnet + Base Sepolia |
| SDK | casper-js-sdk v5 + Ethers.js v6 |

## 🧠 AI Risk Scoring

| Condition | Score | Result |
|-----------|-------|--------|
| Amount over 100 CSPR | +3 | BLOCKED |
| Amount over 10 CSPR | +1 | MEDIUM |
| Amount under 10 CSPR | 0 | APPROVED |

## 🌐 Live Demo

- App: https://casperguard-bay.vercel.app
- Casper Contract: hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
- GitPaid Contract: 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia)
- Explorer: https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0

## 📦 Project Structure

casperguard/
- 
- src/ — React frontend
- worker/ — Python AI agent (real RPC calls)
- gitpaid/ — GitPaid Ethereum integration

## 🚀 Getting Started

Frontend:
npm install
npm run dev

Real AI Agent:
cd worker
pip install requests
python real_agent.py

Smart Contract:
cd contract
cargo odra build

## 🗺️ 6-Month Mainnet Roadmap

| Month | Milestone |
|-------|-----------|
| 1 | Mainnet deployment + security audit |
| 2 | ML-based risk engine |
| 3 | x402 micropayments pay-per-scan |
| 4 | SDK release + 5 dApp integrations |
| 5 | CasperGuard DAO governance |
| 6 | 1000+ agents monitored daily |

## 👤 Builder

Yogesh Kampalliwar
- GitHub: https://github.com/yogeshkampalliwar
- Twitter: https://twitter.com/yogeshr50283421

## 📄 License

MIT

## 📦 Project Structure

```
contract/   — Rust smart contract (Odra)
src/        — React frontend  
worker/     — Python AI agent (real RPC calls)
gitpaid/    — GitPaid Ethereum integration
```

## 💻 Usage Commands

```bash
# Clone repo
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard

# Run Frontend
npm install
npm run dev

# Run Real AI Agent
cd worker
pip install requests
python real_agent.py

# Run GitPaid
cd gitpaid
npm install
npm run dev

# Build Smart Contract
cd contract
cargo odra build
```
