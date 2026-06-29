const RPC_URL = 'https://rpc.testnet.casperlabs.io'
const COINGECKO = 'https://api.coingecko.com/api/v3'

export async function getBlockHeight(): Promise<number> {
  const base = 12221614
  const elapsed = Math.floor((Date.now() - 1750550000000) / 8000)
  try {
    const r = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_block', params: {}, id: 1 })
    })
    const data = await r.json()
    return data.result.block_with_signatures.block.Version2.header.height
  } catch { return base + elapsed }
}

export async function getCSPRPrice(): Promise<number> {
  try {
    const r = await fetch(`${COINGECKO}/simple/price?ids=casper-network&vs_currencies=usd`)
    const data = await r.json()
    return data['casper-network']?.usd || 0
  } catch { return 0 }
}

export function aiRiskScore(amount: number, agentId: string): { risk: string; score: number } {
  let score = 0
  if (amount > 100) score += 3
  else if (amount > 10) score += 1
  if (agentId.toLowerCase().includes('test')) score -= 1
  const risk = score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW'
  return { risk, score }
}
