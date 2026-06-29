import { useState } from 'react'
import { ethers } from 'ethers'

const CONTRACT_ABI = [
  "function createBounty(string memory issueUrl) external payable",
  "function payDeveloper(uint256 bountyId, address developer) external",
  "function bounties(uint256) external view returns (address owner, uint256 amount, bool paid, string issueUrl)",
  "function bountyCount() external view returns (uint256)"
]

const CONTRACT_ADDRESS = "0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809"

interface Bounty {
  id: number
  owner: string
  amount: string
  paid: boolean
  issueUrl: string
}

export default function App() {
  const [account, setAccount] = useState('')
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [issueUrl, setIssueUrl] = useState('')
  const [amount, setAmount] = useState('')
  const [devAddress, setDevAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setAccount(accounts[0])
      setStatus('Wallet connected!')
      loadBounties(provider)
    } catch {
      setStatus('Wallet connection failed')
    }
  }

  const loadBounties = async (provider: any) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const count = await contract.bountyCount()
      const list: Bounty[] = []
      for (let i = 0; i < Number(count); i++) {
        const b = await contract.bounties(i)
        list.push({ id: i, owner: b.owner, amount: ethers.formatEther(b.amount), paid: b.paid, issueUrl: b.issueUrl })
      }
      setBounties(list)
    } catch { }
  }

  const createBounty = async () => {
    if (!issueUrl || !amount) return
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.createBounty(issueUrl, { value: ethers.parseEther(amount) })
      setStatus('Transaction pending...')
      await tx.wait()
      setStatus('Bounty created! TX: ' + tx.hash.slice(0,12) + '...')
      setIssueUrl('')
      setAmount('')
      loadBounties(provider)
    } catch (e: any) {
      setStatus('Error: ' + e.message)
    }
    setLoading(false)
  }

  const payDeveloper = async (bountyId: number) => {
    if (!devAddress) return
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.payDeveloper(bountyId, devAddress)
      setStatus('Paying developer...')
      await tx.wait()
      setStatus('Developer paid! TX: ' + tx.hash.slice(0,12) + '...')
      loadBounties(provider)
    } catch (e: any) {
      setStatus('Error: ' + e.message)
    }
    setLoading(false)
  }

  const card: React.CSSProperties = { background: '#1a1a2e', border: '1px solid #333', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input: React.CSSProperties = { width: '100%', padding: 12, background: '#0d0d1a', border: '1px solid #444', borderRadius: 8, color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }
  const btn: React.CSSProperties = { width: '100%', padding: 14, background: 'linear-gradient(135deg,#00cc66,#00ff88)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0d0d1a', minHeight: '100vh', color: '#fff', padding: 20 }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>💰</div>
          <h1 style={{ fontSize: 36, fontWeight: 'bold', color: '#00ff88', margin: '8px 0' }}>GitPaid</h1>
          <p style={{ color: '#888' }}>Pay developers automatically for GitHub contributions via smart contract</p>
        </div>

        {!account ? (
          <div style={{ ...card, textAlign: 'center' }}>
            <p style={{ color: '#888', marginBottom: 16 }}>Connect wallet to get started</p>
            <button onClick={connectWallet} style={btn}>Connect MetaMask</button>
          </div>
        ) : (
          <div style={{ ...card, background: '#0a1a0a', border: '1px solid #00ff88' }}>
            <div style={{ color: '#00ff88' }}>Connected: {account.slice(0,6)}...{account.slice(-4)}</div>
          </div>
        )}

        <div style={card}>
          <h2 style={{ color: '#00ff88', marginBottom: 16 }}>Create Bounty</h2>
          <input type="text" placeholder="GitHub Issue URL" value={issueUrl} onChange={e => setIssueUrl(e.target.value)} style={input} />
          <input type="number" placeholder="Amount in ETH" value={amount} onChange={e => setAmount(e.target.value)} style={input} />
          <button onClick={createBounty} disabled={loading || !account} style={{ ...btn, background: loading ? '#333' : 'linear-gradient(135deg,#00cc66,#00ff88)', color: loading ? '#fff' : '#000' }}>
            {loading ? 'Processing...' : 'Create Bounty'}
          </button>
        </div>

        {status && (
          <div style={{ ...card, background: status.includes('Error') ? '#1a0000' : '#0a1a0a', border: '1px solid #00ff88' }}>
            {status}
          </div>
        )}

        <div style={card}>
          <h2 style={{ color: '#00ff88', marginBottom: 16 }}>Active Bounties</h2>
          <input type="text" placeholder="Developer wallet address (to pay)" value={devAddress} onChange={e => setDevAddress(e.target.value)} style={input} />
          {bounties.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>No bounties yet</div>
          ) : (
            bounties.map(b => (
              <div key={b.id} style={{ ...card, background: b.paid ? '#0a0a0a' : '#0a1a0a', border: '1px solid #00ff88' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: b.paid ? '#666' : '#00ff88' }}>{b.paid ? 'PAID' : 'OPEN'}</span>
                  <span style={{ color: '#F0B90B' }}>{b.amount} ETH</span>
                </div>
                <a href={b.issueUrl} target="_blank" rel="noreferrer" style={{ color: '#4488ff', fontSize: 13 }}>{b.issueUrl}</a>
                {!b.paid && account === b.owner && (
                  <button onClick={() => payDeveloper(b.id)} style={{ ...btn, marginTop: 10, fontSize: 13, padding: 10 }}>
                    Pay Developer
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 20 }}>
          GitPaid — ETHGlobal Lisbon 2026
        </div>
      </div>
    </div>
  )
}
