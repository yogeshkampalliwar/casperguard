
# 🛡️ CasperGuard

**AI Agent Security Layer for Casper Network**

CasperGuard is an autonomous AI security agent that monitors and risk-scores AI-driven transactions on the Casper blockchain. It automatically approves low-risk transactions and blocks high-risk ones — all on-chain, no human in the loop.

> Built for the **Casper Agentic Buildathon 2026** | Track: Agentic AI + DeFi & Payments

---

## 🎯 Problem

As AI agents autonomously execute transactions on-chain, there is no security layer to detect and block high-risk or malicious activity in real time. CasperGuard solves this.

---

## ✅ Solution

CasperGuard acts as an AI-powered firewall for autonomous agent transactions on Casper Network:

- Monitors incoming AI agent transactions in real time
- Scores each transaction by risk level (LOW / MEDIUM / HIGH)
- Automatically APPROVES or BLOCKS based on risk score
- Logs all decisions on-chain via deployed smart contract
- Real x402 EIP-712 micropayment authorization (casper-eip-712 SDK)
- DeFi Swap, Staking, RWA Oracle, MCP Agent interface — all in one dashboard

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Python 3 (autonomous risk scoring) |
| Smart Contract | Rust + Odra Framework (WebAssembly) |
| Blockchain | Casper Network Testnet |
| x402 Payments | @casper-ecosystem/casper-eip-712 |
| Price Feeds | CoinGecko API + metals.live (Gold) |
| Block Data | Tatum Casper Gateway (real-time) |
| Deployment | Vercel |

---

## 🌐 Live Demo

- **App:** https://casperguard-bay.vercel.app
- **Contract:** `hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`
- **Explorer:** https://testnet.cspr.live/contract-package/hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
- **Demo Video:** https://youtube.com/shorts/LH70T5FXSog?si=y-cBdPTUjFUahivm

---

## 🧠 How AI Risk Scoring Works

| Condition | Risk Score |
|-----------|-----------|
| Amount > 100 CSPR | +3 (HIGH RISK) |
| Amount > 10 CSPR | +1 (MEDIUM RISK) |
| Known test agent | -1 (trusted) |

- Score ≥ 3 → **BLOCKED** 🔴
- Score 1-2 → **MEDIUM RISK** 🟡
- Score = 0 → **APPROVED** 🟢

---

## ⚡ x402 Micropayment Integration

CasperGuard implements the Casper x402 protocol using EIP-712 typed data signing:

- Agent calls a paid endpoint → receives HTTP 402 + price
- Signs a `TransferAuthorization` using `@casper-ecosystem/casper-eip-712`
- Facilitator verifies signature → settles on-chain
- Service responds with 200 OK + data

No API keys. No subscriptions. No human approval.

---

## 🗺️ Mainnet Roadmap (Post-Funding)

### Month 1 — Security & Hardening
- Smart contract security audit (CertiK / Halborn)
- Expand AI risk engine: ML-based anomaly detection
- Real wallet integration (Casper Signer / Ledger)
- x402 live mainnet payment flows

### Month 2 — DeFi Integration
- CSPR.trade MCP server integration for live swaps
- Real staking via Casper validator delegation API
- RWA oracle — connect to Chainlink / Band Protocol
- Multi-sig agent authorization support

### Month 3 — Ecosystem & Scale
- CasperGuard SDK — npm package for other dApps
- Agent identity NFT (ERC-8004 compatible)
- Dashboard analytics — agent activity heatmap
- Public API for third-party agent security checks
- Apply for Casper Foundation grant

### Post-Audit (Month 3+)
- Mainnet contract deployment
- Revenue model: x402 micropayments per security check
- B2B: CasperGuard as-a-service for DeFi protocols
- DAO governance for risk parameter updates

---

## 📦 Project Structure

casperguard/
├── contract/          # Rust smart contract (Odra)
│   └── src/lib.rs
├── src/               # React frontend
│   ├── App.tsx        # Main UI (Security, Swap, Staking, x402, RWA, MCP tabs)
│   └── api.ts         # Real blockchain API calls + x402 payment auth
├── worker/
│   └── realagent.py       # Python AI agent
└── package.json
---

## 🚀 Getting Started

```bash
npm install && npm run dev
🛡️ CasperGuard AI Security Agent Starting...

🟢 trading-bot-001 | 5 CSPR  | price-feed  → APPROVED (score=0)
🔴 defi-agent-007  | 150 CSPR | swap        → BLOCKED  (score=3)
🟢 rwa-oracle-003  | 2 CSPR  | data-update → APPROVED (score=0)

Summary: 2 approved, 1 blocked
Block: 12,212,120 | CSPR: $0.00192


👤 Builder
Yogesh Kampalliwar — 8 years trading & blockchain experience
GitHub: @yogeshkampalliwar
Twitter: @yogeshr50283421



📄 License
MIT
