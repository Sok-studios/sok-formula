import { useState, useEffect } from 'react'
import Splash           from './components/Splash.jsx'
import PasswordGate     from './components/PasswordGate.jsx'
import NameInput        from './components/NameInput.jsx'
import BlindSmelling    from './components/BlindSmelling.jsx'
import ScentReveal      from './components/ScentReveal.jsx'
import HowPerfumesWork  from './components/HowPerfumesWork.jsx'
import Builder          from './components/Builder.jsx'
import Result           from './components/Result.jsx'
import SampleCompare    from './components/SampleCompare.jsx'
import FinalResult      from './components/FinalResult.jsx'
import Admin            from './components/Admin.jsx'
import { C, fH }        from './lib/theme.js'
import { buildFormula } from './lib/formula.js'
import { getSessionConfig, getOilConfig, saveBlindResult } from './lib/supabase.js'
import { ALL_OILS, TIERS } from './data/oils.js'
import { SCENT_FAMILIES, DEFAULT_VIAL_ORDER } from './data/families.js'

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
        if (oil) { if (cfg.max_drops === null) delete oil.maxDrops; else oil.maxDrops = cfg.max_drops }
      }
    } else if (cfg.type === 'custom' && cfg.active) {
      const t = cfg.tier
      if (merged[t]) merged[t].push({ id: cfg.oil_id, name: cfg.name, ...(cfg.max_drops !== null ? { maxDrops: cfg.max_drops } : {}), _configId: cfg.id })
    }
  }
  return merged
}

// screens: splash | password | name | blind | reveal | howto | builder | result1 | result2 | compare | final
export default function App() {
  const isAdmin = window.location.hash === '#admin'

  const [screen,        setScreen]        = useState('splash')
  const [sessionPwd,    setSessionPwd]    = useState(null)
  const [sessionOilIds, setSessionOilIds] = useState(null)
  const [vialOrder,     setVialOrder]     = useState(DEFAULT_VIAL_ORDER)
  const [oils,          setOils]          = useState(ALL_OILS)
  const [oilConfig,     setOilConfig]     = useState([])
  const [loading,       setLoading]       = useState(true)

  const [clientName,     setClientName]     = useState('')
  const [selected,       setSelected]       = useState({ top: [], middle: [], base: [] })
  const [heroes,         setHeroes]         = useState({ top: null, middle: null, base: null })
  const [emphasis,       setEmphasis]       = useState('balanced')
  const [sample1,        setSample1]        = useState(null)
  const [sample2,        setSample2]        = useState(null)
  const [finalFormula,   setFinalFormula]   = useState(null)
  const [finalSampleNum, setFinalSampleNum] = useState(1)
  const [scentFamilies,  setScentFamilies]  = useState([])

  const loadConfig = async () => {
    try {
      const [cfg, oilCfg] = await Promise.all([getSessionConfig(), getOilConfig()])
      if (cfg.active_ids)      setSessionOilIds(new Set(cfg.active_ids))
      if (cfg.session_password) setSessionPwd(cfg.session_password)
      if (cfg.vial_order)      setVialOrder(cfg.vial_order)
      setOilConfig(oilCfg)
      setOils(mergeOilConfig(ALL_OILS, oilCfg))
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadConfig() }, [])

  const activeOils = tier =>
    sessionOilIds ? oils[tier].filter(o => sessionOilIds.has(o.id)) : oils[tier]

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

  const handleBlindDone = async (families) => {
    setScentFamilies(families)
    await saveBlindResult(clientName, families)
    setScreen('reveal')
  }

  const doBuild = () => {
    const result = buildFormula(selected, heroes, emphasis)
    setSample1(result)
    setSample2(null)
    setScreen('result1')
  }

  const doAdjust = (newEmphasis) => {
    const result = buildFormula(selected, heroes, newEmphasis)
    setSample2(result)
    setScreen('compare')
  }

  const doFinalize = (formula) => {
    setFinalFormula(formula)
    setFinalSampleNum(1)
    setScreen('final')
  }

  const doSelectSample = (formula, num) => {
    setFinalFormula(formula)
    setFinalSampleNum(num)
    setScreen('final')
  }

  const doReset = () => {
    setSelected({ top: [], middle: [], base: [] })
    setHeroes({ top: null, middle: null, base: null })
    setEmphasis('balanced')
    setSample1(null); setSample2(null); setFinalFormula(null)
    setScentFamilies([])
    setScreen('blind')
  }

  const afterSplash = () => sessionPwd ? setScreen('password') : setScreen('name')

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg }}>
      <div style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic', color: C.mid }}>Loading...</div>
    </div>
  )

  if (isAdmin) return (
    <Admin
      oilConfig={oilConfig}
      vialOrder={vialOrder}
      onSessionUpdate={ids => setSessionOilIds(ids ? new Set(ids) : null)}
      onOilConfigChange={loadConfig}
      onPasswordChange={pwd => setSessionPwd(pwd || null)}
      onVialOrderChange={order => setVialOrder(order)}
    />
  )

  if (screen === 'splash')   return <Splash onDone={afterSplash} />
  if (screen === 'password') return <PasswordGate correctPassword={sessionPwd} onSuccess={() => setScreen('name')} />
  if (screen === 'name')     return <NameInput onContinue={name => { setClientName(name); setScreen('blind') }} />
  if (screen === 'blind')    return <BlindSmelling vialOrder={vialOrder} onDone={handleBlindDone} />
  if (screen === 'reveal')   return <ScentReveal selectedFamilies={scentFamilies} onContinue={() => setScreen('howto')} />
  if (screen === 'howto')    return <HowPerfumesWork onContinue={() => setScreen('builder')} />

  if (screen === 'builder') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 80px', color: C.dark, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>Sok Studios · Step 4</div>
        <div style={{ fontFamily: fH, fontSize: 32, fontWeight: 300, lineHeight: 1 }}>Choose & Create</div>
        <div style={{ fontSize: 11, color: C.mid, marginTop: 5 }}>{clientName}님 · 2ml · 2.000g · 100 drops</div>
      </div>
      <Builder
        selected={selected} heroes={heroes} emphasis={emphasis} clientName={clientName}
        activeOils={activeOils} toggleOil={toggleOil}
        setHeroes={setHeroes} setEmphasis={setEmphasis}
        setClientName={setClientName} onBuild={doBuild}
      />
    </div>
  )

  if (screen === 'result1' && sample1) return (
    <Result
      formula={sample1} clientName={clientName} emphasis={emphasis} sampleNum={1}
      onEdit={() => setScreen('builder')} onNew={doReset}
      onAdjust={doAdjust} onFinalize={doFinalize}
    />
  )

  if (screen === 'compare' && sample1 && sample2) return (
    <SampleCompare sample1={sample1} sample2={sample2} onSelect={doSelectSample} />
  )

  if (screen === 'final' && finalFormula) return (
    <FinalResult
      formula={finalFormula} clientName={clientName} emphasis={emphasis}
      sampleNum={finalSampleNum} onNew={doReset}
    />
  )

  return null
}
