import { useState, useEffect } from 'react'
import { getBlockHeight, getCSPRPrice, aiRiskScore } from './api'

const CONTRACT_HASH = 'hash-28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0'
const EXPLORER = 'https://testnet.cspr.live'

export default function App() {
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [csprPrice, setCsprPrice] = useState<number>(0)
  const [logs, setLogs] = useState<string[]>(['CasperGuard initialized...'])
  const [stats, setStats] = useState({ approved: 0, blocked: 0, total: 0 })
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'done'>('idle')

  const card = {
    background: 'rgba(20,24,29,0.93)',
    border: '1px solid #2a0000',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 12,
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
    setAgentStatus('done')
  }

  return (
    <div style={{ fontFamily: "'Courier New', monospace", width: '100%', minHeight: '100vh', background: '#0B0E11', color: '#fff' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 18px', boxSizing: 'border-box' as const }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>shield</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', letterSpacing: 5, background: 'linear-gradient(90deg,#ff3333,#fff,#ff3333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASPERGUARD</div>
          <div style={{ fontSize: 13, color: '#aaa', letterSpacing: 3, marginTop: 6 }}>AI AGENT SECURITY LAYER - CASPER TESTNET</div>
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

        <div style={{ textAlign: 'center', fontSize: 10, color: '#333', marginTop: 12, letterSpacing: 3 }}>
          CASPERGUARD - CASPER INNOVATION TRACK 2026
        </div>
      </div>
    </div>
  )
}
