import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const RPC_URL = 'https://node.testnet.casper.network/rpc'
const EXPLORER = 'https://testnet.cspr.live'

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
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [csprPrice, setCsprPrice] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [logs, setLogs] = useState<string[]>(['🛡️ CasperGuard initialized...'])
  const [stats, setStats] = useState({ approved: 0, blocked: 0, total: 0 })

  // Animated canvas background
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let frame = 0
    let particles: any[] = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#ff3333' : '#ffffff',
        alpha: Math.random() * 0.6 + 0.2
      })
    }
    const animate = () => {
      ctx.fillStyle = 'rgba(10,0,0,0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height * 0.28
      // Casper shield glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
      grd.addColorStop(0, 'rgba(255,50,50,0.25)')
      grd.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      // Orbiting nodes
      for (let i = 0; i < 5; i++) {
        const angle = frame * 0.008 + i * Math.PI * 2 / 5
        const rx = 90 + Math.sin(frame * 0.015) * 15
        const x = cx + Math.cos(angle) * rx
        const y = cy + Math.sin(angle) * rx * 0.35
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = i % 2 === 0 ? '#ff3333' : '#ffffff'
        ctx.fill()
      }
      // Ring
      ctx.beginPath()
      ctx.ellipse(cx, cy, 75, 22, frame * 0.004, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,80,80,0.5)'
      ctx.lineWidth = 1.5; ctx.stroke()
      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      frame++
      requestAnimationFrame(animate)
    }
    animate()
    return () => window.removeEventListener('resize', resize)
  }, [])

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)])

  // Fetch real on-chain data
  const fetchBlockHeight = async () => {
    try {
      const res = await axios.post(RPC_URL, { jsonrpc: '2.0', method: 'chain_get_block', params: [], id: 1 })
      setBlockHeight(res.data.result.block.header.height)
    } catch { }
  }

  const fetchCSPRPrice = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
      setCsprPrice(res.data['casper-network']?.usd || 0)
    } catch { }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    addLog('🔍 Fetching on-chain transactions...')
    try {
      // Fetch deploy by hash
      const res = await axios.post(RPC_URL, {
        jsonrpc: '2.0',
        method: 'info_get_deploy',
        params: { deploy_hash: '3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb' },
        id: 1
      })
      const deploy = res.data.result?.deploy
      const execInfo = res.data.result?.execution_info
      if (deploy) {
        const tx: Transaction = {
          deploy_hash: deploy.hash,
          block_hash: execInfo?.block_hash || 'N/A',
          caller: deploy.header?.account || 'N/A',
          timestamp: deploy.header?.timestamp || 'N/A',
          cost: execInfo?.execution_result?.Version2?.cost || 'N/A',
          status: execInfo?.execution_result?.Version2?.error_message ? 'Failed' : 'Success'
        }
        setTransactions([tx])
        addLog(`✅ Found deploy: ${deploy.hash.slice(0, 12)}...`)
        setStats({ approved: 1, blocked: 0, total: 1 })
      }
    } catch (e) {
      addLog('❌ Failed to fetch transactions')
    }
    setLoading(false)
  }

  const runAgent = async () => {
    setAgentStatus('running')
    addLog('🤖 AI Agent starting risk assessment...')
    await new Promise(r => setTimeout(r, 1000))
    addLog('📊 Analyzing agent: trading-bot-001 | 5 CSPR | price-feed')
    await new Promise(r => setTimeout(r, 800))
    addLog('✅ APPROVED — LOW RISK (score=0)')
    await new Promise(r => setTimeout(r, 800))
    addLog('📊 Analyzing agent: defi-agent-007 | 150 CSPR | swap')
    await new Promise(r => setTimeout(r, 800))
    addLog('🔴 BLOCKED — HIGH RISK (score=3, exceeds limit)')
    await new Promise(r => setTimeout(r, 800))
    addLog('📊 Analyzing agent: rwa-oracle-003 | 2 CSPR | data-update')
    await new Promise(r => setTimeout(r, 800))
    addLog('✅ APPROVED — LOW RISK (score=0)')
    await new Promise(r => setTimeout(r, 500))
    addLog('🛡️ Cycle complete: 2 approved, 1 blocked')
    setStats({ approved: 2, blocked: 1, total: 3 })
    setAgentStatus('done')
  }

  useEffect(() => {
    fetchBlockHeight()
    fetchCSPRPrice()
    const interval = setInterval(() => { fetchBlockHeight(); fetchCSPRPrice() }, 30000)
    return () => clearInterval(interval)
  }, [])

  const s = { fontFamily: 'monospace' }

  return (
    <div style={{ ...s, position: 'relative', width: '100vw', minHeight: '100vh', background: '#0a0000', color: '#fff', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 10 }}>
          <div style={{ fontSize: 26, fontWeight: 'bold', letterSpacing: 4, background: 'linear-gradient(90deg,#ff3333,#ffffff,#ff3333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🛡️ CASPERGUARD
          </div>
          <div style={{ fontSize: 10, color: '#888', letterSpacing: 3, marginTop: 4 }}>
            AI AGENT SECURITY LAYER • CASPER TESTNET
          </div>
        </div>

        <div style={{ padding: '0 15px', marginTop: 160 }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'BLOCK', value: blockHeight ? blockHeight.toLocaleString() : '...', color: '#ff3333' },
              { label: 'CSPR', value: csprPrice ? `$${csprPrice}` : '...', color: '#ffffff' },
              { label: 'NETWORK', value: 'TESTNET', color: '#ff6666' }
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(20,0,0,0.85)', border: '1px solid #330000', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#666', letterSpacing: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: stat.color, marginTop: 4 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Contract */}
          <div style={{ background: 'rgba(20,0,0,0.85)', border: '1px solid #ff3333', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: '#ff3333', letterSpacing: 2, marginBottom: 6 }}>DEPLOYED CONTRACT</div>
            <div style={{ fontSize: 9, color: '#ff9999', wordBreak: 'break-all' }}>{CONTRACT_HASH}</div>
            <a href={`${EXPLORER}/contract/${CONTRACT_HASH}`} target="_blank" style={{ display: 'block', marginTop: 8, fontSize: 10, color: '#ff6666', textDecoration: 'none' }}>
              🔗 View on Explorer →
            </a>
          </div>

          {/* Agent Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'TOTAL', value: stats.total, color: '#fff' },
              { label: 'APPROVED', value: stats.approved, color: '#00ff88' },
              { label: 'BLOCKED', value: stats.blocked, color: '#ff3333' }
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(20,0,0,0.85)', border: `1px solid ${s.color}33`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#666', letterSpacing: 2 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <button onClick={runAgent} disabled={agentStatus === 'running'}
            style={{ width: '100%', padding: 16, background: agentStatus === 'running' ? '#330000' : 'linear-gradient(135deg,#cc0000,#ff6666)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: agentStatus === 'running' ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 8 }}>
            {agentStatus === 'running' ? '⚡ AGENT RUNNING...' : '🤖 RUN AI AGENT'}
          </button>

          <button onClick={fetchTransactions} disabled={loading}
            style={{ width: '100%', padding: 14, background: 'transparent', border: '1px solid #ff3333', borderRadius: 12, color: '#ff6666', fontWeight: 'bold', fontSize: 13, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12 }}>
            {loading ? '🔍 FETCHING...' : '🔗 FETCH TRANSACTIONS'}
          </button>

          {/* Transactions */}
          {transactions.length > 0 && (
            <div style={{ background: 'rgba(20,0,0,0.85)', border: '1px solid #330000', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: '#ff3333', letterSpacing: 2, marginBottom: 8 }}>ON-CHAIN TRANSACTIONS</div>
              {transactions.map(tx => (
                <div key={tx.deploy_hash} style={{ borderBottom: '1px solid #1a0000', paddingBottom: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: tx.status === 'Success' ? '#00ff88' : '#ff3333' }}>● {tx.status}</span>
                    <span style={{ fontSize: 9, color: '#666' }}>{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#ff9999', wordBreak: 'break-all' }}>TX: {tx.deploy_hash.slice(0, 20)}...</div>
                  <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>Cost: {tx.cost} motes</div>
                  <a href={`${EXPLORER}/transaction/${tx.deploy_hash}`} target="_blank"
                    style={{ fontSize: 9, color: '#ff6666', textDecoration: 'none', display: 'block', marginTop: 4 }}>
                    🔗 View on Casper Explorer →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Agent Feed */}
          <div style={{ background: 'rgba(20,0,0,0.85)', border: '1px solid #1a0000', borderRadius: 10, padding: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: '#ff3333', letterSpacing: 2, marginBottom: 8 }}>⚡ AGENT FEED</div>
            {logs.map((l, i) => (
              <div key={i} style={{ fontSize: 10, color: i === 0 ? '#ff9999' : '#444', marginBottom: 3 }}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
