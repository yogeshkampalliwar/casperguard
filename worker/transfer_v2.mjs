import pkg from 'casper-js-sdk';
const { RpcClient, HttpHandler, PrivateKey, KeyAlgorithm, makeCsprTransferTransaction } = pkg;
import { readFileSync } from 'fs';

const RPC = 'https://node.testnet.casper.network/rpc';
const KEY_PATH = '/workspaces/casperguard/contract/keys/secret_key.pem';
const TARGET = '02038ccdd95411a19ba15d4784545a3e07dfa3afd2a839253472232991541ff55ada';

const handler = new HttpHandler(RPC);
const client = new RpcClient(handler);

const pem = readFileSync(KEY_PATH, 'utf8');
const privateKey = await PrivateKey.fromPem(pem, KeyAlgorithm.SECP256K1);
console.log('Key loaded:', privateKey.publicKey.toHex());

const status = await client.getStatus();
const apiVersion = status.api_version || '2.0.0';
console.log('API version:', apiVersion);

const tx = await makeCsprTransferTransaction({
  senderPublicKeyHex: privateKey.publicKey.toHex(),
  recipientPublicKeyHex: TARGET,
  transferAmount: '2500000000',
  chainName: 'casper-test',
  casperNetworkApiVersion: apiVersion
});

console.log('Signing...');
await tx.sign(privateKey);

console.log('Submitting...');
const result = await client.putTransaction(tx);
console.log('Result:', JSON.stringify(result));
