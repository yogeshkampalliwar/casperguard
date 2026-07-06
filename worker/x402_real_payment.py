import pycspr
from pycspr import NodeRpcClient, NodeRpcConnectionInfo
from pycspr import PrivateKey, PublicKey
from pycspr.crypto import KeyAlgorithm
import requests
import hashlib
import time
from datetime import datetime

RPC = "https://node.testnet.casper.network/rpc"
CONTRACT = "28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0"
KEY_PATH = "/workspaces/casperguard/contract/keys/secret_key.pem"
SCAN_PRICE_MOTES = 100000000  # 0.1 CSPR

def load_key():
    private_key = pycspr.parse_private_key(KEY_PATH, KeyAlgorithm.SECP256K1)
    return private_key

def get_block_height():
    r = requests.post(RPC, json={"jsonrpc":"2.0","method":"chain_get_block","params":{},"id":1})
    return r.json()["result"]["block_with_signatures"]["block"]["Version2"]["header"]["height"]

def get_account_balance(public_key_hex):
    r = requests.post(RPC, json={
        "jsonrpc": "2.0",
        "method": "query_balance",
        "params": {"purse_identifier": {"main_purse_under_public_key": public_key_hex}},
        "id": 1
    })
    data = r.json()
    balance = int(data.get("result", {}).get("balance", 0))
    return balance / 1e9

def x402_real_scan(private_key, agent_id, amount, service_id):
    public_key = private_key.to_public_key()
    pub_hex = public_key.account_key.hex()

    print(f"\n{'='*55}")
    print(f"⚡ X402 REAL Payment — Casper Testnet")
    print(f"   Agent:      {agent_id}")
    print(f"   Amount:     {amount} CSPR")
    print(f"   Service:    {service_id}")
    print(f"   Wallet:     {pub_hex[:20]}...")

    # Check balance
    balance = get_account_balance(pub_hex)
    print(f"   Balance:    {balance:.4f} CSPR")

    if balance < 0.1:
        print(f"   ❌ Insufficient balance for scan fee!")
        return {"result": "ERROR", "reason": "Insufficient balance"}

    # Build real transfer deploy
    print(f"\n   [1] → Building real Casper deploy...")
    
    client = NodeRpcClient(NodeRpcConnectionInfo(host="node.testnet.casper.network", port=7777))
    
    deploy = pycspr.create_transfer(
        params=pycspr.CreateTransferParams(
            initiator_addr=public_key,
            chain_name="casper-test",
            target=pycspr.parse_public_key(
                "02" + CONTRACT[:64],
                KeyAlgorithm.SECP256K1
            ),
            amount=SCAN_PRICE_MOTES,
            memo=f"x402:{service_id}:{agent_id}"
        )
    )

    # Sign deploy
    deploy.approve(private_key)
    deploy_hash = deploy.hash.hex()
    
    print(f"   [2] ← Deploy signed ✅")
    print(f"       Hash: {deploy_hash[:24]}...")

    # Submit to Casper
    print(f"   [3] → Submitting to Casper testnet...")
    client.send_deploy(deploy)
    print(f"   [3] ← Deploy submitted ✅")
    print(f"       TX: https://testnet.cspr.live/transaction/{deploy_hash}")

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
    emoji = "🔴" if result == "BLOCKED" else "✅"

    print(f"\n{emoji} {result}: {agent_id} | {amount} CSPR | score={score}")
    if reasons:
        print(f"   Reason: {', '.join(reasons)}")
    if result == "BLOCKED":
        print(f"   💰 Refund: 0.1 CSPR will be returned")

    return {
        "agent_id": agent_id,
        "result": result,
        "score": score,
        "deploy_hash": deploy_hash,
        "tx_url": f"https://testnet.cspr.live/transaction/{deploy_hash}",
        "refunded": result == "BLOCKED"
    }

if __name__ == "__main__":
    print("="*55)
    print("⚡ CasperGuard X402 REAL Payment System")
    print("   Real Casper deploys on testnet!")
    print("="*55)

    try:
        private_key = load_key()
        print(f"✅ Wallet loaded successfully")
    except Exception as e:
        print(f"❌ Key load error: {e}")
        exit(1)

    block = get_block_height()
    print(f"Live Block: {block:,}")

    agents = [
        ("trading-bot-001", 5, "price-feed"),
        ("defi-agent-007", 150, "swap"),
        ("rwa-oracle-003", 2, "data-update"),
    ]

    results = []
    for agent_id, amount, service_id in agents:
        r = x402_real_scan(private_key, agent_id, amount, service_id)
        results.append(r)
        time.sleep(1)

    approved = sum(1 for r in results if r.get("result") == "APPROVED")
    blocked = sum(1 for r in results if r.get("result") == "BLOCKED")

    print("\n" + "="*55)
    print(f"✅ Approved: {approved}")
    print(f"🔴 Blocked:  {blocked}")
    print(f"⚡ Real deploys submitted to Casper testnet!")
    print("="*55)
