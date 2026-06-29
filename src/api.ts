const COINGECKO = 'https://api.coingecko.com/api/v3'

export async function getBlockHeight(): Promise<number> {
  try {
    const r = await fetch('/api/block')
    const data = await r.json()
    return data.height
  } catch { return 0 }
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
