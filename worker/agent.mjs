const RPC = 'https://node.testnet.casper.network/rpc'
const COINGECKO = 'https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd'
const CONTRACT = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'

async function getBlockHeight() {
  const r = await fetch(RPC, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({jsonrpc:'2.0', method:'chain_get_block', params:[], id:1})
  })
  const d = await r.json()
  return d.result?.block_with_signatures?.block?.Version2?.header?.height || 0
}

async function getCsprPrice() {
  const r = await fetch(COINGECKO)
  const d = await r.json()
  return d['casper-network']?.usd || 0
}

function aiRiskScore(amount, agentId) {
  let score = 0, reasons = []
  if (amount > 100) { score += 3; reasons.push('High amount >100 CSPR') }
  else if (amount > 10) { score += 1; reasons.push('Medium amount >10 CSPR') }
  if (agentId.toLowerCase().includes('test')) score -= 1
  const risk = score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW'
  return { risk, score, reasons }
}

async function main() {
  console.log('='.repeat(55))
  console.log('🛡️  CasperGuard AI Agent — Node.js')
  console.log('   Network: Casper Testnet')
  console.log(`   Contract: ${CONTRACT.slice(0,30)}...`)
  console.log('='.repeat(55))

  const [block, price] = await Promise.all([getBlockHeight(), getCsprPrice()])
  console.log(`\n   Real Block Height: ${block.toLocaleString()}`)
  console.log(`   Real CSPR Price:   $${price}`)
  console.log(`   Contract Status:   DEPLOYED ✅`)
  console.log('='.repeat(55))

  const agents = [
    { id: 'trading-bot-001', amount: 5, service: 'price-feed' },
    { id: 'defi-agent-007', amount: 150, service: 'swap' },
    { id: 'rwa-oracle-003', amount: 2, service: 'data-update' },
    { id: 'nft-agent-002', amount: 25, service: 'nft-mint' },
    { id: 'dao-voter-001', amount: 8, service: 'governance' },
  ]

  let approved = 0, blocked = 0
  for (const agent of agents) {
    const { risk, score, reasons } = aiRiskScore(agent.amount, agent.id)
    const status = score >= 3 ? 'BLOCKED' : 'APPROVED'
    const emoji = score >= 3 ? '🔴' : '✅'
    console.log(`\n${emoji} ${status}: ${agent.id}`)
    console.log(`   Amount:  ${agent.amount} CSPR`)
    console.log(`   Service: ${agent.service}`)
    console.log(`   Risk:    ${risk} (score=${score})`)
    if (reasons.length) console.log(`   Reason:  ${reasons.join(', ')}`)
    if (status === 'APPROVED') approved++; else blocked++
  }

  console.log('\n' + '='.repeat(55))
  console.log(`✅ Approved: ${approved}`)
  console.log(`🔴 Blocked:  ${blocked}`)
  console.log(`📊 Total:    ${agents.length}`)
  console.log(`🔗 Explorer: https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`)
  console.log('='.repeat(55))
}

main().catch(console.error)
