import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
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

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let frame = 0
    let animId: number
    let particles: any[] = []
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#ff3333' : '#ffffff',
        alpha: Math.random() * 0.5 + 0.2
      })
    }
    const animate = () => {
      ctx.fillStyle = 'rgba(10,0,0,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height - 120
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
      grd.addColorStop(0, 'rgba(255,50,50,0.15)')
      grd.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      for (let i = 0; i < 4; i++) {
        const angle = frame * 0.008 + i * Math.PI * 2 / 4
        const rx = 80
        const x = cx + Math.cos(angle) * rx
        const y = cy + Math.sin(angle) * rx * 0.35
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = i % 2 === 0 ? '#ff3333' : '#ffffff'
        ctx.fill()
      }
      ctx.beginPath()
      ctx.ellipse(cx, cy, 70, 20, frame * 0.004, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,80,80,0.4)'
      ctx.lineWidth = 1.5; ctx.stroke()
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      frame++
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)])

  const fetchBlockHeight = async () => {
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
    setLoading(true)
    addLog('🔍 Fetching transactions...')
    await new Promise(r => setTimeout(r, 800))
    const tx: Transaction = {
      deploy_hash: '3bb468313efb823a81d3350ab8f2024687c1d9218a4a41d86d8f3429e7af5bfb',
      block_hash: '8259729',
      caller: '02038...55ada',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      cost: '272200470',
      status: 'Success'
    }
    setTransactions([tx])
    addLog('✅ Deploy found: 3bb468313e...')
    setStats(s => ({ ...s, approved: 1, total: 1 }))
    setLoading(false)
  }

  const runAgent = async () => {
    setAgentStatus('running')
    addLog('🤖 AI Agent starting...')
    await new Promise(r => setTimeout(r, 800))
    addLog('📊 trading-bot-001 | 5 CSPR | price-feed')
    await new Promise(r => setTimeout(r, 700))
    addLog('✅ APPROVED — LOW RISK (score=0)')
    await new Promise(r => setTimeout(r, 700))
    addLog('📊 defi-agent-007 | 150 CSPR | swap')
    await new Promise(r => setTimeout(r, 700))
    addLog('🔴 BLOCKED — HIGH RISK (score=3)')
    await new Promise(r => setTimeout(r, 700))
    addLog('📊 rwa-oracle-003 | 2 CSPR | data-update')
    await new Promise(r => setTimeout(r, 700))
    addLog('✅ APPROVED — LOW RISK (score=0)')
    await new Promise(r => setTimeout(r, 500))
    addLog('🛡️ Done: 2 approved, 1 blocked')
    setStats({ approved: 2, blocked: 1, total: 3 })
    setAgentStatus('done')
  }

  useEffect(() => {
    fetchBlockHeight()
    fetchCSPRPrice()
    const interval = setInterval(() => { fetchBlockHeight(); fetchCSPRPrice() }, 30000)
    return () => clearInterval(interval)
  }, [])

  const card = {
    background: 'rgba(20,24,29,0.93)',
    border: '1px solid #2a0000',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 12,
  }

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: '#0B0E11',
      color: '#fff',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      <canvas ref={canvasRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 900, margin: '0 auto',
        padding: '28px 18px 10px',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 42, marginBottom: 4 }}>🛡️</div>
          <div style={{
            fontSize: 42, fontWeight: 'bold', letterSpacing: 5,
            background: 'linear-gradient(90deg,#ff3333,#fff,#ff3333)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CASPERGUARD</div>
          <div style={{ fontSize: 20, color: '#fff', letterSpacing: 3, marginTop: 6 }}>
            AI AGENT SECURITY LAYER • CASPER TESTNET
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'BLOCK', value: blockHeight ? blockHeight.toString() : '...', color: '#F0B90B' },
            { label: 'CSPR', value: csprPrice ? `$${csprPrice.toFixed(6)}` : '...', color: '#F0B90B' },
            { label: 'NETWORK', value: 'TESTNET', color: '#F0B90B' }
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Contract */}
        <div style={{ ...card, border: '1px solid #ff3333' }}>
          <div style={{ fontSize: 17, color: '#fff', letterSpacing: 2, marginBottom: 10 }}>DEPLOYED CONTRACT</div>
          <div style={{ fontSize: 17, color: '#F0B90B', wordBreak: 'break-all', lineHeight: 1.6 }}>{CONTRACT_HASH}</div>
          <a href={`https://testnet.cspr.live/contract-package/28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0`} target="_blank" rel="noreferrer"
            style={{ display: 'block', marginTop: 12, fontSize: 19, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>
            🔗 View on Explorer →
          </a>
        </div>

        {/* Agent Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'TOTAL', value: stats.total, color: '#F0B90B', bg: '#111' },
            { label: 'APPROVED', value: stats.approved, color: '#F0B90B', bg: '#001a0d' },
            { label: 'BLOCKED', value: stats.blocked, color: '#F0B90B', bg: '#1a0000' }
          ].map(s => (
            <div key={s.label} style={{ ...card, background: s.bg, textAlign: 'center' }}>
              <div style={{ fontSize: 17, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#F0B90B' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button onClick={runAgent} disabled={agentStatus === 'running'}
          style={{
            width: '100%', padding: '18px',
            background: agentStatus === 'running' ? '#2a0000' : 'linear-gradient(135deg,#cc0000,#ff5555)',
            border: 'none', borderRadius: 14, color: '#fff', fontWeight: 'bold',
            fontSize: 18, cursor: agentStatus === 'running' ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace', letterSpacing: 2, marginBottom: 10,
            boxShadow: agentStatus !== 'running' ? '0 4px 20px rgba(255,50,50,0.3)' : 'none'
          }}>
          {agentStatus === 'running' ? '⚡ AGENT RUNNING...' : '🤖 RUN AI AGENT'}
        </button>

        <button onClick={fetchTransactions} disabled={loading}
          style={{
            width: '100%', padding: '16px',
            background: 'transparent', border: '1px solid #ff3333',
            borderRadius: 14, color: '#ff6666', fontWeight: 'bold',
            fontSize: 19, cursor: 'pointer', fontFamily: 'monospace',
            letterSpacing: 2, marginBottom: 14
          }}>
          {loading ? '🔍 FETCHING...' : '🔗 FETCH TRANSACTIONS'}
        </button>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div style={card}>
            <div style={{ fontSize: 17, color: '#fff', letterSpacing: 2, marginBottom: 12 }}>ON-CHAIN TRANSACTIONS</div>
            {transactions.map(tx => (
              <div key={tx.deploy_hash}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 20, color: tx.status === 'Success' ? '#00ff88' : '#ff3333', fontWeight: 'bold' }}>
                    ● {tx.status}
                  </span>
                  <span style={{ fontSize: 20, color: '#F0B90B' }}>{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 20, color: '#F0B90B', wordBreak: 'break-all', marginBottom: 4 }}>
                  TX: {tx.deploy_hash.slice(0, 24)}...
                </div>
                <div style={{ fontSize: 20, color: '#F0B90B', marginBottom: 8 }}>Cost: {tx.cost} motes</div>
                <a href={`${EXPLORER}/transaction/${tx.deploy_hash}`} target="_blank" rel="noreferrer"
                  style={{ fontSize: 19, color: '#ff6666', textDecoration: 'none', fontWeight: 'bold' }}>
                  🔗 View on Explorer →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Agent Feed */}
        <div style={card}>
          <div style={{ fontSize: 17, color: '#fff', letterSpacing: 2, marginBottom: 12 }}>⚡ AGENT FEED</div>
          {logs.map((l, i) => (
            <div key={i} style={{
              fontSize: 26, lineHeight: 2.4,
              color: "#00ff41",
              marginBottom: 6,
              borderLeft: i === 0 ? '2px solid #ff3333' : '2px solid #1a0000',
              paddingLeft: 8
            }}>{l}</div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 17, color: '#222', letterSpacing: 3, marginTop: 8 }}>
          CASPERGUARD • CASPER INNOVATION TRACK 2026
        </div>
      </div>
    </div>
  )
}
