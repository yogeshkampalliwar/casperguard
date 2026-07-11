import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { RpcClient, makeCsprTransferDeploy, Keys } = require('casper-js-sdk')

const RPC = 'https://node.testnet.casper.network/rpc'
const KEY_PATH = '/workspaces/casperguard/contract/keys/secret_key.pem'
const RECIPIENT = '017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e'

async function transfer() {
  const client = new RpcClient(RPC)
  const key = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH)
  
  const deploy = makeCsprTransferDeploy({
    senderPublicKey: key.publicKey,
    recipientPublicKey: RECIPIENT,
    amount: '2500000000',
    paymentAmount: '100000000',
    chainName: 'casper-test',
  })
  
  deploy.sign([key])
  
  const result = await client.putDeploy(deploy)
  console.log('TX Hash:', result)
  console.log('Explorer: https://testnet.cspr.live/transaction/' + result)
}

console.log('Sending real x402 payment...')
transfer().catch(console.error)
