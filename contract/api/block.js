export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    const r = await fetch('https://node.testnet.casper.network/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_block', params: {}, id: 1 })
    })
    const data = await r.json()
    const height = data.result.block_with_signatures.block.Version2.header.height
    res.json({ height })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
