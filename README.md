# CasperGuard Shield
## AI Agent Security Layer — Casper Agentic Buildathon 2026

CasperGuard is an on-chain AI agent gatekeeper for the Casper x402 economy.
Before any agent executes a transaction, CasperGuard risk engine scores it
and either APPROVES or BLOCKS it — protecting users from rogue agents.

## The Problem
x402 agents can be malicious — high spend limits, unknown services, suspicious patterns.
There is no on-chain security layer that vets agents before they act.

## The Solution

Agent wants to act → CasperGuard Risk Engine → score 0-5
- LOW  (0-1) → APPROVED
- HIGH (2+)  → BLOCKED
→ Decision logged on-chain on Casper Testnet

## Live Demo
https://casperguard-bay.vercel.app

## Contract on Casper Testnet
hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0
https://testnet.cspr.live/contract/hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0

## Features
- On-chain smart contract (Rust + Odra, Casper 2.0 testnet)
- AI risk scoring engine (Python)
- Real-time CSPR price and block height
- Live web dashboard (React + TypeScript + Vite)
- Animated particle canvas UI
- 3 agent types monitored per cycle

## Risk Scoring
| Factor | Score |
|--------|-------|
| Amount over 100 CSPR | +2 |
| Unknown service type | +1 |
| Suspicious pattern | +2 |
| Score 0-1 | APPROVED |
| Score 2+ | BLOCKED |

## Quick Start

Run AI Agent:
cd worker && python agent.py

Build Contract:
cd contract && cargo odra build

Run Web UI:
cd casperguard-web && npm run dev

## Tech Stack
- Contract: Rust + Odra 2.x (Casper 2.0 Condor)
- Agent: Python 3
- Web: React + TypeScript + Vite + Canvas Animation
- Deploy: Vercel

## Layout
| Path | What |
|------|------|
| contract/ | Rust Odra smart contract deployed on Casper testnet |
| worker/ | Python AI agent with risk scoring engine |
| casperguard-web/ | React web dashboard with live data |

## Built For
Casper Agentic Buildathon 2026

## License
MIT — original work for Casper Agentic Buildathon 2026
