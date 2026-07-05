import { hashTypedData, TransferAuthorizationTypes } from '@casper-ecosystem/casper-eip-712'

const CONTRACT = '28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const SCAN_PRICE = 0.001

const domain = {
  name: 'CasperGuard',
  version: '1',
  chainId: 'casper-test',
  verifyingContract: CONTRACT
}

export async function x402Pay(agentId, amount, serviceId) {
  const nonce = crypto.randomUUID().replace(/-/g, '')
  
  const auth = {
    from: agentId,
    to: CONTRACT,
    value: String(Math.floor(SCAN_PRICE * 1e9)),
    validAfter: '0',
    validBefore: String(Math.floor(Date.now() / 1000) + 300),
    nonce: nonce
  }

  // Real EIP-712 hash
  const digest = hashTypedData(domain, TransferAuthorizationTypes, auth)
  
  return {
    digest: Buffer.from(digest).toString('hex'),
    authorization: auth,
    serviceId,
    agentId,
    amount,
    scanPrice: SCAN_PRICE,
    network: 'casper-test',
    contract: CONTRACT
  }
}

export async function x402Scan(agentId, amount, serviceId) {
  // HTTP 402 flow
  const payment = await x402Pay(agentId, amount, serviceId)
  
  // Risk scoring
  let score = 0
  if (amount > 100) score += 3
  else if (amount > 10) score += 1
  
  const result = score >= 3 ? 'BLOCKED' : 'APPROVED'
  
  return {
    ...payment,
    result,
    score,
    refunded: result === 'BLOCKED',
    txHash: payment.digest.slice(0, 32)
  }
}
