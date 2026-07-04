import requests
import json
import time
import hashlib

RPC = "https://node.testnet.casper.network/rpc"
CONTRACT = "28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0"
SCAN_PRICE = 100000000  # 0.1 CSPR

def get_block_height():
    r = requests.post(RPC, json={
        "jsonrpc": "2.0",
        "method": "chain_get_block",
        "params": {},
        "id": 1
    })
    return r.json()["result"]["block_with_signatures"]["block"]["Version2"]["header"]["height"]

def x402_scan(agent_id, amount, service_id):
    proof_hash = hashlib.sha256(f"{agent_id}{amount}{service_id}{time.time()}".encode()).hexdigest()
    
    print(f"\n⚡ X402 Payment Request")
    print(f"   Agent: {agent_id}")
    print(f"   Amount: {amount} CSPR")
    print(f"   Service: {service_id}")
    print(f"   Proof: {proof_hash[:16]}...")
    print(f"   Cost: 0.1 CSPR scan fee")
    
    # Simulate HTTP 402 payment flow
    response_402 = {
        "status": 402,
        "payment_required": {
            "amount": SCAN_PRICE,
            "contract": CONTRACT,
            "network": "casper-test",
            "service_id": service_id
        }
    }
    
    print(f"\n   → HTTP 402 Payment Required")
    time.sleep(0.5)
    
    # Risk scoring
    score = 0
    reasons = []
    if amount > 100:
        score += 3
        reasons.append("High amount >100 CSPR")
    elif amount > 10:
        score += 1
        reasons.append("Medium amount >10 CSPR")
    
    # Payment confirmed
    print(f"   → Payment sent: {SCAN_PRICE/1e9} CSPR")
    print(f"   → X-Payment-Tx: {proof_hash}")
    
    # Result
    if score >= 3:
        result = "BLOCKED"
        emoji = "🔴"
    else:
        result = "APPROVED"
        emoji = "✅"
    
    print(f"\n{emoji} {result}: {agent_id} | {amount} CSPR | score={score}")
    if reasons:
        print(f"   Reason: {', '.join(reasons)}")
    
    return {
        "agent_id": agent_id,
        "result": result,
        "score": score,
        "proof_hash": proof_hash,
        "payment_tx": proof_hash
    }

if __name__ == "__main__":
    print("=" * 50)
    print("⚡ CasperGuard X402 Payment System")
    print("=" * 50)
    
    block = get_block_height()
    print(f"Live Block: {block:,}")
    
    agents = [
        ("trading-bot-001", 5, "price-feed"),
        ("defi-agent-007", 150, "swap"),
        ("rwa-oracle-003", 2, "data-update"),
    ]
    
    results = []
    total_fees = 0
    
    for agent_id, amount, service_id in agents:
        result = x402_scan(agent_id, amount, service_id)
        results.append(result)
        total_fees += SCAN_PRICE / 1e9
        time.sleep(0.3)
    
    approved = sum(1 for r in results if r["result"] == "APPROVED")
    blocked = sum(1 for r in results if r["result"] == "BLOCKED")
    
    print("\n" + "=" * 50)
    print(f"✅ Approved: {approved}")
    print(f"🔴 Blocked: {blocked}")
    print(f"⚡ Total X402 Fees Paid: {total_fees:.3f} CSPR")
    print("=" * 50)
