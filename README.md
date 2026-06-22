# CasperGuard

AI Agent Security + Settlement Layer for Casper Network
Casper Agentic Buildathon 2026

## Contract (Casper Testnet)
hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0

Explorer: https://testnet.cspr.live/contract/hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0

Deploy TX: https://testnet.cspr.live/transaction/3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb

## What is CasperGuard?
CasperGuard is an AI-powered security and settlement layer for autonomous AI agents on Casper Network. It enables safe, auditable, budget-controlled AI agent transactions with on-chain proof.

## Features
- AI Agent registration with daily spending limits
- Per-call transaction limits
- Duplicate transaction prevention
- On-chain reputation tracking
- x402-compatible settlement recording
- Real-time risk assessment

## Tech Stack
- Rust + Odra Framework v2.8 (smart contract)
- Casper Testnet
- Python 3 (AI agent worker)
- x402 micropayments protocol

## Run

Deploy contract:
cargo run --bin deploy_on_livenet --features=livenet

Run AI agent:
cd worker && python3 agent.py

## Track
Casper Innovation Track - Casper Agentic Buildathon 2026
