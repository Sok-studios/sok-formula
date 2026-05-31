import { useState, useEffect } from 'react'
import Builder from './components/Builder.jsx'
import Result  from './components/Result.jsx'
import Admin   from './components/Admin.jsx'
import { C, fH, fB } from './lib/theme.js'
import { buildFormula } from './lib/formula.js'
import { getSessionOils } from './lib/supabase.js'
import { ALL_OILS, TIERS } from './data/oils.js'

export default function App() {
  const isAdmin = window.location.hash === '#admin'

  const [sessionOilIds, setSessionOilIds] = useState(null) // null = all active
  const [loading,       setLoading]       = useState(true)

  // builder state
  const [clientName, setClientName] = useState('')
  const [selected,   setSelected]   = useState({ top: [], middle: [], base: [] })
  const [heroes,     setHeroes]     = useState({ top: null, middle: null, base: null })
  const [emphasis,   setEmphasis]   = useState('balanced')
  const [formula,    setFormula]    = useState(null)
  const [view,       setView]       = useState('builder') // builder | result

  useEffect(() => {
    getSessionOils().then(ids => {
      if (ids) setSessionOilIds(new Set(ids))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeOils = tier =>
    sessionOilIds
      ? ALL_OILS[tier].filter(o => sessionOilIds.has(o.id))
      : ALL_OILS[tier]

  const activeCount = sessionOilIds
    ? sessionOilIds.size
    : TIERS.reduce((s, t) => s + ALL_OILS[t].length, 0)

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
    setFormula(null)
    setView('builder')
    setClientName('')
    setSelected({ top: [], middle: [], base: [] })
    setHeroes({ top: null, middle: null, base: null })
    setEmphasis('balanced')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg }}>
      <div style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic', color: C.mid }}>Loading...</div>
    </div>
  )

  if (isAdmin) return <Admin onSessionUpdate={ids => setSessionOilIds(ids ? new Set(ids) : null)} />

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 80px', fontFamily: fB, color: C.dark, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>
          Sok Studios
        </div>
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
