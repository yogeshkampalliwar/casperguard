import pycspr
from pycspr import KeyAlgorithm
import requests
import random

KEY_PATH = "/workspaces/casperguard/contract/keys/secret_key.pem"
RPC = "https://node.testnet.casper.network/rpc"
RECIPIENT = "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"

cp = pycspr.parse_private_key(KEY_PATH, KeyAlgorithm.SECP256K1.name)
pub = cp.to_public_key()

params = pycspr.create_deploy_parameters(
    account=cp,
    chain_name="casper-test"
)

recipient_key = pycspr.parse_private_key(KEY_PATH, KeyAlgorithm.SECP256K1.name).to_public_key()

deploy = pycspr.create_transfer(
    params=params,
    amount=2500000000,
    target=bytes.fromhex(RECIPIENT[2:]),
    correlation_id=random.randint(1, 999999)
)

approval = pycspr.create_deploy_approval(deploy=deploy, approver=cp)
deploy.approvals.append(approval)

deploy_dict = pycspr.to_json(deploy)
r = requests.post(RPC, json={
    "jsonrpc": "2.0",
    "method": "account_put_deploy",
    "params": {"deploy": deploy_dict},
    "id": 1
}, headers={"Content-Type": "application/json"}, timeout=30)

resp = r.json()
print(resp)
if "result" in resp:
    hash = resp["result"]["deploy_hash"]
    print(f"TX Hash: {hash}")
    print(f"Explorer: https://testnet.cspr.live/transaction/{hash}")
