# 🛡️ CasperGuard

**AI Agent Security Layer + GitPaid | Casper Network & Base**

CasperGuard is an autonomous AI security agent that monitors and risk-scores AI-driven transactions on Casper blockchain. Now integrated with GitPaid — pay developers automatically for GitHub contributions via Ethereum smart contract.

> Built for **Casper Agentic Buildathon 2026** — $150,000 Prize Pool

## 🎬 Demo Video

👉 [Watch on YouTube](https://youtube.com/shorts/hCfUkW8m-ZU)

   [watch video] 2  for better understand  (https://youtube.com/shorts/JyOeau-qFvw?si=aA2Zwsod16YiOcxc)
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
cd casperguard/src

# Run Frontend
npm install
npm run dev

# Run Real AI Agent
cd /workspaces/casperguard/worker
pip install requests
python real_agent.py

# Build Smart Contract
cd /workspaces/casperguard/contract
cargo odra build
```
## Local Development & Sharing (LocalTunnel)

### Running Locally
```bash
cd /workspaces/casperguard
npm run dev -- --host

This starts Vite dev server on http://localhost:5173
Sharing Local Server Publicly (for team/demo)

npx localtunnel --port 5173

This generates a public URL like: https://random-name.loca.lt
Error: "Blocked request. This host is not allowed"
Problem: Vite blocks unknown hosts by default for security.
Fix: Add allowedHosts: true in vite.config.ts:

export default defineConfig({
  server: { allowedHosts: true },
  // ... rest of config
})


LocalTunnel IP Verification Page
When opening a localtunnel link first time, you'll see:
"Please proceed with caution. To continue, enter the IP shown above."
This is normal security behavior from LocalTunnel.
Steps to bypass:
The page shows the tunnel host's IP address (e.g. 20.192.21.51)
Copy that exact IP using the copy icon next to it
Paste it into the "IP Address" input field
Click Continue
This confirms you trust the link sender. After this, the tunnel works normally.
To skip this page programmatically (for automated testing):
Add a custom request header: bypass-tunnel-reminder: true
Important Notes
LocalTunnel URLs are temporary — they change every time you restart the tunnel
Free LocalTunnel URLs are not for production — only for local team demos
For permanent public hosting, use Vercel (see deployment section above)
EOF
git add README.md && git commit -m "docs: add localtunnel setup, IP verification fix, and sharing guide"


cat >> README.md << 'EOF'

---

## Bug Fix: Live Block showing 0

**Problem:** Frontend called `/api/block` but Vite (port 5173) had no proxy to forward it to the backend (port 3001), so the request failed silently and Block always showed `0`.

**Fix:** Added proxy in `vite.config.ts`:
```ts
server: {
  proxy: { '/api': 'http://localhost:3001' }
}



## Demo Video
https://youtube.com/shorts/JyOeau-qFvw?si=aA2Zwsod16YiOcxc

### Real Agent Output Example
```
Real Block Height: 8,388,570
Real CSPR Price: $0.00200832
Contract Status: DEPLOYED

APPROVED: trading-bot-001 | 5 CSPR | LOW (score=0)
BLOCKED: defi-agent-007 | 150 CSPR | HIGH (score=3) | High amount >100 CSPR
APPROVED: rwa-oracle-003 | 2 CSPR | LOW (score=0)

Summary: 2 approved, 1 blocked
```
