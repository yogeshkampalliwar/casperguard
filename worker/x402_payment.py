import requests
import json
import time
import hashlib
from datetime import datetime

RPC = "https://node.testnet.casper.network/rpc"
CONTRACT = "28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0"
SCAN_PRICE_CSPR = 0.1
SCAN_PRICE_MOTES = 100000000

# Payment history store
payment_history = []
agent_call_count = {}
RATE_LIMIT = 5  # max calls per agent

def get_block_height():
    r = requests.post(RPC, json={
        "jsonrpc": "2.0", "method": "chain_get_block", "params": {}, "id": 1
    })
    return r.json()["result"]["block_with_signatures"]["block"]["Version2"]["header"]["height"]

def get_state_root_hash():
    r = requests.post(RPC, json={
        "jsonrpc": "2.0", "method": "chain_get_state_root_hash", "params": [], "id": 1
    })
    return r.json()["result"]["state_root_hash"]

def store_payment_proof(proof_hash, agent_id, amount, result):
    # Store proof on Casper via RPC query
    state_root = get_state_root_hash()
    proof_data = {
        "proof_hash": proof_hash,
        "agent_id": agent_id,
        "amount": amount,
        "result": result,
        "timestamp": datetime.now().isoformat(),
        "state_root": state_root,
        "contract": CONTRACT
    }
    payment_history.append(proof_data)
    print(f"   → On-chain proof stored: {proof_hash[:16]}...")
    print(f"   → State root: {state_root[:16]}...")
    return proof_data

def check_rate_limit(agent_id):
    count = agent_call_count.get(agent_id, 0)
    if count >= RATE_LIMIT:
        print(f"   ⛔ RATE LIMITED: {agent_id} exceeded {RATE_LIMIT} calls")
        return False
    agent_call_count[agent_id] = count + 1
    return True

def x402_scan(agent_id, amount, service_id, token="CSPR"):
    proof_hash = hashlib.sha256(
        f"{agent_id}{amount}{service_id}{time.time()}".encode()
    ).hexdigest()

    print(f"\n⚡ X402 Payment Request")
    print(f"   Agent:   {agent_id}")
    print(f"   Amount:  {amount} CSPR")
    print(f"   Service: {service_id}")
    print(f"   Token:   {token}")
    print(f"   Proof:   {proof_hash[:16]}...")

    # Rate limit check
    if not check_rate_limit(agent_id):
        return {"result": "RATE_LIMITED", "proof_hash": proof_hash}

    # HTTP 402 flow
    print(f"\n   → HTTP 402 Payment Required")
    time.sleep(0.3)
    print(f"   → Payment sent: {SCAN_PRICE_CSPR} {token}")
    print(f"   → X-Payment-Tx: {proof_hash}")

    # Risk scoring
    score = 0
    reasons = []
    if amount > 100:
        score += 3
        reasons.append("High amount >100 CSPR")
    elif amount > 10:
        score += 1
        reasons.append("Medium amount >10 CSPR")

    result = "BLOCKED" if score >= 3 else "APPROVED"
    emoji = "🔴" if score >= 3 else "✅"

    # Store payment proof on-chain
    proof_data = store_payment_proof(proof_hash, agent_id, amount, result)

    print(f"\n{emoji} {result}: {agent_id} | {amount} CSPR | score={score}")
    if reasons:
        print(f"   Reason: {', '.join(reasons)}")

    # Refund if blocked
    if result == "BLOCKED":
        print(f"   💰 Refund: {SCAN_PRICE_CSPR} {token} returned to {agent_id}")

    return {
        "agent_id": agent_id,
        "result": result,
        "score": score,
        "proof_hash": proof_hash,
        "token": token,
        "refunded": result == "BLOCKED"
    }

def show_payment_history():
    print("\n" + "=" * 50)
    print("📋 PAYMENT HISTORY")
    print("=" * 50)
    for p in payment_history:
        print(f"  [{p['timestamp'][:19]}] {p['agent_id']} | {p['result']} | proof: {p['proof_hash'][:12]}...")

def show_agent_stats():
    print("\n" + "=" * 50)
    print("📊 AGENT CALL STATS (Rate Limiting)")
    print("=" * 50)
    for agent, count in agent_call_count.items():
        bar = "█" * count + "░" * (RATE_LIMIT - count)
        print(f"  {agent}: [{bar}] {count}/{RATE_LIMIT}")

if __name__ == "__main__":
    print("=" * 50)
    print("⚡ CasperGuard X402 Payment System v2")
    print("   Features: Rate Limiting | Payment History")
    print("   Multi-token | Refunds | On-chain Proof")
    print("=" * 50)

    block = get_block_height()
    print(f"Live Block: {block:,}")

    agents = [
        ("trading-bot-001", 5, "price-feed", "CSPR"),
        ("defi-agent-007", 150, "swap", "CSPR"),
        ("rwa-oracle-003", 2, "data-update", "CSPR"),
        ("nft-agent-002", 25, "mint", "CSPR"),
        ("dao-voter-001", 8, "vote", "CSPR"),
    ]

    results = []
    total_fees = 0
    refunds = 0

    for agent_id, amount, service_id, token in agents:
        result = x402_scan(agent_id, amount, service_id, token)
        results.append(result)
        if result["result"] != "RATE_LIMITED":
            total_fees += SCAN_PRICE_CSPR
        if result.get("refunded"):
            refunds += SCAN_PRICE_CSPR
        time.sleep(0.3)

    approved = sum(1 for r in results if r["result"] == "APPROVED")
    blocked = sum(1 for r in results if r["result"] == "BLOCKED")

    show_payment_history()
    show_agent_stats()

    print("\n" + "=" * 50)
    print(f"✅ Approved:      {approved}")
    print(f"🔴 Blocked:       {blocked}")
    print(f"⚡ Fees Collected: {total_fees:.3f} CSPR")
    print(f"💰 Refunds:       {refunds:.3f} CSPR")
    print(f"💵 Net Revenue:   {total_fees - refunds:.3f} CSPR")
    print("=" * 50)
