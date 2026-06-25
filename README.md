# 🛡️ CasperGuard

**AI Agent Security Layer for Casper Network**

CasperGuard is an autonomous AI security agent that monitors and risk-scores AI-driven transactions on the Casper blockchain. It automatically approves low-risk transactions and blocks high-risk ones — all on-chain, no human in the loop.

> Built for the **Casper Agentic Buildathon 2026**

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

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| AI Agent | Python 3 (autonomous risk scoring) |
| Smart Contract | Rust + Odra Framework (WebAssembly) |
| Blockchain | Casper Network Testnet |
| SDK | casper-js-sdk v5 |
| Deployment | Vercel (frontend) |

---

## 🧠 How AI Risk Scoring Works

The AI agent evaluates each transaction using rule-based scoring:

| Condition | Risk Score |
|-----------|-----------|
| Amount > 100 CSPR | +3 (HIGH RISK) |
| Amount > 10 CSPR | +1 (MEDIUM RISK) |
| Known test agent | -1 (trusted) |

- Score ≥ 3 → **BLOCKED** 🔴
- Score 1-2 → **MEDIUM RISK** 🟡
- Score = 0 → **APPROVED** 🟢

---

## 📦 Project Structure

```
casperguard/
├── contract/          # Rust smart contract (Odra)
│   └── src/
│       └── lib.rs
├── src/               # React frontend
├── worker/
│   └── agent.py       # Python AI agent
├── public/
├── index.html
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Rust + Cargo
- Odra CLI

### Frontend
```bash
npm install
npm run dev
```

### AI Agent
```bash
cd worker
pip install requests
python agent.py
```

### Smart Contract
```bash
cd contract
cargo odra build
```

---

## 🌐 Live Demo

- **App:** https://casperguard-bay.vercel.app
- **Contract:** `hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`
- **Explorer:** https://testnet.cspr.live/contract/hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
      video link youtube https://youtube.com/shorts/hCfUkW8m-ZU?si=_dEUV-TtEqfr18uG
---

## 📊 Example Agent Output

```
🛡️ CasperGuard AI Security Agent Starting...

🟢 Agent: trading-bot-001 | 5 CSPR | price-feed → APPROVED (score=0)
🔴 Agent: defi-agent-007 | 150 CSPR | swap      → BLOCKED  (score=3)
🟢 Agent: rwa-oracle-003 | 2 CSPR  | data-update→ APPROVED (score=0)

Summary: 2 approved, 1 blocked
```

---

## 👤 Builder

**Yogesh Kampalliwar**
- GitHub: [@yogeshkampalliwar](https://github.com/yogeshkampalliwar)
- Twitter: [@yogeshr50283421](https://twitter.com/yogeshr50283421)

---

## 📄 License

MIT
