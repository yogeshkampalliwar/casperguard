# CasperGuard Setup Guide

## Step 1: Create Casper Wallet
1. Go to https://testnet.cspr.live
2. Click "Create Account"
3. Download secret_key.pem

## Step 2: Get Free CSPR
1. Go to https://testnet.cspr.live/tools/faucet
2. Paste your public key
3. Click "Request tokens" — get 1000 CSPR free

## Step 3: Clone & Install
```bash
git clone https://github.com/yogeshkampalliwar/casperguard
cd casperguard
npm install
```

## Step 4: Add Your Key
```bash
cp /path/to/secret_key.pem contract/keys/secret_key.pem
```

## Step 5: Deploy Contract
```bash
node deploy.mjs
```

## Step 6: Run App
```bash
node server.cjs &
npm run dev
```
