import { CasperClient, DeployUtil, Keys, RuntimeArgs, CLValueBuilder } from 'casper-js-sdk'

const RPC = 'https://node.testnet.casper.network/rpc'
const CONTRACT_HASH = '28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const client = new CasperClient(RPC)

export async function registerAgent(
  agentId: string,
  dailyBudget: number,
  maxPerCall: number,
  privateKeyHex: string
) {
  const keys = Keys.Ed25519.parsePrivateKey(Buffer.from(privateKeyHex, 'hex'))
  const keyPair = Keys.Ed25519.parseKeyPair(keys.publicKey.rawPublicKey, keys)

  const deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(keyPair.publicKey, 'casper-test', 1, 1800000),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      Uint8Array.from(Buffer.from(CONTRACT_HASH, 'hex')),
      'register_agent',
      RuntimeArgs.fromMap({
        agent_id: CLValueBuilder.string(agentId),
        daily_budget_cspr: CLValueBuilder.u64(dailyBudget),
        max_per_call_cspr: CLValueBuilder.u64(maxPerCall),
      })
    ),
    DeployUtil.standardPayment(5000000000)
  )

  const signed = deploy.sign([keyPair])
  const hash = await client.putDeploy(signed)
  return hash
}

export async function secureTransaction(
  agentId: string,
  amount: number,
  serviceId: string,
  proofHash: string,
  privateKeyHex: string
) {
  const keys = Keys.Ed25519.parsePrivateKey(Buffer.from(privateKeyHex, 'hex'))
  const keyPair = Keys.Ed25519.parseKeyPair(keys.publicKey.rawPublicKey, keys)

  const deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(keyPair.publicKey, 'casper-test', 1, 1800000),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      Uint8Array.from(Buffer.from(CONTRACT_HASH, 'hex')),
      'secure_transaction',
      RuntimeArgs.fromMap({
        agent_id: CLValueBuilder.string(agentId),
        amount: CLValueBuilder.u512(amount),
        service_id: CLValueBuilder.string(serviceId),
        proof_hash: CLValueBuilder.string(proofHash),
      })
    ),
    DeployUtil.standardPayment(5000000000)
  )

  const signed = deploy.sign([keyPair])
  const hash = await client.putDeploy(signed)
  return hash
}

export async function getAgentStats(agentId: string) {
  const result = await client.nodeClient.getStateRootHash()
  return result
}
