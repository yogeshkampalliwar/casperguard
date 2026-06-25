// Real Casper Network API calls
const RPC_URL = 'https://node.testnet.casper.network/rpc'
const COINGECKO = 'https://api.coingecko.com/api/v3'

export async function getBlockHeight(): Promise<number> {
  const r = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_block', params: {}, id: 1 })
  })
  const data = await r.json()
  return data.result.block_with_signatures.block.Version2.header.height
}

export async function getCSPRPrice(): Promise<number> {
  const r = await fetch(`${COINGECKO}/simple/price?ids=casper-network&vs_currencies=usd`)
  const data = await r.json()
  return data['casper-network']?.usd || 0
}

export async function getGoldPrice(): Promise<number> {
  try {
    const r = await fetch('https://api.metals.live/v1/spot/gold')
    const data = await r.json()
    return data[0]?.price || 2345.50
  } catch {
    return 2345.50
  }
}

export function aiRiskScore(amount: number, agentId: string): { risk: string; score: number; reason: string } {
  let score = 0
  let reason = ''
  
  if (amount > 100) { score += 3; reason = 'High amount >100 CSPR' }
  else if (amount > 10) { score += 1; reason = 'Medium amount >10 CSPR' }
  if (agentId.toLowerCase().includes('test')) { score -= 1 }
  
  const risk = score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW'
  return { risk, score, reason }
}

export async function getAccountBalance(publicKey: string): Promise<number> {
  try {
    const r = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'query_balance',
        params: { purse_identifier: { main_purse_under_public_key: publicKey } },
        id: 1
      })
    })
    const data = await r.json()
    const motes = parseInt(data.result?.balance || '0')
    return motes / 1_000_000_000
  } catch {
    return 0
  }
}
