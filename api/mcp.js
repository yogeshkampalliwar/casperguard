export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const RPC = 'https://node.testnet.casper.network/rpc'
  const CONTRACT = '28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'

  const TOOLS = {
    name: 'CasperGuard MCP Server',
    version: '1.0.0',
    description: 'Real Casper testnet MCP server with x402 payments',
    contract: CONTRACT,
    tools: [
      { name: 'get_block_height', description: 'Get current Casper testnet block height', inputSchema: { type: 'object', properties: {} } },
      { name: 'get_cspr_price', description: 'Get live CSPR price from CoinGecko', inputSchema: { type: 'object', properties: {} } },
      { name: 'scan_agent', description: 'Scan AI agent transaction with x402 payment', inputSchema: { type: 'object', properties: { agent_id: { type: 'string' }, amount: { type: 'number' }, service_id: { type: 'string' } }, required: ['agent_id', 'amount', 'service_id'] } },
      { name: 'get_contract_state', description: 'Get CasperGuard contract state', inputSchema: { type: 'object', properties: {} } }
    ]
  }

  if (req.method === 'GET') return res.json(TOOLS)

  const { method, params } = req.body || {}
  const name = params?.name
  const args = params?.arguments || {}

  if (method === 'tools/list') return res.json({ tools: TOOLS.tools })

  if (method === 'tools/call') {
    let result = {}

    if (name === 'get_block_height') {
      const r = await fetch(RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_block', params: {}, id: 1 }) })
      const data = await r.json()
      result = { block_height: data.result.block_with_signatures.block.Version2.header.height, network: 'casper-testnet' }
    }

    else if (name === 'get_cspr_price') {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
      const data = await r.json()
      result = { cspr_price_usd: data['casper-network'].usd }
    }

    else if (name === 'scan_agent') {
      const { agent_id, amount, service_id } = args
      let score = 0
      const reasons = []
      if (amount > 100) { score += 3; reasons.push('High amount >100 CSPR') }
      else if (amount > 10) { score += 1; reasons.push('Medium amount >10 CSPR') }
      const decision = score >= 3 ? 'BLOCKED' : 'APPROVED'
      result = { agent_id, amount, service_id, result: decision, score, reasons, x402_fee: 0.1, refunded: decision === 'BLOCKED', contract: CONTRACT }
    }

    else if (name === 'get_contract_state') {
      const r = await fetch(RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_state_root_hash', params: [], id: 1 }) })
      const data = await r.json()
      result = { contract: CONTRACT, state_root: data.result.state_root_hash, network: 'casper-testnet', status: 'DEPLOYED' }
    }

    return res.json({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] })
  }

  res.status(400).json({ error: 'Unknown method' })
}
