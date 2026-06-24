# CasperGuard 🛡️

**The pre-payment firewall for x402 AI agents on Casper.**

x402 lets AI agents pay per request — autonomously, with no human approval. That power cuts both ways: a misbehaving, compromised, or simply buggy agent can drain a wallet just as fast as it can pay a legitimate invoice. CasperGuard is the on-chain spending firewall that sits in front of every x402 call an agent makes, enforcing hard limits **before** money moves.

## Live Demo

🌐 **App**: https://casperguard-bay.vercel.app
📦 **Contract**: `hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`
🔗 **Explorer**: https://testnet.cspr.live/contract/hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0

## The problem with autonomous x402 spending

x402 turns the HTTP 402 status code into a live payment handshake: an agent calls an endpoint, gets a price, signs a payment, and the resource is delivered — all without a human in the loop. That's the whole point of the protocol, and it's why Casper shipped an x402 Facilitator on mainnet.

But removing the human approval step also removes the human *judgment* step. Today, nothing on-chain stops an agent from:

- Paying the same invoice twice (replay)
- Blowing through a budget in one bad loop
- Sending an outsized payment to a single call because of a bug or a malicious prompt

Escrow protocols fix what happens **after** a bad payment lands — they hold funds and refund on bad delivery. CasperGuard fixes it **before** the payment is even attempted, by giving every agent a hard-coded, on-chain spending policy that the agent itself cannot override.

## How it works
AI Agent wants to pay via x402
│
▼
secure_transaction(agent_id, amount, service_id, proof_hash)
│
▼
┌───────────────────────────────┐
│      CasperGuard Contract      │
│  1. Already-paid this invoice? │── yes ──▶ ❌ BLOCKED (DuplicateTransaction)
│  2. Over the per-call limit?   │── yes ──▶ ❌ BLOCKED (ExceedsMaxPerCall)
│  3. Over today's budget?       │── yes ──▶ ❌ BLOCKED (ExceedsDailyBudget)
└───────────────────────────────┘
│ all checks pass
▼
✅ APPROVED → recorded on-chain → agent reputation++ → x402 payment proceeds
Every approval and every block is an on-chain event (`TransactionApproved`, `TransactionBlocked`, `SettlementRecorded`) — a permanent, auditable record of how disciplined (or not) an agent has been with its wallet.

## Smart contract entry points

| Function | Description |
|---|---|
| `register_agent(agent_id, daily_budget_cspr, max_per_call_cspr)` | Onboard an agent with a hard spending policy |
| `secure_transaction(agent_id, amount, service_id, proof_hash)` | Validate a payment against the policy before it's allowed to proceed |
| `reset_daily_budget(agent_id)` | Owner-only daily reset |
| `get_agent_reputation(agent_id)` | On-chain trust score, built from clean transaction history |
| `get_total_settlements()` / `get_total_blocked()` | Network-wide visibility into agent behavior |

## Why this matters for the x402 economy

Casper's x402 Facilitator removes friction from agent payments. CasperGuard puts the friction back exactly where it belongs — between a misbehaving agent and your wallet — without slowing down legitimate spending at all. It's the missing spending-policy layer underneath the protocol, the same way card networks added fraud limits on top of "any merchant can charge any card."

## Tech stack

- **Contract**: Rust + [Odra](https://odra.dev) 2.8.1 → WASM, deployed on Casper Testnet (Casper 2.0 / Condor)
- **Frontend**: React + TypeScript + Vite, live RPC calls to a Casper node
- **Network**: Casper Testnet (`casper-test`)

## Verified on-chain

- **Install transaction**: `3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb` — Status: ✅ Success
- View live on [CSPR.live](https://testnet.cspr.live)

## Run locally

```bash
# Contract
cd contract && cargo odra build -b casper

# Frontend
cd casperguard-web && npm install && npm run dev

