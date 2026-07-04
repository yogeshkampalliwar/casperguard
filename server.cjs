const express = require('express')
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/block', async (req, res) => {
  const r = await fetch('https://node.testnet.casper.network/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_get_block', params: {}, id: 1 })
  })
  const data = await r.json()
  res.json({ height: data.result.block_with_signatures.block.Version2.header.height })
})

app.listen(3001, () => console.log('Server running on port 3001'))
