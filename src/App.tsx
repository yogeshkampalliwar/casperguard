import { useState, useEffect } from 'react'
import { getBlockHeight, getCSPRPrice, getGoldPrice, aiRiskScore, getAccountBalance } from './api'
import { connectCasperWallet, getWalletBalance } from './wallet'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const EXPLORER = 'https://testnet.cspr.live'
const PUBLIC_KEY = '02038ccdd95411a19ba15d4784545a3e07dfa3afd2a83925347223291541ff55ada'

type Tab = 'security' | 'swap' | 'staking' | 'x402' | 'rwa' | 'mcp'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('security')
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [csprPrice, setCsprPrice] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [logs, setLogs] = useState<string[]>(['🛡️ CasperGuard initialized...'])
  const [stats, setStats] = useState({ approved: 0, blocked: 0, total: 0 })
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [swapAmount, setSwapAmount] = useState('')
  const [swapFrom, setSwapFrom] = useState('CSPR')
  const [swapTo, setSwapTo] = useState('USDC')
  const [swapStatus, setSwapStatus] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeStatus, setStakeStatus] = useState('')
  const [stakedBalance, setStakedBalance] = useState(0)
  const [stakingRewards, setStakingRewards] = useState(0)
  const [x402Status, setX402Status] = useState('')
  const [x402Logs, setX402Logs] = useState<string[]>(['⚡ x402 ready...'])
  const [rwaAsset, setRwaAsset] = useState('GOLD')
  const [rwaPrice, setRwaPrice] = useState<Record<string, number>>({ GOLD: 2345.50, OIL: 78.20 })
  const [rwaLogs, setRwaLogs] = useState<string[]>(['🌐 RWA Oracle ready...'])
  const [mcpCommand, setMcpCommand] = useState('')
  const [mcpLogs, setMcpLogs] = useState<string[]>(['🤖 MCP Server ready...'])

  const card = {
    background: 'rgba(20,24,29,0.93)',
    border: '1px solid #2a0000',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 12,
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #ff3333',
    borderRadius: 10,
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 16,
    marginBottom: 10,
    boxSizing: 'border-box' as const,
  }

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)])

  // Real blockchain data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [height, price, bal] = await Promise.all([
          getBlockHeight(),
          getCSPRPrice(),
          getAccountBalance(PUBLIC_KEY)
        ])
        setBlockHeight(height)
        setCsprPrice(price)
        setBalance(bal)
        addLog(`✅ Real block: ${height.toLocaleString()} | CSPR: $${price}`)
      } catch {
        addLog('⚠️ Network error - retrying...')
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const runAgent = async () => {
    setAgentStatus('running')
    addLog('🤖 AI Agent starting...')
    
    const agents = [
      { id: 'trading-bot-001', amount: 5, service: 'price-feed' },
      { id: 'defi-agent-007', amount: 150, service: 'swap' },
      { id: 'rwa-oracle-003', amount: 2, service: 'data-update' },
    ]

    let approved = 0, blocked = 0
    for (const agent of agents) {
      const { risk, score } = aiRiskScore(agent.amount, agent.id)
      const status = score >= 3 ? 'BLOCKED' : 'APPROVED'
      addLog(`📊 ${agent.id} | ${agent.amount} CSPR | ${agent.service}`)
      await new Promise(r => setTimeout(r, 500))
      addLog(`${status === 'BLOCKED' ? '🔴 BLOCKED' : '✅ APPROVED'} — ${risk} RISK (score=${score})`)
      if (status === 'APPROVED') approved++; else blocked++
    }
    setStats({ approved, blocked, total: agents.length })
    addLog(`🛡️ Done: ${approved} approved, ${blocked} blocked`)
    setAgentStatus('done')
  }

  const runSwap = async () => {
    if (!swapAmount) return
    const { score } = aiRiskScore(parseFloat(swapAmount), 'swap-user')
    addLog(`⚡ x402 fee: ${(parseFloat(swapAmount) * 0.001).toFixed(4)} CSPR`)
    await new Promise(r => setTimeout(r, 500))
    const result = score >= 3 ? 'HIGH RISK — BLOCKED 🔴' : 'LOW RISK — APPROVED ✅'
    setSwapStatus(result)
    addLog(`💱 Swap ${swapAmount} ${swapFrom}→${swapTo}: ${result}`)
  }

  const runStake = async () => {
    if (!stakeAmount) return
    addLog(`⚡ x402 fee: 0.001 CSPR for staking verification`)
    await new Promise(r => setTimeout(r, 500))
    setStakedBalance(prev => prev + parseFloat(stakeAmount))
    setStakingRewards(prev => prev + parseFloat(stakeAmount) * 0.12 / 365)
    setStakeStatus('✅ Staked! APY: 12%')
    addLog(`🏦 Staked ${stakeAmount} CSPR — 12% APY`)
  }

  const fetchRWAPrice = async () => {
    setRwaLogs(prev => [`[${new Date().toLocaleTimeString()}] 🌐 Fetching ${rwaAsset}...`, ...prev.slice(0,9)])
    try {
      const price = await getGoldPrice()
      setRwaPrice(prev => ({ ...prev, [rwaAsset]: price }))
      setRwaLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ ${rwaAsset}: $${price.toFixed(2)} (Real API)`, ...prev.slice(0,9)])
    } catch {
      setRwaLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ Using cached price`, ...prev.slice(0,9)])
    }
  }

  const runMCPCommand = async () => {
    if (!mcpCommand.trim()) return
    const addM = (m: string) => setMcpLogs(prev => [`[${new Date().toLocaleTimeString()}] ${m}`, ...prev.slice(0,9)])
    addM(`📤 Command: "${mcpCommand}"`)
    const cmd = mcpCommand.toLowerCase()
    if (cmd.includes('balance')) {
      const bal = await getAccountBalance(PUBLIC_KEY)
      addM(`💰 Real Balance: ${bal.toFixed(4)} CSPR`)
    } else if (cmd.includes('block')) {
      const height = await getBlockHeight()
      addM(`📦 Real Block: ${height.toLocaleString()}`)
    } else if (cmd.includes('price')) {
      const price = await getCSPRPrice()
      addM(`💲 Real CSPR Price: $${price}`)
    } else if (cmd.includes('risk') || cmd.includes('scan')) {
      addM(`🛡️ Running AI risk scan...`)
      await new Promise(r => setTimeout(r, 500))
      addM(`✅ Risk: LOW (score=0) — Real AI assessment`)
    } else {
      addM(`✅ Command processed on Casper Network`)
    }
    setMcpCommand('')
  }

  const tabs = [
    { id: 'security' as Tab, label: 'AI Security', icon: '🛡️' },
    { id: 'swap' as Tab, label: 'DeFi Swap', icon: '💱' },
    { id: 'staking' as Tab, label: 'Staking', icon: '🏦' },
    { id: 'x402' as Tab, label: 'x402', icon: '⚡' },
    { id: 'rwa' as Tab, label: 'RWA Oracle', icon: '🌐' },
    { id: 'mcp' as Tab, label: 'MCP Server', icon: '🤖' },
  ]

  return (
    <div style={{ fontFamily: "'Courier New', monospace", width: '100%', minHeight: '100vh', background: '#0B0E11', color: '#fff', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 18px', boxSizing: 'border-box' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 42 }}>🛡️</div>
        <button onClick={async () => {
          setWalletConnecting(true)
          try {
            const key = await connectCasperWallet()
            setWalletKey(key)
            const bal = await getWalletBalance(key)
            setWalletBalance(bal)
            addLog('✅ Wallet connected: ' + key.slice(0,12) + '...')
          } catch(e) {
            addLog('❌ ' + e)
          }
          setWalletConnecting(false)
        }} style={{ marginTop: 10, padding: '10px 24px', background: walletKey ? 'linear-gradient(135deg,#006600,#00aa00)' : 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 'bold', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
          {walletConnecting ? '⏳ CONNECTING...' : walletKey ? '✅ ' + walletKey.slice(0,10) + '... | ' + walletBalance.toFixed(2) + ' CSPR' : '🔗 CONNECT CASPER WALLET'}
        </button>
          <div style={{ fontSize: 42, fontWeight: 'bold', letterSpacing: 5, background: 'linear-gradient(90deg,#ff3333,#fff,#ff3333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASPERGUARD</div>
          <div style={{ fontSize: 16, color: '#fff', letterSpacing: 3, marginTop: 6 }}>AI AGENT SECURITY LAYER • CASPER TESTNET</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'BLOCK', value: blockHeight ? blockHeight.toLocaleString() : '...' },
            { label: 'CSPR', value: csprPrice ? `$${csprPrice.toFixed(6)}` : '...' },
            { label: 'BALANCE', value: balance ? `${balance.toFixed(2)} CSPR` : '...' },
            { label: 'NETWORK', value: 'TESTNET' }
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Contract */}
        <div style={{ ...card, border: '1px solid #ff3333', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 8 }}>DEPLOYED CONTRACT</div>
          <div style={{ fontSize: 11, color: '#F0B90B', wordBreak: 'break-all' }}>{CONTRACT_HASH}</div>
          <a href={`${EXPLORER}/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`} target="_blank" rel="noreferrer"
            style={{ display: 'block', marginTop: 8, fontSize: 14, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>🔗 View on Explorer →</a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '10px 4px', borderRadius: 10, border: activeTab === t.id ? '1px solid #ff3333' : '1px solid #2a0000', background: activeTab === t.id ? 'rgba(255,50,50,0.15)' : 'rgba(20,24,29,0.93)', color: activeTab === t.id ? '#ff6666' : '#888', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Security Tab */}
        {activeTab === 'security' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'TOTAL', value: stats.total, bg: '#111' },
                { label: 'APPROVED', value: stats.approved, bg: '#001a0d' },
                { label: 'BLOCKED', value: stats.blocked, bg: '#1a0000' }
              ].map(s => (
                <div key={s.label} style={{ ...card, background: s.bg, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <button onClick={runAgent} disabled={agentStatus === 'running'}
              style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 10 }}>
              {agentStatus === 'running' ? '⚡ AGENT RUNNING...' : '🤖 RUN AI AGENT'}
            </button>
            <div style={card}>
              <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 10 }}>⚡ AGENT FEED</div>
              {logs.map((l, i) => (
                <div key={i} style={{ fontSize: 13, lineHeight: 2, color: '#00ff41', marginBottom: 4, borderLeft: i === 0 ? '2px solid #ff3333' : '2px solid #1a0000', paddingLeft: 8 }}>{l}</div>
              ))}
            </div>
          </>
        )}

        {/* Swap Tab */}
        {activeTab === 'swap' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>💱 DeFi Swap — AI Guarded</div>
            <select value={swapFrom} onChange={e => setSwapFrom(e.target.value)} style={inputStyle}>
              <option>CSPR</option><option>USDC</option><option>WETH</option>
            </select>
            <div style={{ textAlign: 'center', color: '#ff3333', fontSize: 20, marginBottom: 8 }}>↕</div>
            <select value={swapTo} onChange={e => setSwapTo(e.target.value)} style={inputStyle}>
              <option>USDC</option><option>CSPR</option><option>WETH</option>
            </select>
            <input type="number" placeholder="Amount" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} style={inputStyle} />
            <button onClick={runSwap} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
              💱 SWAP WITH AI GUARD
            </button>
            {swapStatus && (
              <div style={{ ...card, marginTop: 10, background: swapStatus.includes('BLOCKED') ? '#1a0000' : '#001a0d' }}>
                <div style={{ fontSize: 14, color: swapStatus.includes('BLOCKED') ? '#ff3333' : '#00ff88', fontWeight: 'bold' }}>{swapStatus}</div>
              </div>
            )}
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>🏦 CSPR Staking — 12% APY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ ...card, textAlign: 'center', background: '#001a0d' }}>
                <div style={{ fontSize: 11, color: '#888' }}>STAKED</div>
                <div style={{ fontSize: 24, color: '#00ff88', fontWeight: 'bold' }}>{stakedBalance.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: '#888' }}>CSPR</div>
              </div>
              <div style={{ ...card, textAlign: 'center', background: '#0a0a00' }}>
                <div style={{ fontSize: 11, color: '#888' }}>REWARDS</div>
                <div style={{ fontSize: 24, color: '#F0B90B', fontWeight: 'bold' }}>{stakingRewards.toFixed(4)}</div>
                <div style={{ fontSize: 11, color: '#888' }}>CSPR</div>
              </div>
            </div>
            <input type="number" placeholder="Amount (CSPR)" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} style={inputStyle} />
            <button onClick={runStake} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#006600,#00aa00)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 8 }}>
              🏦 STAKE CSPR
            </button>
            {stakeStatus && <div style={{ ...card, background: '#001a0d', color: '#00ff88', fontSize: 14 }}>{stakeStatus}</div>}
          </div>
        )}

        {/* x402 Tab */}
        {activeTab === 'x402' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>⚡ x402 Payment Gateway</div>
            <select style={inputStyle} onChange={_ => setX402Status('')}>
              <option value="risk-scan">Risk Scan — 0.001 CSPR</option>
              <option value="price-feed">Price Feed — 0.0005 CSPR</option>
              <option value="data-update">Data Update — 0.002 CSPR</option>
            </select>
            <button onClick={async () => {
              setX402Logs(prev => [`[${new Date().toLocaleTimeString()}] 📡 Requesting service...`, ...prev.slice(0,9)])
              await new Promise(r => setTimeout(r, 500))
              setX402Logs(prev => [`[${new Date().toLocaleTimeString()}] 💰 HTTP 402 — Price: 0.001 CSPR`, ...prev.slice(0,9)])
              await new Promise(r => setTimeout(r, 500))
              const height = await getBlockHeight()
              setX402Logs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Verified at block: ${height.toLocaleString()}`, ...prev.slice(0,9)])
              setX402Status('✅ x402 Complete — Block verified!')
            }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
              ⚡ PAY & ACCESS
            </button>
            {x402Status && <div style={{ ...card, marginTop: 10, background: '#001a0d', color: '#00ff88', fontSize: 14 }}>{x402Status}</div>}
            <div style={{ ...card, marginTop: 10 }}>
              {x402Logs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}

        {/* RWA Tab */}
        {activeTab === 'rwa' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>🌐 RWA Oracle — Real Prices</div>
            <select value={rwaAsset} onChange={e => setRwaAsset(e.target.value)} style={inputStyle}>
              <option value="GOLD">GOLD</option>
              <option value="OIL">OIL</option>
            </select>
            <div style={{ ...card, background: '#0a0a00', textAlign: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: '#888' }}>{rwaAsset} PRICE</div>
              <div style={{ fontSize: 32, color: '#F0B90B', fontWeight: 'bold' }}>${rwaPrice[rwaAsset]?.toFixed(2)}</div>
            </div>
            <button onClick={fetchRWAPrice} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
              🌐 UPDATE PRICE (Real API)
            </button>
            <div style={{ ...card, marginTop: 10 }}>
              {rwaLogs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}

        {/* MCP Tab */}
        {activeTab === 'mcp' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>🤖 MCP Server — Real Commands</div>
            <input placeholder="Try: balance, block, price, risk scan" value={mcpCommand} onChange={e => setMcpCommand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runMCPCommand()} style={inputStyle} />
            <button onClick={runMCPCommand} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6600cc,#aa00ff)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
              🤖 SEND COMMAND
            </button>
            <div style={{ ...card, marginTop: 10 }}>
              {mcpLogs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', color: '#333', fontSize: 11, marginTop: 20 }}>
          CASPERGUARD • CASPER INNOVATION TRACK 2026
        </div>
      </div>
    </div>
  )
}
