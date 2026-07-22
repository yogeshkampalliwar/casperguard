import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fs = require('fs')
const sdk = require('casper-js-sdk')

const RPC = 'https://node.testnet.casper.network/rpc'
const KEY_PATH = './keys/secret_key.pem'
const WASM_PATH = './wasm/CasperGuard.wasm'

async function main() {
  const pem = fs.readFileSync(KEY_PATH, 'utf8')
  const key = await sdk.PrivateKey.fromPem(pem, sdk.KeyAlgorithm.SECP256K1)
  console.log('Key:', key.publicKey.toHex().slice(0,20) + '...')

  const wasmBytes = fs.readFileSync(WASM_PATH)
  console.log('WASM size:', wasmBytes.length, 'bytes')

  const client = new sdk.RpcClient(new sdk.HttpHandler(RPC))

  const deployHeader = sdk.DeployHeader.default()
  deployHeader.account = key.publicKey
  deployHeader.chainName = 'casper-test'

  const session = sdk.ExecutableDeployItem.newModuleBytes(wasmBytes, new sdk.Args([]))
  const payment = sdk.ExecutableDeployItem.standardPayment('50000000000')

  const deploy = sdk.Deploy.makeDeploy(deployHeader, payment, session)
  deploy.sign(key)

  const result = await client.putDeploy(deploy)
  console.log('TX Hash:', Buffer.from(result.deployHash.hashBytes).toString('hex'))
  console.log('Explorer: https://testnet.cspr.live/transaction/' + Buffer.from(result.deployHash.hashBytes).toString('hex'))
}

main().catch(e => console.error(e.message || e))
