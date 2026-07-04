import { useState, useEffect } from 'react'
import { getBlockHeight, getCSPRPrice, aiRiskScore } from './api'
import { ethers } from 'ethers'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const EXPLORER = 'https://testnet.cspr.live'
const GITPAID_ADDRESS = '0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809'
const GITPAID_ABI = [
  "function createBounty(string memory issueUrl) external payable",
  "function payDeveloper(uint256 bountyId, address developer) external",
  "function bounties(uint256) external view returns (address owner, uint256 amount, bool paid, string issueUrl)",
  "function bountyCount() external view returns (uint256)"
]

type Tab = 'security' | 'gitpaid'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('security')
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [csprPrice, setCsprPrice] = useState<number>(0)
  const [logs, setLogs] = useState<string[]>(['CasperGuard initialized...'])
  const [stats, setStats] = useState({ approved: 0, blocked: 0, total: 0 })
  const [x402Payments, setX402Payments] = useState<{time: string, amount: string, agent: string}[]>([])
  const [totalEarned, setTotalEarned] = useState(0)
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle')

  const [account, setAccount] = useState('')
  const [bounties, setBounties] = useState<any[]>([])
  const [issueUrl, setIssueUrl] = useState('')
  const [amount, setAmount] = useState('')
  const [devAddress, setDevAddress] = useState('')
  const [gpStatus, setGpStatus] = useState('')
  const [gpLoading, setGpLoading] = useState(false)

  const card: React.CSSProperties = {
    background: 'rgba(20,24,29,0.93)',
    border: '1px solid #2a0000',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 12,
  }

  const input: React.CSSProperties = {
    width: '100%',
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #ff3333',
    borderRadius: 10,
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 10,
    boxSizing: 'border-box'
  }

  const addLog = (msg: string) => setLogs(prev => ['[' + new Date().toLocaleTimeString() + '] ' + msg, ...prev.slice(0, 9)])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [height, price] = await Promise.all([getBlockHeight(), getCSPRPrice()])
        setBlockHeight(height)
        setCsprPrice(price)
        addLog('Block: ' + height.toLocaleString() + ' | CSPR: $' + price)
      } catch {
        addLog('Retrying...')
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const runAgent = async () => {
    setAgentStatus('running')
    addLog('AI Agent starting...')
    const agents = [
      { id: 'trading-bot-001', amount: 5, service: 'price-feed' },
      { id: 'defi-agent-007', amount: 150, service: 'swap' },
      { id: 'rwa-oracle-003', amount: 2, service: 'data-update' },
    ]
    let approved = 0, blocked = 0
    for (const agent of agents) {
      const { risk, score } = aiRiskScore(agent.amount, agent.id)
      const status = score >= 3 ? 'BLOCKED' : 'APPROVED'
      addLog(agent.id + ' | ' + agent.amount + ' CSPR | ' + agent.service)
      await new Promise(r => setTimeout(r, 600))
      addLog(status + ' - ' + risk + ' RISK (score=' + score + ')')
      if (status === 'APPROVED') approved++; else blocked++
    }
    setStats({ approved, blocked, total: agents.length })
    addLog('Done: ' + approved + ' approved, ' + blocked + ' blocked')
    setX402Payments([
      { time: new Date().toLocaleTimeString(), amount: '0.001 ETH', agent: 'trading-bot-001' },
      { time: new Date().toLocaleTimeString(), amount: '0.001 ETH', agent: 'rwa-oracle-003' },
    ])
    setTotalEarned(0.002)
    setAgentStatus('done')
  }

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      setAccount(accounts[0])
      setGpStatus('Wallet connected!')
      loadBounties(provider)
    } catch {
      setGpStatus('Wallet connection failed')
    }
  }

  const loadBounties = async (provider: any) => {
    try {
      const contract = new ethers.Contract(GITPAID_ADDRESS, GITPAID_ABI, provider)
      const count = await contract.bountyCount()
      const list = []
      for (let i = 0; i < Number(count); i++) {
        const b = await contract.bounties(i)
        list.push({ id: i, owner: b.owner, amount: ethers.formatEther(b.amount), paid: b.paid, issueUrl: b.issueUrl })
      }
      setBounties(list)
    } catch { }
  }

  const createBounty = async () => {
    if (!issueUrl || !amount) return
    setGpLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(GITPAID_ADDRESS, GITPAID_ABI, signer)
      const tx = await contract.createBounty(issueUrl, { value: ethers.parseEther(amount) })
      setGpStatus('Pending...')
      await tx.wait()
      setGpStatus('Bounty created! TX: ' + tx.hash.slice(0, 12) + '...')
      setIssueUrl(''); setAmount('')
      loadBounties(new ethers.BrowserProvider((window as any).ethereum))
    } catch (e: any) {
      setGpStatus('Error: ' + e.message)
    }
    setGpLoading(false)
  }

  const payDeveloper = async (bountyId: number) => {
    if (!devAddress) return
    setGpLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(GITPAID_ADDRESS, GITPAID_ABI, signer)
      const tx = await contract.payDeveloper(bountyId, devAddress)
      await tx.wait()
      setGpStatus('Developer paid! TX: ' + tx.hash.slice(0, 12) + '...')
      loadBounties(provider)
    } catch (e: any) {
      setGpStatus('Error: ' + e.message)
    }
    setGpLoading(false)
  }

  const tabs = [
    { id: 'security' as Tab, label: 'AI Security', icon: '🛡️' },
    { id: 'gitpaid' as Tab, label: 'GitPaid', icon: '💰' },
  ]

  return (
    <div style={{ fontFamily: "'Courier New', monospace", width: '100%', minHeight: '100vh', background: '#0B0E11', color: '#fff' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 18px', boxSizing: 'border-box' as const }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>🛡️</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', letterSpacing: 5, background: 'linear-gradient(90deg,#ff3333,#fff,#ff3333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASPERGUARD</div>
          <div style={{ fontSize: 13, color: '#aaa', letterSpacing: 3, marginTop: 6 }}>AI AGENT SECURITY LAYER + GITPAID • CASPER TESTNET</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'LIVE BLOCK', value: blockHeight ? blockHeight.toLocaleString() : '...' },
            { label: 'CSPR PRICE', value: csprPrice ? '$' + csprPrice.toFixed(6) : '...' },
            { label: 'NETWORK', value: 'TESTNET' }
          ].map(s => (
            <div key={s.label} style={{ ...card, textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 10, color: '#888', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, border: '1px solid #ff3333', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, marginBottom: 8 }}>DEPLOYED CONTRACT</div>
          <div style={{ fontSize: 10, color: '#F0B90B', wordBreak: 'break-all' }}>{CONTRACT_HASH}</div>
          <a href={EXPLORER + '/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'} target='_blank' rel='noreferrer'
            style={{ display: 'block', marginTop: 8, fontSize: 13, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>View on Explorer</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '12px', borderRadius: 10, border: activeTab === t.id ? '1px solid #ff3333' : '1px solid #2a0000', background: activeTab === t.id ? 'rgba(255,50,50,0.15)' : 'rgba(20,24,29,0.93)', color: activeTab === t.id ? '#ff6666' : '#888', cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'security' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'TOTAL', value: stats.total, bg: '#111' },
                { label: 'APPROVED', value: stats.approved, bg: '#001a0d' },
                { label: 'BLOCKED', value: stats.blocked, bg: '#1a0000' }
              ].map(s => (
                <div key={s.label} style={{ ...card, background: s.bg, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 36, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <button onClick={runAgent} disabled={agentStatus === 'running'}
              style={{ width: '100%', padding: '18px', background: agentStatus === 'running' ? '#2a0000' : 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 'bold', fontSize: 18, cursor: agentStatus === 'running' ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12 }}>
              {agentStatus === 'running' ? 'SCANNING...' : 'RUN AI AGENT'}
            </button>
            <div style={card}>
              <div style={{ fontSize: 12, color: '#fff', letterSpacing: 2, marginBottom: 10 }}>AGENT FEED - LIVE</div>
              {logs.map((l, i) => (
                <div key={i} style={{ fontSize: 12, lineHeight: 2, color: '#00ff41', borderLeft: i === 0 ? '2px solid #ff3333' : '2px solid #1a0000', paddingLeft: 8, marginBottom: 4 }}>{l}</div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'gitpaid' && (
          <>
            <div style={{ ...card, background: '#0a0a1a', border: '1px solid #4488ff', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#4488ff', marginBottom: 4 }}>GitPaid Contract (Base Sepolia)</div>
              <div style={{ fontSize: 10, color: '#888', wordBreak: 'break-all' }}>{GITPAID_ADDRESS}</div>
            </div>

            {!account ? (
              <button onClick={connectWallet}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00cc66,#00ff88)', border: 'none', borderRadius: 12, color: '#000', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 12 }}>
                Connect MetaMask
              </button>
            ) : (
              <div style={{ ...card, background: '#0a1a0a', border: '1px solid #00ff88', marginBottom: 12 }}>
                <div style={{ color: '#00ff88', fontSize: 13 }}>Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
              </div>
            )}

            <div style={card}>
              <div style={{ fontSize: 14, color: '#00ff88', fontWeight: 'bold', marginBottom: 12 }}>Create Bounty</div>
              <input type="text" placeholder="GitHub Issue URL" value={issueUrl} onChange={e => setIssueUrl(e.target.value)} style={input} />
              <input type="number" placeholder="Amount in ETH" value={amount} onChange={e => setAmount(e.target.value)} style={input} />
              <button onClick={createBounty} disabled={gpLoading || !account}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00cc66,#00ff88)', border: 'none', borderRadius: 12, color: '#000', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
                {gpLoading ? 'Processing...' : 'Create Bounty'}
              </button>
            </div>

            {gpStatus && (
              <div style={{ ...card, background: gpStatus.includes('Error') ? '#1a0000' : '#0a1a0a', border: '1px solid #00ff88' }}>
                <div style={{ fontSize: 13, color: gpStatus.includes('Error') ? '#ff3333' : '#00ff88' }}>{gpStatus}</div>
              </div>
            )}

            <div style={card}>
              <div style={{ fontSize: 14, color: '#00ff88', fontWeight: 'bold', marginBottom: 12 }}>Active Bounties</div>
              <input type="text" placeholder="Developer wallet address" value={devAddress} onChange={e => setDevAddress(e.target.value)} style={input} />
              {bounties.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>No bounties yet</div>
              ) : (
                bounties.map(b => (
                  <div key={b.id} style={{ ...card, background: b.paid ? '#0a0a0a' : '#0a1a0a', border: '1px solid #00ff88' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: b.paid ? '#666' : '#00ff88' }}>{b.paid ? 'PAID' : 'OPEN'}</span>
                      <span style={{ color: '#F0B90B' }}>{b.amount} ETH</span>
                    </div>
                    <a href={b.issueUrl} target="_blank" rel="noreferrer" style={{ color: '#4488ff', fontSize: 12 }}>{b.issueUrl}</a>
                    {!b.paid && account === b.owner && (
                      <button onClick={() => payDeveloper(b.id)}
                        style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#00cc66,#00ff88)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 'bold', fontSize: 13, cursor: 'pointer', fontFamily: 'monospace', marginTop: 10 }}>
                        Pay Developer
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* x402 Payments */}
        <div style={{ background: 'rgba(20,15,0,0.95)', border: '1px solid #F0B90B', borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#F0B90B', letterSpacing: 2, marginBottom: 8 }}>⚡ X402 MICROPAYMENTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div style={{ background: '#1a1400', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#F0B90B', letterSpacing: 2 }}>TOTAL EARNED</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F0B90B' }}>{totalEarned.toFixed(3)} ETH</div>
            </div>
            <div style={{ background: '#1a1400', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#F0B90B', letterSpacing: 2 }}>PER SCAN</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F0B90B' }}>0.001 ETH</div>
            </div>
          </div>
          {x402Payments.length === 0 && <div style={{ fontSize: 13, color: '#555', textAlign: 'center' }}>Run AI Agent to see payments</div>}
          {x402Payments.map((p, i) => (
            <div key={i} style={{ fontSize: 13, color: '#F0B90B', borderLeft: '2px solid #F0B90B', paddingLeft: 8, marginBottom: 6 }}>[{p.time}] ⚡ {p.agent} → {p.amount}</div>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: 10, color: '#333', marginTop: 12, letterSpacing: 3 }}>
          CASPERGUARD + GITPAID • CASPER & BASE NETWORK 2026
        </div>
      </div>
    </div>
  )
}
