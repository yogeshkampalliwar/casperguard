# 🛡️ CasperGuard — AI Agent Security Layer

## 🎬 Demo Videos
- https://youtube.com/shorts/hCfUkW8m-ZU
- https://youtube.com/shorts/JyOeau-qFvw
- https://youtube.com/shorts/ic_Zhp3o_XI

---

## 💡 Inspiration

Every day, AI agents execute thousands of autonomous transactions with zero security review. A single compromised agent can drain an entire protocol in seconds.

We asked: What if every AI agent transaction had a guardian?

CasperGuard was born — the first real-time AI security firewall built natively on Casper Network.

---

## 🤖 What It Does

- 🛡️ AI Security — APPROVES low-risk, BLOCKS high-risk transactions
- 🚨 AUTO-PAUSE — contract pauses when critical threat detected
- ⚡ x402 Micropayments — agents pay 0.1 CSPR per scan
- 🤖 MCP Server — live blockchain access for AI agents
- 💰 GitPaid — ETH bounties for GitHub contributors
- 🔗 Casper Wallet — real connect, real balance, real signing

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Node.js + Casper RPC |
| Smart Contract | Rust + Odra Framework |
| GitPaid | Solidity + Ethers.js v6 |
| Blockchain | Casper Network Testnet |
| Payments | x402 + EIP-712 |

---

## 🚀 Run Commands

### Frontend
```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
node server.cjs &
npm run dev -- --host
```

### Node.js AI Agent (Real Casper RPC)
```bash
node worker/agent.mjs
```

### MCP Agent (Live Blockchain Tools)
```bash
node worker/mcp_client.mjs
```

### Unit Tests (218 passing)
```bash
node tests/casperguard.test.cjs
```

### Smart Contract (Rust + Odra)
```bash
cd contract
cargo odra build
```

> ⚠️ Python removed — all agents now in Node.js for consistency and performance


---

## 🤖 How Agents Work

### AI Security Agent Flow
```
Agent Transaction Request
        ↓
CasperGuard Risk Scorer
        ↓
Amount > 100 CSPR? → HIGH RISK → BLOCKED 🔴
Amount > 10 CSPR?  → MEDIUM RISK → WARNING 🟡
Amount <= 10 CSPR? → LOW RISK → APPROVED ✅
        ↓
Auto-Pause if threats >= threshold 🚨
```

### x402 Micropayment Flow
```
1. Agent requests scan service
2. Server returns HTTP 402 Payment Required
3. Agent signs EIP-712 authorization
4. 0.1 CSPR payment settled on Casper Testnet
5. Risk scan result returned
```

### MCP Server Flow
```
1. AI Agent connects to MCP endpoint
2. Tools: get_block_height, get_cspr_price, scan_agent, get_contract_state
3. Real data returned from Casper Testnet
```

---

## 📜 On-Chain Proof (Casper Testnet)

| What | Hash |
|------|------|
| Contract Package | hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0 |
| Deploy TX | 3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb |
| GitPaid Contract | 0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809 (Base Sepolia) |

🔗 [View Contract](https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0)

## ⚡ Real x402 Transactions

| Agent | Amount | Status | TX |
|-------|--------|--------|----|
| trading-bot-001 | 5 CSPR | ✅ APPROVED | [d0280339...](https://testnet.cspr.live/transaction/d0280339ef34ba5d339c72479d95f33daae0bcd9a6b2bd12823abeeea9f45da8) |
| defi-agent-007 | 150 CSPR | 🔴 BLOCKED | [54783ee7...](https://testnet.cspr.live/transaction/54783ee766cee754bd3376f43bd12820bb4ff440cd74500a0be0509e5ff555c9) |
| rwa-oracle-003 | 2 CSPR | ✅ APPROVED | [4e43c334...](https://testnet.cspr.live/transaction/4e43c334f60fb801317dde3c003a3daa9aaa64007603ab9754a230276b254ed8) |

Wallet: 02038ccdd95411a19ba15d4784545a3e07dfa3afd2a839253472232991541ff55ada

---

## 🧪 Testing — 218 Unit Tests

```bash
node tests/casperguard.test.cjs
```

✅ 218 passed | ❌ 0 failed

---

## 🧪 Step-by-Step Testing

1. 🌐 Open https://casperguard-bay.vercel.app
2. 🤖 Click RUN AI AGENT
3. 🔗 Click CONNECT CASPER WALLET
4. ⚡ Click PAY & SCAN (0.1 CSPR)
5. 🔌 Click RUN MCP AGENT
6. 🚨 Watch AUTO-PAUSE trigger

---

## 🚀 Challenges We Solved

1. CORS Block — Built Vercel serverless /api/block proxy
2. x402 No JS SDK — Built custom EIP-712 client
3. Auto-Pause Design — Threshold-based emergency stop

---

## 📚 What We Learned

Making AI agents pay for their own security via x402 creates the first self-sustaining security layer on Casper Network.

---

## 🗺️ Roadmap

| Month | Milestone |
|-------|-----------|
| 1 | Mainnet deployment + Halborn audit |
| 2 | ML-based risk engine |
| 3 | x402 SDK release |
| 4 | 5+ dApp integrations |
| 5 | CasperGuard DAO |
| 6 | 1000+ agents monitored daily |

---

## 👤 Builder

**Yogesh Kampalliwar** — Solo Builder
- GitHub: https://github.com/yogeshkampalliwar
- Twitter: https://twitter.com/yogeshr50283421
- Live: https://casperguard-bay.vercel.app

---

## 📄 License

MIT
