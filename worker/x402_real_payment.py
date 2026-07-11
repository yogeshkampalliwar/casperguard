import pycspr, requests, random
from pycspr import KeyAlgorithm

KEY = '/workspaces/casperguard/contract/keys/secret_key.pem'
cp = pycspr.parse_private_key(KEY, KeyAlgorithm.SECP256K1.name)
pub = cp.to_public_key()
target = bytes.fromhex('02038ccdd95411a19ba15d4784545a3e07dfa3afd2a839253472232991541ff55ada')

params = pycspr.create_deploy_parameters(account=cp, chain_name='casper-test')
deploy = pycspr.create_transfer(params=params, amount=2500000000, target=target, correlation_id=random.randint(1,999999))
approval = pycspr.create_deploy_approval(deploy=deploy, approver=cp)
deploy.approvals = [approval]

deploy_dict = pycspr.to_json(deploy)
r = requests.post('https://node.testnet.casper.network/rpc', json={'jsonrpc':'2.0','method':'account_put_deploy','params':{'deploy':deploy_dict},'id':1}, timeout=30)
print(r.json())
