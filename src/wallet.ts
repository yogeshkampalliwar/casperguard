// Casper Wallet Integration

export interface WalletState {
  connected: boolean
  publicKey: string
  balance: number
}

export async function connectCasperWallet(): Promise<string> {
  try {
    // Try CasperDash
    if ((window as any).casperDashHelper) {
      await (window as any).casperDashHelper.requestConnection()
      const key = await (window as any).casperDashHelper.getActivePublicKey()
      return key
    }
    // Try Casper Wallet
    if ((window as any).CasperWalletProvider) {
      const provider = (window as any).CasperWalletProvider()
      await provider.requestConnection()
      const key = await provider.getActivePublicKey()
      return key
    }
    throw new Error('No wallet found')
  } catch (err) {
    throw new Error('Wallet connect failed: ' + err)
  }
}

export async function getWalletBalance(publicKey: string): Promise<number> {
  try {
    const r = await fetch('https://rpc.testnet.casperlabs.io', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'query_balance',
        params: { purse_identifier: { main_purse_under_public_key: publicKey } },
        id: 1
      })
    })
    const data = await r.json()
    return parseInt(data.result?.balance || '0') / 1_000_000_000
  } catch { return 0 }
}
