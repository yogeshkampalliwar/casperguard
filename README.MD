# 🛡️ CasperGuard — AI Agent Security Layer

## 🎬 Demo Videos

- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

---

## 💡 Inspiration

Every day, AI agents execute thousands of autonomous transactions on blockchain networks with **zero security review**. A single compromised agent can drain an entire protocol in seconds — no human sees it coming, no system stops it.

We asked: *What if every AI agent transaction had a guardian?*

CasperGuard was born — the first real-time AI security firewall built natively on Casper Network.

---

## 🤖 What It Does

CasperGuard is an autonomous AI security agent that **monitors, scores, and controls** every AI agent transaction on Casper blockchain in real time.

### 🛡️ AI Security Engine
- Every agent transaction is evaluated by our risk scoring engine
- **APPROVED** ✅ — low-risk transactions pass instantly
- **BLOCKED** 🔴 — high-risk transactions stopped before execution
- **AUTO-PAUSE** 🚨 — contract automatically pauses when threat level hits critical

### ⚡ x402 Micropayments
- Pay-per-scan model: agents pay 0.1 CSPR per security scan
- Real HTTP 402 payment flow on Casper Testnet
- EIP-712 signed authorization — no custodial wallet needed
- Sustainable revenue: every scan generates protocol fees

### 🤖 MCP Server (Model Context Protocol)
- Live blockchain access for AI agents
- Tools: get_block_height, get_cspr_price, scan_agent, get_contract_state
- Agents can query CasperGuard directly via MCP protocol
- Endpoint: mcp.cspr.trade/mcp compatible

### 💰 GitPaid — Developer Bounty System
- Project owners create ETH bounties on GitHub issues
- Developers solve issues, get paid automatically via smart contract
- No middleman — instant ETH transfer on Base Sepolia
- Contract: 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809

### 🔗 Casper Wallet Integration
- Real wallet connect via Casper Wallet browser extension
- Live CSPR balance fetch from Casper Testnet
- Real x402 payment signing — no simulation

---

## 🔧 How We Built It

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + TypeScript + Vite | Real-time agent feed dashboard |
| AI Agent | Python 3 + Casper RPC | Live risk scoring engine |
| Smart Contract | Rust + Odra Framework | On-chain security enforcement |
| GitPaid Contract | Solidity + Ethers.js v6 | Developer payment system |
| Blockchain | Casper Network Testnet | Primary deployment chain |
| Payments | x402 + EIP-712 | Micropayment protocol |
| MCP | Model Context Protocol | AI agent blockchain access |

---

## 🧪 Testing — 218 Unit Tests

```bash
node tests/casperguard.test.cjs
```

✅ 218 passed | ❌ 0 failed
- 80 HIGH RISK boundary tests
- 80 LOW RISK boundary tests  
- 50 MEDIUM RISK tests
- 8 edge case tests

---

## 📜 On-Chain Proof (Casper Testnet)

Every hash below is a real confirmed transaction — not simulated.

| What | Hash |
|------|------|
| Contract Package | hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0 |
| Deploy TX | 3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb |
| GitPaid Contract | 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia) |

🔗 [View Contract on Explorer](https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0)

---

## 🧪 Step-by-Step Testing Guide

1. 🌐 Open **https://casperguard-bay.vercel.app**
2. 🤖 Click **RUN AI AGENT** — watch live risk scoring
3. 🔗 Click **CONNECT CASPER WALLET** — real balance loads
4. ⚡ Click **PAY & SCAN (0.1 CSPR)** — x402 micropayment executes
5. 🔌 Click **RUN MCP AGENT** — MCP server responds with live block data
6. 🚨 Watch **AUTO-PAUSE** — triggers when threat count hits critical
7. 📊 View **AGENT FEED** — real-time block height + CSPR price

---

## ⚡ Real Agent Output

```
Real Block Height: 8,411,343
Real CSPR Price: $0.00194352
Contract Status: DEPLOYED

✅ APPROVED: trading-bot-001 | 5 CSPR | LOW RISK (score=0)
🔴 BLOCKED:  defi-agent-007 | 150 CSPR | HIGH RISK (score=3)
✅ APPROVED: rwa-oracle-003 | 2 CSPR | LOW RISK (score=0)

X402 Fees Collected: 0.500 CSPR
Refunds Issued: 0.100 CSPR
Net Revenue: 0.400 CSPR
Summary: 2 approved, 1 blocked
```

---

## 🚀 Challenges We Solved

### 1. CORS Block on Casper RPC
Browser blocked direct RPC calls. **Solution:** Built Vercel serverless function  that proxies to Casper node — real data, no CORS.

### 2. x402 Has No JS SDK
x402 reference is Go-only. **Solution:** Built custom JS x402 client with EIP-712 signing using casper-js-sdk — full 402 → sign → 200 round trip working.

### 3. Real vs Simulation
Most projects simulate transactions. **Solution:** CasperGuard uses real Casper Testnet RPC, real wallet signing, real on-chain contract — every action is verifiable on explorer.

### 4. Auto-Pause Design
How to stop runaway agents? **Solution:** Contract auto-pauses when blocked threat count hits threshold — owner can resume, full audit trail on-chain.

---

## 📚 What We Learned

The hardest part of AI agent security is not detecting threats — it is making the system act fast enough to stop them. On-chain auto-pause with x402 revenue creates the first **self-sustaining AI security layer** — agents pay for their own protection.

---

## 🗺️ What is Next

| Month | Milestone |
|-------|-----------|
| 1 | Mainnet deployment + Halborn security audit |
| 2 | ML-based risk engine — real pattern detection |
| 3 | x402 SDK release for Casper ecosystem |
| 4 | 5+ dApp integrations + partner program |
| 5 | CasperGuard DAO — community governance |
| 6 | 1000+ agents monitored daily, $50K+ TVL protected |

**Revenue Model:** Every agent scan = 0.1 CSPR fee → sustainable on-chain business from day one.

**Target:** Become the standard security middleware for every dApp on Casper Network by Q4 2026.

---

## 👤 Builder

**Yogesh Kampalliwar** — Solo Builder
- 🐙 GitHub: [@yogeshkampalliwar](https://github.com/yogeshkampalliwar)
- 🐦 Twitter: [@yogeshr50283421](https://twitter.com/yogeshr50283421)
- 🌐 Live: https://casperguard-bay.vercel.app

---

## 📄 License

MIT
