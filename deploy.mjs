import { readFile } from "node:fs/promises"
import CasperSdk from "casper-js-sdk"
const { Args, CLValue, HttpHandler, KeyAlgorithm, PrivateKey, RpcClient, SessionBuilder } = CasperSdk

const handler = new HttpHandler("https://node.testnet.casper.network/rpc")
const rpc = new RpcClient(handler)

const pem = await readFile("contract/keys/secret_key.pem", "utf8")
const privKey = await PrivateKey.fromPem(pem, KeyAlgorithm.SECP256K1)
const wasm = await readFile("contract/wasm/CasperGuard.wasm")

const args = Args.fromMap({
  odra_cfg_package_hash_key_name: CLValue.newCLString("casperguard_package_hash"),
  odra_cfg_allow_key_override: CLValue.newCLValueBool(true),
  odra_cfg_is_upgradable: CLValue.newCLValueBool(true),
  odra_cfg_is_upgrade: CLValue.newCLValueBool(false),
})

const tx = new SessionBuilder()
  .from(privKey.publicKey)
  .wasm(wasm)
  .installOrUpgrade()
  .runtimeArgs(args)
  .chainName("casper-test")
  .payment(400000000000)
  .build()

tx.sign(privKey)
const result = await rpc.putTransaction(tx)
console.log("Full result:", JSON.stringify(result, null, 2))
const hash = result?.rawJSON?.transaction_hash?.Version1
console.log("Hash:", hash)
console.log("Explorer: https://testnet.cspr.live/transaction/" + hash)
