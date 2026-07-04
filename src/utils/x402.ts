// x402 Payment Protocol - Casper Network Integration
// Uses casper-js-sdk v5

export const CONTRACT_HASH = '28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
export const RPC_URL = 'https://node.testnet.casper.network/rpc'
export const SCAN_PRICE_MOTES = 100000000 // 0.1 CSPR per scan

export interface PaymentResult {
  deployHash: string
  agentId: string
  amount: number
  serviceId: string
  status: 'pending' | 'success' | 'failed'
}

export async function getContractState(): Promise<{ settlements: number; blocked: number }> {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'query_global_state',
        params: {
          state_identifier: { StateRootHash: await getStateRootHash() },
          key: `hash-${CONTRACT_HASH}`,
          path: []
        },
        id: 1
      })
    })
    const data = await response.json()
    return data.result || { settlements: 0, blocked: 0 }
  } catch {
    return { settlements: 0, blocked: 0 }
  }
}

async function getStateRootHash(): Promise<string> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'chain_get_state_root_hash',
      params: [],
      id: 1
    })
  })
  const data = await response.json()
  return data.result?.state_root_hash || ''
}

export async function buildSecureTransactionDeploy(
  agentId: string,
  amount: number,
  serviceId: string,
  proofHash: string
): Promise<object> {
  return {
    contract_hash: CONTRACT_HASH,
    entry_point: 'secure_transaction',
    args: {
      agent_id: agentId,
      amount: amount,
      service_id: serviceId,
      proof_hash: proofHash
    },
    payment: SCAN_PRICE_MOTES,
    network: 'casper-test'
  }
}

export async function submitDeploy(deployJson: object): Promise<string> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'account_put_deploy',
      params: { deploy: deployJson },
      id: 1
    })
  })
  const data = await response.json()
  return data.result?.deploy_hash || ''
}

export async function checkDeployStatus(deployHash: string): Promise<string> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'info_get_deploy',
      params: { deploy_hash: deployHash },
      id: 1
    })
  })
  const data = await response.json()
  const execResult = data.result?.execution_results?.[0]
  if (!execResult) return 'pending'
  return execResult.execution_result?.Version2?.error_message ? 'failed' : 'success'
}
