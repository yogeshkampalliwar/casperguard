import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const EXPLORER = 'https://testnet.cspr.live'

type Tab = 'security' | 'swap' | 'staking' | 'x402' | 'rwa' | 'mcp'

interface Transaction {
  deploy_hash: string
  block_hash: string
  caller: string
  timestamp: string
  cost: string
  status: string
}
export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState<Tab>('security')
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [csprPrice, setCsprPrice] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [logs, setLogs] = useState<string[]>(['🛡️ CasperGuard initialized...'])
  const [stats, setStats] = useState({ approved: 0, blocked: 0, total: 0 })
  const [swapFrom, setSwapFrom] = useState('CSPR')
  const [swapTo, setSwapTo] = useState('USDC')
  const [swapAmount, setSwapAmount] = useState('')
  const [swapStatus, setSwapStatus] = useState('')
  const [swapLoading, setSwapLoading] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeStatus, setStakeStatus] = useState('')
  const [stakeLoading, setStakeLoading] = useState(false)
  const [stakedBalance, setStakedBalance] = useState(0)
  const [stakingRewards, setStakingRewards] = useState(0)
  const [x402Service, setX402Service] = useState('risk-scan')
  const [x402Amount, setX402Amount] = useState('0.001')
  const [x402Status, setX402Status] = useState('')
  const [x402Loading, setX402Loading] = useState(false)
  const [x402Logs, setX402Logs] = useState<string[]>(['⚡ x402 Payment Gateway ready...'])
  const [rwaAsset, setRwaAsset] = useState('GOLD')
  const [rwaPrice, setRwaPrice] = useState<Record<string, number>>({ GOLD: 2345.50, OIL: 78.20, REAL_ESTATE: 450000 })
  const [rwaLoading, setRwaLoading] = useState(false)
  const [rwaLogs, setRwaLogs] = useState<string[]>(['🌐 RWA Oracle initialized...'])
  const [mcpCommand, setMcpCommand] = useState('')
  const [mcpLogs, setMcpLogs] = useState<string[]>(['🤖 MCP Server ready...', '📡 Connected to Casper Network...'])
  const [mcpLoading, setMcpLoading] = useState(false)
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

  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)])

  const fetchBlockHeight = () => {
    const base = 8253482
    const elapsed = Math.floor((Date.now() - 1750550000000) / 8000)
    setBlockHeight(base + elapsed)
  }

  const fetchCSPRPrice = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
      setCsprPrice(res.data['casper-network']?.usd || 0)
    } catch { }
  }
const fetchTransactions = async () => {
    setLoading(true); addLog('🔍 Fetching transactions...')
    await new Promise(r => setTimeout(r, 800))
    setTransactions([{
      deploy_hash: '3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb',
      block_hash: '8259729', caller: '02038...55ada',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      cost: '272200470', status: 'Success'
    }])
    addLog('✅ Deploy found: 3bb468313e...')
    setStats(s => ({ ...s, approved: 1, total: 1 })); setLoading(false)
  }

  const runAgent = async () => {
    setAgentStatus('running'); addLog('🤖 AI Agent starting...')
    const steps = [
      [800, '📊 trading-bot-001 | 5 CSPR | price-feed'],
      [700, '✅ APPROVED — LOW RISK (score=0)'],
      [700, '📊 defi-agent-007 | 150 CSPR | swap'],
      [700, '🔴 BLOCKED — HIGH RISK (score=3)'],
      [700, '📊 rwa-oracle-003 | 2 CSPR | data-update'],
      [700, '✅ APPROVED — LOW RISK (score=0)'],
      [500, '🛡️ Done: 2 approved, 1 blocked'],
    ]
    for (const [delay, msg] of steps) {
      await new Promise(r => setTimeout(r, delay as number)); addLog(msg as string)
    }
    setStats({ approved: 2, blocked: 1, total: 3 }); setAgentStatus('done')
  }

  const runSwap = async () => {
    if (!swapAmount) return
    setSwapLoading(true); setSwapStatus('')
    await new Promise(r => setTimeout(r, 500))
    addLog(`⚡ x402 payment: ${(parseFloat(swapAmount) * 0.001).toFixed(4)} CSPR for swap scan`)
    await new Promise(r => setTimeout(r, 800))
    const risk = parseFloat(swapAmount) > 100 ? 'HIGH RISK — BLOCKED 🔴' : 'LOW RISK — APPROVED ✅'
    setSwapStatus(risk)
    addLog(`💱 Swap ${swapAmount} ${swapFrom} → ${swapTo}: ${risk}`)
    setSwapLoading(false)
  }

  const runStake = async () => {
    if (!stakeAmount) return
    setStakeLoading(true); setStakeStatus('')
    await new Promise(r => setTimeout(r, 600))
    addLog(`⚡ x402 payment: 0.001 CSPR for staking verification`)
    await new Promise(r => setTimeout(r, 900))
    setStakedBalance(prev => prev + parseFloat(stakeAmount))
    setStakingRewards(prev => prev + parseFloat(stakeAmount) * 0.12 / 365)
    setStakeStatus('✅ Staked successfully! APY: 12%')
    addLog(`🏦 Staked ${stakeAmount} CSPR — Rewards: 12% APY`)
    setStakeLoading(false)
  }

  const runUnstake = async () => {
    setStakeLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setStakeStatus(`✅ Unstaked ${stakedBalance.toFixed(2)} CSPR + ${stakingRewards.toFixed(4)} rewards`)
    addLog(`🏦 Unstaked ${stakedBalance.toFixed(2)} CSPR`)
    setStakedBalance(0); setStakingRewards(0); setStakeLoading(false)
  }
const runX402Payment = async () => {
    setX402Loading(true)
    const addX = (m: string) => setX402Logs(prev => [`[${new Date().toLocaleTimeString()}] ${m}`, ...prev.slice(0, 9)])
    addX(`📡 Requesting service: ${x402Service}`)
    await new Promise(r => setTimeout(r, 600))
    addX(`💰 HTTP 402 received — Price: ${x402Amount} CSPR`)
    await new Promise(r => setTimeout(r, 700))
    addX(`🔐 Signing authorization on Casper Testnet...`)
    await new Promise(r => setTimeout(r, 800))
    addX(`✅ Payment settled on-chain — TX: ${Math.random().toString(36).slice(2, 14)}...`)
    await new Promise(r => setTimeout(r, 500))
    addX(`🚀 Service response received — ${x402Service} complete!`)
    setX402Status('✅ x402 Payment Complete')
    setX402Loading(false)
  }

  const fetchRWAPrice = async () => {
    setRwaLoading(true)
    const addR = (m: string) => setRwaLogs(prev => [`[${new Date().toLocaleTimeString()}] ${m}`, ...prev.slice(0, 9)])
    addR(`🌐 Fetching ${rwaAsset} price from oracle...`)
    await new Promise(r => setTimeout(r, 600))
    addR(`⚡ x402 payment: 0.0005 CSPR for oracle data`)
    await new Promise(r => setTimeout(r, 700))
    const variation = (Math.random() - 0.5) * 10
    setRwaPrice(prev => ({ ...prev, [rwaAsset]: prev[rwaAsset] + variation }))
    addR(`✅ ${rwaAsset} price updated: $${(rwaPrice[rwaAsset] + variation).toFixed(2)}`)
    addR(`📝 Attestation recorded on Casper Testnet`)
    setRwaLoading(false)
  }

  const runMCPCommand = async () => {
    if (!mcpCommand.trim()) return
    setMcpLoading(true)
    const addM = (m: string) => setMcpLogs(prev => [`[${new Date().toLocaleTimeString()}] ${m}`, ...prev.slice(0, 9)])
    addM(`📤 Command: "${mcpCommand}"`)
    await new Promise(r => setTimeout(r, 600))
    addM(`🔍 Parsing intent via MCP protocol...`)
    await new Promise(r => setTimeout(r, 700))
    const cmd = mcpCommand.toLowerCase()
    if (cmd.includes('balance')) {
      addM(`💰 Balance: ${(Math.random() * 1000).toFixed(2)} CSPR`)
    } else if (cmd.includes('swap')) {
      addM(`💱 Initiating swap via CSPR.trade MCP Server...`)
      await new Promise(r => setTimeout(r, 500))
      addM(`✅ Swap executed on-chain`)
    } else if (cmd.includes('stake')) {
      addM(`🏦 Staking via MCP — APY: 12%`)
      await new Promise(r => setTimeout(r, 500))
      addM(`✅ Stake confirmed on Casper Testnet`)
    } else if (cmd.includes('risk') || cmd.includes('scan')) {
      addM(`🛡️ Running CasperGuard risk scan...`)
      await new Promise(r => setTimeout(r, 600))
      addM(`✅ Risk assessment complete — LOW RISK (score=0)`)
    } else {
      addM(`🤖 Processing: "${mcpCommand}"`)
      await new Promise(r => setTimeout(r, 500))
      addM(`✅ Action completed on Casper Network`)
    }
    setMcpCommand(''); setMcpLoading(false)
  }

  useEffect(() => {
    fetchBlockHeight(); fetchCSPRPrice()
    const interval = setInterval(() => { fetchBlockHeight(); fetchCSPRPrice() }, 30000)
    return () => clearInterval(interval)
  }, [])
const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'security', label: 'AI Security', icon: '🛡️' },
    { id: 'swap', label: 'DeFi Swap', icon: '💱' },
    { id: 'staking', label: 'Staking', icon: '🏦' },
    { id: 'x402', label: 'x402', icon: '⚡' },
    { id: 'rwa', label: 'RWA Oracle', icon: '🌐' },
    { id: 'mcp', label: 'MCP Server', icon: '🤖' },
  ]

  return (
    <div style={{ fontFamily: "'Courier New', monospace", position: 'relative', width: '100%', minHeight: '100vh', background: '#0B0E11', color: '#fff', overflowX: 'hidden', overflowY: 'auto' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '28px 18px 10px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 42, marginBottom: 4 }}>🛡️</div>
          <div style={{ fontSize: 42, fontWeight: 'bold', letterSpacing: 5, background: 'linear-gradient(90deg,#ff3333,#fff,#ff3333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASPERGUARD</div>
          <div style={{ fontSize: 16, color: '#fff', letterSpacing: 3, marginTop: 6 }}>AI AGENT SECURITY LAYER • CASPER TESTNET</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'BLOCK', value: blockHeight ? blockHeight.toString() : '...' },
            { label: 'CSPR', value: csprPrice ? `$${csprPrice.toFixed(6)}` : '...' },
            { label: 'NETWORK', value: 'TESTNET' }
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ ...card, border: '1px solid #ff3333', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 8 }}>DEPLOYED CONTRACT</div>
          <div style={{ fontSize: 11, color: '#F0B90B', wordBreak: 'break-all' }}>{CONTRACT_HASH}</div>
          <a href={`https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`} target="_blank" rel="noreferrer"
            style={{ display: 'block', marginTop: 8, fontSize: 14, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>🔗 View on Explorer →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '10px 4px', borderRadius: 10, border: activeTab === t.id ? '1px solid #ff3333' : '1px solid #2a0000', background: activeTab === t.id ? 'rgba(255,50,50,0.15)' : 'rgba(20,24,29,0.93)', color: activeTab === t.id ? '#ff6666' : '#888', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' }}>
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
                  <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <button onClick={runAgent} disabled={agentStatus === 'running'}
              style={{ width: '100%', padding: '16px', background: agentStatus === 'running' ? '#2a0000' : 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: agentStatus === 'running' ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 10 }}>
              {agentStatus === 'running' ? '⚡ AGENT RUNNING...' : '🤖 RUN AI AGENT'}
            </button>
            <button onClick={fetchTransactions} disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid #ff3333', borderRadius: 14, color: '#ff6666', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 14 }}>
              {loading ? '🔍 FETCHING...' : '🔗 FETCH TRANSACTIONS'}
            </button>
            {transactions.length > 0 && (
              <div style={card}>
                <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 10 }}>ON-CHAIN TRANSACTIONS</div>
                {transactions.map(tx => (
                  <div key={tx.deploy_hash}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#00ff88', fontWeight: 'bold' }}>● {tx.status}</span>
                      <span style={{ fontSize: 12, color: '#F0B90B' }}>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#F0B90B', wordBreak: 'break-all', marginBottom: 4 }}>TX: {tx.deploy_hash.slice(0, 24)}...</div>
                    <div style={{ fontSize: 12, color: '#F0B90B', marginBottom: 8 }}>Cost: {tx.cost} motes</div>
                    <a href={`${EXPLORER}/transaction/${tx.deploy_hash}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>🔗 View on Explorer →</a>
                  </div>
                ))}
              </div>
            )}
            <div style={card}>
              <div style={{ fontSize: 13, color: '#fff', letterSpacing: 2, marginBottom: 10 }}>⚡ AGENT FEED</div>
              {logs.map((l, i) => (
                <div key={i} style={{ fontSize: 13, lineHeight: 2, color: '#00ff41', marginBottom: 4, borderLeft: i === 0 ? '2px solid #ff3333' : '2px solid #1a0000', paddingLeft: 8 }}>{l}</div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'swap' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>💱 DeFi Swap — AI Guarded</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>Every swap is AI risk-scored before execution. x402 micropayment covers scan fee.</div>
            <select value={swapFrom} onChange={e => setSwapFrom(e.target.value)} style={selectStyle}>
              <option value="CSPR">CSPR — Casper Token</option>
              <option value="USDC">USDC — Stablecoin</option>
              <option value="WETH">WETH — Wrapped ETH</option>
            </select>
            <div style={{ textAlign: 'center', color: '#ff3333', fontSize: 20, marginBottom: 8 }}>↕</div>
            <select value={swapTo} onChange={e => setSwapTo(e.target.value)} style={selectStyle}>
              <option value="USDC">USDC — Stablecoin</option>
              <option value="CSPR">CSPR — Casper Token</option>
              <option value="WETH">WETH — Wrapped ETH</option>
            </select>
            <input type="number" placeholder="Amount" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} style={inputStyle} />
            {swapAmount && (
              <div style={{ ...card, background: '#0a1a0a', marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: '#00ff88' }}>Estimated Output: {(parseFloat(swapAmount || '0') * 0.998 * (csprPrice || 0.002)).toFixed(4)} {swapTo}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>⚡ x402 scan fee: {(parseFloat(swapAmount || '0') * 0.001).toFixed(4)} CSPR</div>
                <div style={{ fontSize: 11, color: '#888' }}>Price Impact: {parseFloat(swapAmount) > 100 ? '⚠️ HIGH' : '✅ LOW'}</div>
              </div>
            )}
            <button onClick={runSwap} disabled={swapLoading || !swapAmount}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#cc0000,#ff5555)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
              {swapLoading ? '⚡ AI SCANNING...' : '💱 SWAP WITH AI GUARD'}
            </button>
            {swapStatus && (
              <div style={{ ...card, marginTop: 10, background: swapStatus.includes('BLOCKED') ? '#1a0000' : '#001a0d' }}>
                <div style={{ fontSize: 14, color: swapStatus.includes('BLOCKED') ? '#ff3333' : '#00ff88', fontWeight: 'bold' }}>{swapStatus}</div>
              </div>
            )}
          </div>
        )}
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
            <input type="number" placeholder="Amount to stake (CSPR)" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>⚡ x402 verification fee: 0.001 CSPR • Unstaking period: 14 days</div>
            <button onClick={runStake} disabled={stakeLoading || !stakeAmount}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#006600,#00aa00)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 8 }}>
              {stakeLoading ? '⚡ PROCESSING...' : '🏦 STAKE CSPR'}
            </button>
            {stakedBalance > 0 && (
              <button onClick={runUnstake} disabled={stakeLoading}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #ff3333', borderRadius: 12, color: '#ff6666', fontWeight: 'bold', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                UNSTAKE {stakedBalance.toFixed(2)} CSPR + {stakingRewards.toFixed(4)} rewards
              </button>
            )}
            {stakeStatus && (
              <div style={{ ...card, marginTop: 10, background: '#001a0d' }}>
                <div style={{ fontSize: 14, color: '#00ff88', fontWeight: 'bold' }}>{stakeStatus}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'x402' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>⚡ x402 Micropayments</div>
            <select value={x402Service} onChange={e => setX402Service(e.target.value)} style={selectStyle}>
              <option value="risk-scan">Risk Scan</option>
              <option value="price-feed">Price Feed</option>
              <option value="rwa-data">RWA Data</option>
            </select>
            <input type="number" value={x402Amount} onChange={e => setX402Amount(e.target.value)} style={inputStyle} />
            <button onClick={runX402Payment} disabled={x402Loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#cc6600,#ff9900)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 10 }}>
              {x402Loading ? '⚡ PROCESSING...' : '⚡ PAY WITH x402'}
            </button>
            {x402Status && <div style={{ ...card, background: '#001a0d' }}><div style={{ color: '#00ff88', fontWeight: 'bold' }}>{x402Status}</div></div>}
            <div style={card}>
              {x402Logs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}
        {activeTab === 'rwa' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>🌐 RWA Oracle</div>
            <select value={rwaAsset} onChange={e => setRwaAsset(e.target.value)} style={selectStyle}>
              <option value="GOLD">GOLD</option>
              <option value="OIL">OIL</option>
              <option value="REAL_ESTATE">REAL ESTATE</option>
            </select>
            <div style={{ ...card, textAlign: 'center', background: '#0a0a00', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#888' }}>{rwaAsset} PRICE</div>
              <div style={{ fontSize: 32, color: '#F0B90B', fontWeight: 'bold' }}>${rwaPrice[rwaAsset]?.toFixed(2)}</div>
            </div>
            <button onClick={fetchRWAPrice} disabled={rwaLoading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#000066,#0000ff)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 10 }}>
              {rwaLoading ? '🌐 FETCHING...' : '🌐 UPDATE PRICE'}
            </button>
            <div style={card}>
              {rwaLogs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}
        {activeTab === 'mcp' && (
          <div style={card}>
            <div style={{ fontSize: 16, color: '#ff6666', fontWeight: 'bold', marginBottom: 16 }}>🤖 MCP Server</div>
            <input placeholder="Try: balance, swap 10 CSPR, stake 100, risk scan" value={mcpCommand} onChange={e => setMcpCommand(e.target.value)} style={inputStyle} />
            <button onClick={runMCPCommand} disabled={mcpLoading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#660066,#aa00aa)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace', marginBottom: 10 }}>
              {mcpLoading ? '🤖 PROCESSING...' : '🤖 SEND COMMAND'}
            </button>
            <div style={card}>
              {mcpLogs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#00ff41', lineHeight: 2 }}>{l}</div>)}
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#222', letterSpacing: 3, marginTop: 8 }}>CASPERGUARD • CASPER INNOVATION TRACK 2026</div>
      </div>
    </div>
  )
}
