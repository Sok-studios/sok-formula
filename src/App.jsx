import { useState, useEffect } from 'react'
import Builder from './components/Builder.jsx'
import Result  from './components/Result.jsx'
import Admin   from './components/Admin.jsx'
import { C, fH } from './lib/theme.js'
import { buildFormula } from './lib/formula.js'
import { getSessionOils, getOilConfig } from './lib/supabase.js'
import { ALL_OILS, TIERS } from './data/oils.js'

function mergeOilConfig(baseOils, oilConfig) {
  const merged = {
    top:    baseOils.top.map(o => ({ ...o })),
    middle: baseOils.middle.map(o => ({ ...o })),
    base:   baseOils.base.map(o => ({ ...o })),
  }

  for (const cfg of oilConfig) {
    if (cfg.type === 'override') {
      for (const tier of TIERS) {
        const oil = merged[tier].find(o => o.id === cfg.oil_id)
        if (oil) {
          if (cfg.max_drops === null) delete oil.maxDrops
          else oil.maxDrops = cfg.max_drops
        }
      }
    } else if (cfg.type === 'custom' && cfg.active) {
      const tier = cfg.tier
      if (merged[tier]) {
        merged[tier].push({
          id: cfg.oil_id,
          name: cfg.name,
          ...(cfg.max_drops !== null ? { maxDrops: cfg.max_drops } : {}),
          _configId: cfg.id,
        })
      }
    }
  }
  return merged
}

export default function App() {
  const isAdmin = window.location.hash === '#admin'

  const [oils,         setOils]         = useState(ALL_OILS)
  const [oilConfig,    setOilConfig]    = useState([])
  const [sessionOilIds,setSessionOilIds]= useState(null)
  const [loading,      setLoading]      = useState(true)

  const [clientName, setClientName] = useState('')
  const [selected,   setSelected]   = useState({ top: [], middle: [], base: [] })
  const [heroes,     setHeroes]     = useState({ top: null, middle: null, base: null })
  const [emphasis,   setEmphasis]   = useState('balanced')
  const [formula,    setFormula]    = useState(null)
  const [view,       setView]       = useState('builder')

  const loadConfig = async () => {
    try {
      const [ids, cfg] = await Promise.all([getSessionOils(), getOilConfig()])
      if (ids) setSessionOilIds(new Set(ids))
      setOilConfig(cfg)
      setOils(mergeOilConfig(ALL_OILS, cfg))
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadConfig() }, [])

  const activeOils = tier =>
    sessionOilIds
      ? oils[tier].filter(o => sessionOilIds.has(o.id))
      : oils[tier]

  const activeCount = sessionOilIds
    ? sessionOilIds.size
    : TIERS.reduce((s, t) => s + oils[t].length, 0)

  const toggleOil = (tier, oil) => {
    setSelected(prev => {
      const curr = prev[tier]
      const exists = curr.find(o => o.id === oil.id)
      if (exists) {
        const next = curr.filter(o => o.id !== oil.id)
        if (heroes[tier] === oil.id) setHeroes(h => ({ ...h, [tier]: next[0]?.id || null }))
        return { ...prev, [tier]: next }
      }
      if (curr.length >= 3) return prev
      return { ...prev, [tier]: [...curr, oil] }
    })
  }

  const doBuild = () => {
    const result = buildFormula(selected, heroes, emphasis)
    setFormula(result)
    setView('result')
  }

  const doReset = () => {
    setFormula(null); setView('builder'); setClientName('')
    setSelected({ top: [], middle: [], base: [] })
    setHeroes({ top: null, middle: null, base: null })
    setEmphasis('balanced')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg }}>
      <div style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic', color: C.mid }}>Loading...</div>
    </div>
  )

  if (isAdmin) return (
    <Admin
      oilConfig={oilConfig}
      onSessionUpdate={ids => setSessionOilIds(ids ? new Set(ids) : null)}
      onOilConfigChange={() => loadConfig()}
    />
  )

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 80px', color: C.dark, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>Sok Studios</div>
        <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1 }}>Formula Builder</div>
        <div style={{ fontSize: 11, color: C.mid, marginTop: 5 }}>2ml · 2.000g · 100 drops total</div>
      </div>

      {view === 'builder' && (
        <Builder
          selected={selected} heroes={heroes} emphasis={emphasis} clientName={clientName}
          activeOils={activeOils} toggleOil={toggleOil}
          setHeroes={setHeroes} setEmphasis={setEmphasis} setClientName={setClientName}
          onBuild={doBuild}
        />
      )}

      {view === 'result' && formula && (
        <Result
          formula={formula} clientName={clientName} emphasis={emphasis}
          onEdit={() => setView('builder')} onNew={doReset}
        />
      )}
    </div>
  )
}
