# CasperGuard 🛡️

**AI Agent Security Layer + GitPaid + X402 | Casper Network & Base**

CasperGuard is an autonomous AI security agent that monitors and risk-scores AI-driven transactions on Casper blockchain. Integrated with GitPaid for developer payments and X402 for micropayment protocol.

> Built for **Casper Agentic Buildathon 2026**

## Demo Video
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw?si=aA2Zwsod16YiOcxc

## Live Demo
- App: https://casperguard-bay.vercel.app
- Contract: https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
- GitPaid Contract: 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia)

## Problem
1. AI agents execute on-chain transactions with zero security
2. Open source developers contribute with no payment system

## Solution
- Real-time AI risk scoring on every agent transaction
- APPROVES low-risk, BLOCKS high-risk transactions
- GitPaid: ETH bounty system for GitHub contributions
- X402: Micropayment protocol per scan

## Tech Stack
- React + TypeScript + Vite
- Python AI Agent (real Casper RPC)
- Rust + Odra Framework (Casper Smart Contract)
- Solidity (Base Sepolia - GitPaid)
- casper-js-sdk v5
- Ethers.js v6

## AI Risk Scoring
- Amount over 100 CSPR = BLOCKED (score=3)
- Amount over 10 CSPR = MEDIUM (score=1)
- Amount under 10 CSPR = APPROVED (score=0)

## Real Agent Output
Real Block Height: 8,392,853
Real CSPR Price: 0.00200832
Contract Status: DEPLOYED
APPROVED: trading-bot-001 | 5 CSPR | LOW RISK (score=0)
BLOCKED: defi-agent-007 | 150 CSPR | HIGH RISK (score=3)
APPROVED: rwa-oracle-003 | 2 CSPR | LOW RISK (score=0)
Summary: 2 approved, 1 blocked

## X402 Payment Output
Live Block: 8,406,151
APPROVED: trading-bot-001 | 5 CSPR | score=0
BLOCKED: defi-agent-007 | 150 CSPR | score=3 | Refund: 0.1 CSPR
APPROVED: rwa-oracle-003 | 2 CSPR | score=0
APPROVED: nft-agent-002 | 25 CSPR | score=1
APPROVED: dao-voter-001 | 8 CSPR | score=0
Fees Collected: 0.500 CSPR
Refunds: 0.100 CSPR
Net Revenue: 0.400 CSPR

## Run Commands

### Frontend
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
node server.cjs &
npm run dev -- --host

### Real AI Agent
cd worker
pip install requests
python real_agent.py

### X402 Payment
cd worker
python x402_payment.py

### Smart Contract
cd contract
cargo odra build

### Share Publicly
npx localtunnel --port 5173

### Termux (Android)
pkg update && pkg install nodejs python git
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
node server.cjs &
npm run dev -- --host

## Bug Fixes

### Block showing 0
Problem: Vite had no proxy to forward /api/block to backend port 3001
Fix: Added proxy in vite.config.ts
server: { proxy: { '/api': 'http://localhost:3001' } }

### node-fetch Import Error
Problem: node-fetch v3 is ESM-only, cannot use require()
Fix: const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

### RPC Connection Failed
Problem: node.testnet.casper.network timing out
Fix: Switched to direct RPC with fallback

### Vercel Build Failed
Problem: Unused TypeScript variables causing build error
Fix: Removed unused variables from App.tsx

## Roadmap
Month 1: Mainnet deployment + security audit
Month 2: ML-based risk engine
Month 3: X402 micropayments pay-per-scan
Month 4: SDK release + 5 dApp integrations
Month 5: CasperGuard DAO governance
Month 6: 1000+ agents monitored daily

## Builder
Yogesh Kampalliwar
GitHub: https://github.com/yogeshkampalliwar
Twitter: https://twitter.com/yogeshr50283421

## License
MIT

## MCP Server
- Endpoint: https://mcp.tendem.ai/mcp

## MCP Tools Available
- get_block_height — Live Casper block
- get_cspr_price — Real CSPR price
- scan_agent — AI risk scoring
- get_contract_state — Contract status

## X402 Micropayment Flow
1. Agent requests scan service
2. HTTP 402 received with price
3. Agent signs CSPR authorization
4. Payment settled on Casper Testnet
5. Service response delivered

## Casper Wallet Integration
- Real wallet connect via Casper Wallet browser extension
- Live balance fetch from Casper Testnet
- Real x402 payment signing

## CSPR.fans Voting
Vote for CasperGuard on CSPR.fans app!
Project: CasperGuard — AI Agent Security Layer

## Deployed Contracts
- Casper Testnet: hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
- Base Sepolia (GitPaid): 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809


## ✅ Testing — 218 Unit Tests (All Passing)

Run tests:
```bash
node tests/casperguard.test.cjs
```

Results: 218 passed, 0 failed
- 80 HIGH RISK boundary tests
- 80 LOW RISK boundary tests
- 50 MEDIUM RISK tests
- 8 edge case tests

## 🎯 Vision

CasperGuard solves the most critical gap in the agentic AI economy — **zero security layer for autonomous on-chain transactions.**

As AI agents multiply on Casper Network, a single compromised agent can drain protocol funds in seconds. CasperGuard is the **first real-time AI risk scoring layer** built natively on Casper with:

- **Auto-Pause** — Emergency stop when threat level reaches 3/3
- **GitPaid** — ETH bounty system for open source developers (Base Sepolia)
- **x402 Micropayments** — 0.001 ETH per security scan, sustainable revenue model
- **MCP Server** — Live blockchain access for AI agents

**Target:** Monitor 1000+ AI agents daily by Q4 2026. CasperGuard becomes the standard security middleware for every dApp on Casper Network.

**Revenue Model:** Every agent scan = 0.001 ETH fee → sustainable on-chain business from day one.
