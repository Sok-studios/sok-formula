import { useState, useEffect } from 'react'
import Splash           from './components/Splash.jsx'
import PasswordGate     from './components/PasswordGate.jsx'
import NameInput        from './components/NameInput.jsx'
import Instructions     from './components/Instructions.jsx'
import BlindSmelling    from './components/BlindSmelling.jsx'
import ScentReveal      from './components/ScentReveal.jsx'
import HowPerfumesWork  from './components/HowPerfumesWork.jsx'
import OilSmelling      from './components/OilSmelling.jsx'
import CoffeeBeanBreak  from './components/CoffeeBeanBreak.jsx'
import SmellingResults  from './components/SmellingResults.jsx'
import Builder          from './components/Builder.jsx'
import Result           from './components/Result.jsx'
import MixingChecklist  from './components/MixingChecklist.jsx'
import SampleCompare    from './components/SampleCompare.jsx'
import FinalResult      from './components/FinalResult.jsx'
import Admin            from './components/Admin.jsx'
import LanguageToggle   from './components/LanguageToggle.jsx'
import { C, fH }        from './lib/theme.js'
import { useLang }      from './context/LangContext.jsx'
import { buildFormula } from './lib/formula.js'
import { getSessionConfig, getOilConfig, saveBlindResult } from './lib/supabase.js'
import { ALL_OILS, TIERS } from './data/oils.js'
import { DEFAULT_VIAL_ORDER } from './data/families.js'

function mergeOilConfig(baseOils, oilConfig) {
  const merged = { top:baseOils.top.map(o=>({...o})), middle:baseOils.middle.map(o=>({...o})), base:baseOils.base.map(o=>({...o})) }
  for (const cfg of oilConfig) {
    if (cfg.type==='override') {
      for (const tier of TIERS) { const oil=merged[tier].find(o=>o.id===cfg.oil_id); if (oil) { if (cfg.max_drops===null) delete oil.maxDrops; else oil.maxDrops=cfg.max_drops } }
    } else if (cfg.type==='custom'&&cfg.active) {
      const t=cfg.tier; if (merged[t]) merged[t].push({id:cfg.oil_id,name:cfg.name,...(cfg.max_drops!==null?{maxDrops:cfg.max_drops}:{}),_configId:cfg.id})
    }
  }
  return merged
}

// screens
const SCREENS = ['splash','password','name','instr','blind','reveal','howto','smell_top','coffee1','smell_mid','coffee2','smell_base','smresult','builder','result1','mix1','result2','mix2','compare','final']

export default function App() {
  const isAdmin = window.location.hash==='#admin'
  const { t } = useLang()

  const [screen,         setScreen]         = useState('splash')
  const [sessionPwd,     setSessionPwd]     = useState(null)
  const [sessionOilIds,  setSessionOilIds]  = useState(null)
  const [vialOrder,      setVialOrder]      = useState(DEFAULT_VIAL_ORDER)
  const [oils,           setOils]           = useState(ALL_OILS)
  const [oilConfig,      setOilConfig]      = useState([])
  const [loading,        setLoading]        = useState(true)

  const [clientName,     setClientName]     = useState('')
  const [clientEmail,    setClientEmail]    = useState('')
  const [selected,       setSelected]       = useState({top:[],middle:[],base:[]})
  const [heroes,         setHeroes]         = useState({top:null,middle:null,base:null})
  const [emphasis,       setEmphasis]       = useState('balanced')
  const [sample1,        setSample1]        = useState(null)
  const [sample2,        setSample2]        = useState(null)
  const [finalFormula,   setFinalFormula]   = useState(null)
  const [finalSampleNum, setFinalSampleNum] = useState(1)
  const [scentFamilies,  setScentFamilies]  = useState([])
  const [topRatings,     setTopRatings]     = useState({})
  const [midRatings,     setMidRatings]     = useState({})
  const [baseRatings,    setBaseRatings]    = useState({})

  const loadConfig = async () => {
    try {
      const [cfg, oilCfg] = await Promise.all([getSessionConfig(), getOilConfig()])
      if (cfg.active_ids)        setSessionOilIds(new Set(cfg.active_ids))
      if (cfg.session_password)  setSessionPwd(cfg.session_password)
      if (cfg.vial_order)        setVialOrder(cfg.vial_order)
      setOilConfig(oilCfg)
      setOils(mergeOilConfig(ALL_OILS, oilCfg))
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadConfig() }, [])

  const activeOils = tier => sessionOilIds ? oils[tier].filter(o=>sessionOilIds.has(o.id)) : oils[tier]

  const toggleOil = (tier, oil) => {
    setSelected(prev => {
      const curr=prev[tier]; const exists=curr.find(o=>o.id===oil.id)
      if (exists) { const next=curr.filter(o=>o.id!==oil.id); if (heroes[tier]===oil.id) setHeroes(h=>({...h,[tier]:next[0]?.id||null})); return {...prev,[tier]:next} }
      if (curr.length>=3) return prev
      return {...prev,[tier]:[...curr,oil]}
    })
  }

  const preFillFromSmelling = ({ topPicks, midPicks, basePicks }) => {
    const sel = { top: topPicks.slice(0,3), middle: midPicks.slice(0,3), base: basePicks.slice(0,3) }
    setSelected(sel)
    setHeroes({ top: sel.top[0]?.id||null, middle: sel.middle[0]?.id||null, base: sel.base[0]?.id||null })
  }

  const doBuild = () => {
    const result = buildFormula(selected, heroes, emphasis)
    if (!sample1) { setSample1(result); setScreen('result1') }
    else { setSample2(result); setScreen('result2') }
  }

  const doAdjustFormula = (updatedOils) => {
    const updated = { ...(screen==='result1'?sample1:sample2), oils: updatedOils }
    if (screen==='result1') setSample1(updated); else setSample2(updated)
  }

  const doReset = () => {
    setSelected({top:[],middle:[],base:[]}); setHeroes({top:null,middle:null,base:null}); setEmphasis('balanced')
    setSample1(null); setSample2(null); setFinalFormula(null)
    setScentFamilies([]); setTopRatings({}); setMidRatings({}); setBaseRatings({})
    setScreen('blind')
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:C.bg }}>
      <div style={{ fontFamily:fH, fontSize:18, fontStyle:'italic', color:C.mid }}>Loading...</div>
    </div>
  )

  if (isAdmin) return (
    <><LanguageToggle />
    <Admin oilConfig={oilConfig} vialOrder={vialOrder}
      onSessionUpdate={ids=>setSessionOilIds(ids?new Set(ids):null)}
      onOilConfigChange={loadConfig}
      onPasswordChange={pwd=>setSessionPwd(pwd||null)}
      onVialOrderChange={order=>setVialOrder(order)} /></>
  )

  const afterSplash = () => sessionPwd ? setScreen('password') : setScreen('name')

  return (
    <>
      <LanguageToggle />
      {screen==='splash'    && <Splash onDone={afterSplash} />}
      {screen==='password'  && <PasswordGate correctPassword={sessionPwd} onSuccess={()=>setScreen('name')} />}
      {screen==='name'      && <NameInput onContinue={(n,e)=>{ setClientName(n); setClientEmail(e); setScreen('instr') }} />}
      {screen==='instr'     && <Instructions onContinue={()=>setScreen('blind')} />}
      {screen==='blind'     && <BlindSmelling vialOrder={vialOrder} onBack={()=>setScreen('instr')} onDone={async(families)=>{ setScentFamilies(families); await saveBlindResult(clientName,families); setScreen('reveal') }} />}
      {screen==='reveal'    && <ScentReveal selectedFamilies={scentFamilies} onBack={()=>setScreen('blind')} onContinue={()=>setScreen('howto')} />}
      {screen==='howto'     && <HowPerfumesWork onBack={()=>setScreen('reveal')} onContinue={()=>setScreen('smell_top')} />}
      {screen==='smell_top' && <OilSmelling tier="top" oils={activeOils('top')} onBack={()=>setScreen('howto')} onContinue={r=>{ setTopRatings(r); setScreen('coffee1') }} isLast={false} />}
      {screen==='coffee1'   && <CoffeeBeanBreak onContinue={()=>setScreen('smell_mid')} />}
      {screen==='smell_mid' && <OilSmelling tier="middle" oils={activeOils('middle')} onBack={()=>setScreen('coffee1')} onContinue={r=>{ setMidRatings(r); setScreen('coffee2') }} isLast={false} />}
      {screen==='coffee2'   && <CoffeeBeanBreak onContinue={()=>setScreen('smell_base')} />}
      {screen==='smell_base'&& <OilSmelling tier="base" oils={activeOils('base')} onBack={()=>setScreen('coffee2')} onContinue={r=>{ setBaseRatings(r); setScreen('smresult') }} isLast={true} />}
      {screen==='smresult'  && <SmellingResults topRatings={topRatings} midRatings={midRatings} baseRatings={baseRatings} topOils={activeOils('top')} midOils={activeOils('middle')} baseOils={activeOils('base')} onContinue={picks=>{ preFillFromSmelling(picks); setScreen('builder') }} />}

      {screen==='builder' && (
        <div style={{ maxWidth:600, margin:'0 auto', padding:'36px 20px 80px', color:C.dark, minHeight:'100vh' }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontFamily:fH, fontSize:10, letterSpacing:'0.32em', color:C.gold, textTransform:'uppercase', marginBottom:4 }}>Sok Studios · {t.builder_step}</div>
            <div style={{ fontFamily:fH, fontSize:32, fontWeight:300, lineHeight:1 }}>{t.builder_title}</div>
            <div style={{ fontSize:11, color:C.mid, marginTop:5 }}>{clientName} {t.builder_sub}</div>
          </div>
          <Builder selected={selected} heroes={heroes} emphasis={emphasis} clientName={clientName}
            activeOils={activeOils} toggleOil={toggleOil} setHeroes={setHeroes} setEmphasis={setEmphasis}
            setClientName={setClientName} onBuild={doBuild} onBack={()=>setScreen('smresult')} />
        </div>
      )}

      {screen==='result1' && sample1 && (
        <Result formula={sample1} clientName={clientName} emphasis={emphasis} sampleNum={1}
          onEdit={()=>setScreen('builder')} onNew={doReset}
          onAdjust={updated=>{ setSample1({...sample1,oils:updated}) }}
          onMix={()=>setScreen('mix1')}
          onMake2={()=>setScreen('builder')}
          onFinalize={()=>{ setFinalFormula(sample1); setFinalSampleNum(1); setScreen('final') }} />
      )}

      {screen==='mix1' && sample1 && (
        <MixingChecklist formula={sample1} sampleNum={1} onDone={()=>{
          if (sample2) setScreen('compare')
          else setScreen('result1_post')
        }} />
      )}

      {screen==='result1_post' && sample1 && (
        <div className="screen" style={{ maxWidth:600, margin:'0 auto', padding:'36px 20px 80px', color:C.dark, minHeight:'100vh' }}>
          <div style={{ fontFamily:fH, fontSize:10, letterSpacing:'0.32em', color:C.gold, textTransform:'uppercase', marginBottom:8 }}>Sok Studios</div>
          <div style={{ fontFamily:fH, fontSize:30, fontWeight:300, marginBottom:16 }}>Sample 1 is ready ✓</div>
          <div style={{ fontSize:13, color:C.mid, marginBottom:40, lineHeight:1.7 }}>Take a moment to smell it. What do you think?</div>

          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:13, color:C.dark, fontWeight:500, marginBottom:14, textAlign:'center' }}>{t.sensory_q}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              {t.sensory.map(s => (
                <button key={s.id}
                  onClick={() => {
                    if (s.emphasis) {
                      const result = buildFormula(selected, heroes, s.emphasis)
                      setSample2(result); setScreen('result2')
                    } else {
                      setFinalFormula(sample1); setFinalSampleNum(1); setScreen('final')
                    }
                  }}
                  style={{ padding:'12px 10px', borderRadius:6, border:`1px solid ${s.id==='perfect'?C.gold:C.border}`, background:s.id==='perfect'?C.dark:'#FFF', color:s.id==='perfect'?'white':C.dark, fontSize:13, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={()=>setScreen('builder')}
            style={{ width:'100%', padding:13, background:'#FFF', color:C.dark, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, cursor:'pointer', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            {t.result_make2}
          </button>
        </div>
      )}

      {screen==='result2' && sample2 && (
        <Result formula={sample2} clientName={clientName} emphasis={emphasis} sampleNum={2}
          onEdit={()=>setScreen('builder')} onNew={doReset}
          onAdjust={updated=>{ setSample2({...sample2,oils:updated}) }}
          onMix={()=>setScreen('mix2')}
          onMake2={()=>setScreen('builder')}
          onFinalize={()=>{ setFinalFormula(sample2); setFinalSampleNum(2); setScreen('final') }} />
      )}

      {screen==='mix2' && sample2 && (
        <MixingChecklist formula={sample2} sampleNum={2} onDone={()=>setScreen('compare')} />
      )}

      {screen==='compare' && sample1 && sample2 && (
        <SampleCompare sample1={sample1} sample2={sample2}
          onSelect={(formula,num)=>{ setFinalFormula(formula); setFinalSampleNum(num); setScreen('final') }} />
      )}

      {screen==='final' && finalFormula && (
        <FinalResult formula={finalFormula} clientName={clientName} clientEmail={clientEmail}
          emphasis={emphasis} sampleNum={finalSampleNum} onNew={doReset} />
      )}
    </>
  )
}
