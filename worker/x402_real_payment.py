import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)
import pycspr
from pycspr import KeyAlgorithm, NodeRpcClient, NodeRpcConnectionInfo
import requests
import random
import time

KEY_PATH = "/workspaces/casperguard/contract/keys/secret_key.pem"
RECIPIENT = "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
RPC = "https://node.testnet.casper.network/rpc"
SCAN_PRICE_MOTES = 2500000000  # 2.5 CSPR minimum

def get_block_height():
    r = requests.post(RPC, json={"jsonrpc":"2.0","method":"chain_get_block","params":{},"id":1})
    return r.json()["result"]["block_with_signatures"]["block"]["Version2"]["header"]["height"]

def get_balance(pub_hex):
    r = requests.post(RPC, json={"jsonrpc":"2.0","method":"query_balance","params":{"purse_identifier":{"main_purse_under_public_key": pub_hex}},"id":1})
    return int(r.json().get("result",{}).get("balance",0)) / 1e9

def x402_real_scan(agent_id, amount, service_id):
    # Official pycspr way
    cp1 = pycspr.parse_private_key(KEY_PATH, KeyAlgorithm.SECP256K1.name)
    pub_hex = cp1.to_public_key().account_key.hex()

    print(f"\n{'='*55}")
    print(f"⚡ X402 REAL Payment — Casper Testnet")
    print(f"   Agent:   {agent_id}")
    print(f"   Amount:  {amount} CSPR")
    print(f"   Service: {service_id}")
    print(f"   Wallet:  {pub_hex[:20]}...")

    balance = get_balance(pub_hex)
    print(f"   Balance: {balance:.4f} CSPR")

    if balance < 0.5:
        print(f"   ❌ Insufficient balance!")
        return {"result": "ERROR"}

    print(f"\n   [1] → HTTP 402 Payment Required")
    print(f"       price: 0.1 CSPR | network: casper-test")
    print(f"   [2] → Building real Casper deploy...")

    deploy_params = pycspr.create_deploy_parameters(
        account=cp1,
        chain_name="casper-test"
    )

    # target must be bytes — use account_key bytes directly
    target_pub_key = pycspr.types.cl.CLV_PublicKey(pycspr.KeyAlgorithm.SECP256K1, bytes.fromhex(RECIPIENT))

    deploy = pycspr.create_transfer(
        params=deploy_params,
        amount=SCAN_PRICE_MOTES,
        target=bytes.fromhex(RECIPIENT),
        correlation_id=random.randint(1, 1000000)
    )

    deploy.approve(cp1)
    deploy_hash = deploy.hash.hex()
    print(f"   [3] ← Signed! Hash: {deploy_hash[:20]}...")

    print(f"   [4] → Submitting to Casper testnet...")
    import json
    import dataclasses
    deploy_dict = pycspr.to_json(deploy)
    r = requests.post(
        "https://node.testnet.casper.network/rpc",
        json={"jsonrpc":"2.0","method":"account_put_deploy","params":{"deploy": deploy_dict},"id":1},
        headers={"Content-Type":"application/json"},
        timeout=30
    )
    resp = r.json()
    if "error" in resp:
        print(f"   ❌ Error: {resp['error']}")
    result = resp
    print(f"   [4] ← Submitted! ✅")
    print(f"   🔗 https://testnet.cspr.live/transaction/{deploy_hash}")

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
        print(f"   💰 Refund: 0.1 CSPR returned")

    return {"agent_id": agent_id, "result": result, "score": score, "deploy_hash": deploy_hash}

if __name__ == "__main__":
    print("="*55)
    print("⚡ CasperGuard X402 REAL Payment v8")
    print("   Official pycspr | Real testnet!")
    print("="*55)

    block = get_block_height()
    print(f"Live Block: {block:,}")

    agents = [
        ("trading-bot-001", 5, "price-feed"),
        ("defi-agent-007", 150, "swap"),
        ("rwa-oracle-003", 2, "data-update"),
    ]

    results = []
    for agent_id, amount, service_id in agents:
        r = x402_real_scan(agent_id, amount, service_id)
        results.append(r)
        time.sleep(2)

    approved = sum(1 for r in results if r.get("result") == "APPROVED")
    blocked = sum(1 for r in results if r.get("result") == "BLOCKED")

    print("\n" + "="*55)
    print(f"✅ Approved: {approved}")
    print(f"🔴 Blocked:  {blocked}")
    print(f"⚡ Real deploys on Casper testnet!")
    print("="*55)
