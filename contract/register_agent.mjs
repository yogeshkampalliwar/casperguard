import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fs = require('fs')
const sdk = require('casper-js-sdk')

const RPC = 'https://node.testnet.casper.network/rpc'
const CONTRACT = '28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const KEY_PATH = '/workspaces/casperguard/contract/keys/secret_key.pem'

async function main() {
  const pem = fs.readFileSync(KEY_PATH, 'utf8')
  const key = await sdk.PrivateKey.fromPem(pem, sdk.KeyAlgorithm.SECP256K1)
  console.log('Key:', key.publicKey.toHex().slice(0,20) + '...')

  const client = new sdk.RpcClient(new sdk.HttpHandler(RPC))
  const block = await client.getLatestBlock()
  console.log('Block:', block.block?.header?.height)

  const args = new sdk.Args([
    new sdk.NamedArg('agent_id', new sdk.CLValueString('trading-bot-001')),
    new sdk.NamedArg('daily_budget_cspr', new sdk.CLValueUInt64(BigInt(1000))),
    new sdk.NamedArg('max_per_call_cspr', new sdk.CLValueUInt64(BigInt(100))),
  ])

  const session = new sdk.StoredContractByHash(
    Buffer.from(CONTRACT, "hex"),
    'register_agent',
    args
  )

  const payment = sdk.ExecutableDeployItem.newModuleBytes(
    new Uint8Array(),
    new sdk.Args([new sdk.NamedArg('amount', new sdk.CLValueUInt512(BigInt(5000000000)))])
  )

  const deployHeader = sdk.DeployHeader.default(key.publicKey, 'casper-test')
  const deploy = new sdk.Deploy(deployHeader, payment, session)
  await deploy.sign(key)

  const result = await client.putDeploy(deploy)
  console.log('TX Hash:', result.deployHash)
  console.log('Explorer: https://testnet.cspr.live/transaction/' + result.deployHash)
}

main().catch(e => console.error(e.message || e))
