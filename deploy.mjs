import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import CasperSdk from "casper-js-sdk";

const {
  Args, CLValue, ContractCallBuilder, HttpHandler,
  KeyAlgorithm, PrivateKey, PublicKey, RpcClient, SessionBuilder
} = CasperSdk;

const RPC_URL = "https://node.testnet.casper.network/rpc";
const CHAIN_NAME = "casper-test";
const KEY_PATH = resolve("/home/codespace/casperguard_old_wallet/secret_key.pem");
const WASM_PATH = resolve("contract/wasm/CasperGuard_opt.wasm");

async function main() {
  const handler = new HttpHandler(RPC_URL);
  const rpcClient = new RpcClient(handler);

  const pemData = await readFile(KEY_PATH, "utf8");
  const privateKey = await PrivateKey.fromPem(pemData, KeyAlgorithm.SECP256K1);
  const publicKey = privateKey.publicKey;

  console.log("Wallet:", publicKey.toHex().slice(0, 20) + "...");

  // Get balance
  const wasm = await readFile(WASM_PATH);
  console.log("WASM size:", wasm.length, "bytes");

  // Step 1: Install contract
  console.log("\n[1] Installing contract...");
  const installArgs = Args.fromMap({
    odra_cfg_package_hash_key_name: CLValue.newCLString("casperguard_package_hash"),
    odra_cfg_allow_key_override: CLValue.newCLValueBool(true),
    odra_cfg_is_upgradable: CLValue.newCLValueBool(true),
    odra_cfg_is_upgrade: CLValue.newCLValueBool(false),
  });

  const installTx = new SessionBuilder()
    .from(publicKey)
    .wasm(wasm)
    .installOrUpgrade()
    .runtimeArgs(installArgs)
    .chainName(CHAIN_NAME)
    .payment(200000000000)
    .buildFor1_5();
  installTx.sign(privateKey);

  const installSubmit = await rpcClient.putDeploy(installTx);
  const installHash = installSubmit?.deployHash?.toHex?.() || String(installSubmit);
  console.log("Install hash:", installHash);
  console.log("URL: https://testnet.cspr.live/transaction/" + installHash);

  console.log("Waiting 3 mins...");
  await new Promise(r => setTimeout(r, 180000));

  // Get contract hash from named keys
  const accountInfo = await rpcClient.getAccountInfo(null, publicKey);
  const namedKeys = accountInfo.account.namedKeys;
  console.log("Named keys:", namedKeys.map(k => k.name));

  const contractKey = namedKeys.find(k => k.name.includes("contract") && !k.name.includes("package"));
  if (!contractKey) {
    console.log("All keys:", JSON.stringify(namedKeys, null, 2));
    return;
  }

  const contractHash = contractKey.key.toPrefixedString().replace("hash-", "");
  console.log("\nContract hash:", contractHash);

  // Step 2: Init contract
  console.log("\n[2] Calling init()...");
  const initTx = new ContractCallBuilder()
    .from(publicKey)
    .byHash(contractHash)
    .entryPoint("init")
    .runtimeArgs(Args.fromMap({}))
    .chainName(CHAIN_NAME)
    .payment(1000000000)
    .buildFor1_5();
  initTx.sign(privateKey);

  const initSubmit = await rpcClient.putDeploy(initTx);
  const initHash = initSubmit?.deployHash?.toHex?.() || String(initSubmit);
  console.log("Init hash:", initHash);
  console.log("URL: https://testnet.cspr.live/transaction/" + initHash);
  console.log("\n✅ Contract deployed and initialized!");
  console.log("New contract hash: hash-" + contractHash);
}

main().catch(e => { console.error("Failed:", e.message); process.exit(1); });
