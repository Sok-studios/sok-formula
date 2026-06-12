import{useState,useEffect,useCallback}from'react'
import Philosophy from'./components/Philosophy.jsx'
import PhotoConsent from'./components/PhotoConsent.jsx'
import Splash from'./components/Splash.jsx'
import PasswordGate from'./components/PasswordGate.jsx'
import NameInput from'./components/NameInput.jsx'
import BlindSmelling from'./components/BlindSmelling.jsx'
import ScentReveal from'./components/ScentReveal.jsx'
import HowPerfumesWork from'./components/HowPerfumesWork.jsx'
import Instructions from'./components/Instructions.jsx'
import OilSmelling from'./components/OilSmelling.jsx'
import CoffeeBeanBreak from'./components/CoffeeBeanBreak.jsx'
import SmellingResults from'./components/SmellingResults.jsx'
import Builder from'./components/Builder.jsx'
import Result from'./components/Result.jsx'
import MixingChecklist from'./components/MixingChecklist.jsx'
import PostMix from'./components/PostMix.jsx'
import SampleCompare from'./components/SampleCompare.jsx'
import ScaleChoice from'./components/ScaleChoice.jsx'
import LearnCards from'./components/LearnCards.jsx'
import FinalResult from'./components/FinalResult.jsx'
import Admin from'./components/Admin.jsx'
import{C,fH,fK,fB}from'./lib/theme.js'
import{useLang}from'./context/LangContext.jsx'
import{buildFormula}from'./lib/formula.js'
import{getSessionConfig,getOilConfig,saveBlindResult,saveFormula}from'./lib/supabase.js'
import{ALL_OILS,TIERS}from'./data/oils.js'
import{DEFAULT_VIAL_ORDER}from'./data/families.js'

const SESSION_KEY='sok_v2'
const SESSION_TIMEOUT=6*60*60*1000

function saveSession(data){try{localStorage.setItem(SESSION_KEY,JSON.stringify({...data,_ts:Date.now()}))}catch{}}
function loadSession(){try{const s=localStorage.getItem(SESSION_KEY);if(!s)return null;const d=JSON.parse(s);if(Date.now()-d._ts>SESSION_TIMEOUT){localStorage.removeItem(SESSION_KEY);return null}return d}catch{return null}}
function clearSession(){try{localStorage.removeItem(SESSION_KEY)}catch{}}

function mergeOilConfig(baseOils,oilConfig){
  const m={top:baseOils.top.map(o=>({...o})),middle:baseOils.middle.map(o=>({...o})),base:baseOils.base.map(o=>({...o}))}
  for(const cfg of oilConfig){
    if(cfg.type==='override'){for(const tier of TIERS){const oil=m[tier].find(o=>o.id===cfg.oil_id);if(oil){if(cfg.max_drops===null)delete oil.maxDrops;else oil.maxDrops=cfg.max_drops}}}
    else if(cfg.type==='custom'&&cfg.active){const t=cfg.tier;if(m[t])m[t].push({id:cfg.oil_id,name:cfg.name,...(cfg.max_drops!==null?{maxDrops:cfg.max_drops}:{}),_configId:cfg.id})}
  }
  return m
}

export default function App(){
  const isAdmin=window.location.hash==='#admin'
  const{t,lang}=useLang()

  const[screen,setScreen]=useState('splash')
  const[sessionPwd,setSessionPwd]=useState(null)
  const[sessionOilIds,setSessionOilIds]=useState(null)
  const[vialOrder,setVialOrder]=useState(DEFAULT_VIAL_ORDER)
  const[oils,setOils]=useState(ALL_OILS)
  const[oilConfig,setOilConfig]=useState([])
  const[loading,setLoading]=useState(true)

  const[clientName,setClientName]=useState('')
  const[clientEmail,setClientEmail]=useState('')
  const[photoConsent,setPhotoConsent]=useState(null)
  const[selected,setSelected]=useState({top:[],middle:[],base:[]})
  const[heroes,setHeroes]=useState({top:null,middle:null,base:null})
  const[userPickedOils,setUserPickedOils]=useState({top:[],middle:[],base:[]})
  const[emphasis,setEmphasis]=useState('balanced')
  const[sample1,setSample1]=useState(null)
  const[sample2,setSample2]=useState(null)
  const[finalFormula,setFinalFormula]=useState(null)
  const[finalSampleNum,setFinalSampleNum]=useState(1)
  const[scentFamilies,setScentFamilies]=useState([])
  const[topRatings,setTopRatings]=useState({})
  const[midRatings,setMidRatings]=useState({})
  const[baseRatings,setBaseRatings]=useState({})
  const[scaleChoice,setScaleChoice]=useState(null)
  const[postmixImpression,setPostmixImpression]=useState('')

  const loadConfig=async()=>{
    try{
      const[cfg,oilCfg]=await Promise.all([getSessionConfig(),getOilConfig()])
      // active_ids: null이면 전체 공개, 배열이면 해당 향료만
      if(Array.isArray(cfg.active_ids)&&cfg.active_ids.length>0){
        setSessionOilIds(new Set(cfg.active_ids))
      } else {
        setSessionOilIds(null)
      }
      // session_password: null이거나 빈 문자열이면 비밀번호 없음
      const pwd=cfg.session_password&&cfg.session_password.trim()
      setSessionPwd(pwd||null)
      if(cfg.vial_order&&cfg.vial_order.length>0)setVialOrder(cfg.vial_order)
      setOilConfig(oilCfg)
      setOils(mergeOilConfig(ALL_OILS,oilCfg))
    }catch(e){console.error('loadConfig error',e)}
    setLoading(false)
  }

  useEffect(()=>{
    loadConfig()
    // Restore session from localStorage
    const saved=loadSession()
    if(saved&&saved.clientName&&saved.screen&&saved.screen!=='splash'){
      setClientName(saved.clientName||'')
      setClientEmail(saved.clientEmail||'')
      setScreen(saved.screen)
      setSelected(saved.selected||{top:[],middle:[],base:[]})
      setHeroes(saved.heroes||{top:null,middle:null,base:null})
      setEmphasis(saved.emphasis||'balanced')
      setSample1(saved.sample1||null)
      setScentFamilies(saved.scentFamilies||[])
      setTopRatings(saved.topRatings||{})
      setMidRatings(saved.midRatings||{})
      setBaseRatings(saved.baseRatings||{})
    }
  },[])

  // Save session on state changes
  useEffect(()=>{
    if(clientName&&screen!=='splash'){
      saveSession({screen,clientName,clientEmail,selected,heroes,emphasis,sample1,scentFamilies,topRatings,midRatings,baseRatings})
    }
  },[screen,clientName,clientEmail,selected,heroes,emphasis,sample1,scentFamilies,topRatings,midRatings,baseRatings])

  const activeOils=tier=>sessionOilIds?oils[tier].filter(o=>sessionOilIds.has(o.id)):oils[tier]

  const toggleOil=(tier,oil)=>{
    setSelected(prev=>{
      const curr=prev[tier];const exists=curr.find(o=>o.id===oil.id)
      if(exists){const next=curr.filter(o=>o.id!==oil.id);if(heroes[tier]===oil.id)setHeroes(h=>({...h,[tier]:next[0]?.id||null}));return{...prev,[tier]:next}}
      if(curr.length>=3)return prev
      return{...prev,[tier]:[...curr,oil]}
    })
  }

  const preFill=({topPicks,midPicks,basePicks})=>{
    const sel={top:topPicks.slice(0,3),middle:midPicks.slice(0,3),base:basePicks.slice(0,3)}
    setSelected(sel)
    setHeroes({top:sel.top[0]?.id||null,middle:sel.middle[0]?.id||null,base:sel.base[0]?.id||null})
    // 유저가 고른 향료들을 Builder에서 기본 표시용으로 저장
    setUserPickedOils({top:topPicks,middle:midPicks,base:basePicks})
  }

  const doBuild=()=>{
    const result=buildFormula(selected,heroes,emphasis,t.emp)
    if(!sample1){setSample1(result);setScreen('result1')}
    else{setSample2(result);setScreen('result2')}
  }

  const doReset=()=>{
    setSelected({top:[],middle:[],base:[]});setHeroes({top:null,middle:null,base:null});setEmphasis('balanced')
    setSample1(null);setSample2(null);setFinalFormula(null);setScentFamilies([])
    setTopRatings({});setMidRatings({});setBaseRatings({});setScaleChoice(null);setPostmixImpression('')
    setUserPickedOils({top:[],middle:[],base:[]})
    clearSession();setScreen('blind')
  }

  if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:C.bg}}><div style={{fontFamily:fH,fontSize:18,fontStyle:'italic',color:C.mid}}>Loading...</div></div>

  if(isAdmin)return(
    <Admin oilConfig={oilConfig} vialOrder={vialOrder}
      onSessionUpdate={ids=>setSessionOilIds(ids?new Set(ids):null)}
      onOilConfigChange={loadConfig}
      onPasswordChange={pwd=>setSessionPwd(pwd||null)}
      onVialOrderChange={order=>setVialOrder(order)}/>
  )

  const afterSplash=()=>setScreen('philosophy')

  const goToBuilder=()=>setScreen('builder')

  return(
    <>
      {screen==='splash'&&<Splash onDone={afterSplash}/>}
      {screen==='philosophy'&&<Philosophy onContinue={()=>setScreen(sessionPwd?'password':'name')}/>}
      {screen==='password'&&<PasswordGate correctPassword={sessionPwd} onSuccess={()=>setScreen('name')}/>}
      {screen==='name'&&<NameInput onContinue={(n,e)=>{setClientName(n);setClientEmail(e);setScreen('photo')}}/>}
      {screen==='photo'&&<PhotoConsent onAnswer={v=>{setPhotoConsent(v);setScreen('blind')}}/>}
      {screen==='blind'&&<BlindSmelling vialOrder={vialOrder} onBack={()=>setScreen('photo')} onDone={async families=>{setScentFamilies(families);await saveBlindResult(clientName,families);setScreen('reveal')}}/>}
      {screen==='reveal'&&<ScentReveal selectedFamilies={scentFamilies} onBack={()=>setScreen('blind')} onContinue={()=>setScreen('howto')}/>}
      {screen==='howto'&&<HowPerfumesWork onBack={()=>setScreen('reveal')} onContinue={()=>setScreen('instr')}/>}
      {screen==='instr'&&<Instructions onBack={()=>setScreen('howto')} onContinue={()=>setScreen('smell_top')}/>}
      {screen==='smell_top'&&<OilSmelling tier="top" oils={activeOils('top')} onBack={()=>setScreen('instr')} onContinue={r=>{setTopRatings(r);setScreen('coffee1')}}/>}
      {screen==='coffee1'&&<CoffeeBeanBreak onContinue={()=>setScreen('smell_mid')}/>}
      {screen==='smell_mid'&&<OilSmelling tier="middle" oils={activeOils('middle')} onBack={()=>setScreen('coffee1')} onContinue={r=>{setMidRatings(r);setScreen('coffee2')}}/>}
      {screen==='coffee2'&&<CoffeeBeanBreak onContinue={()=>setScreen('smell_base')}/>}
      {screen==='smell_base'&&<OilSmelling tier="base" oils={activeOils('base')} onBack={()=>setScreen('coffee2')} onContinue={r=>{setBaseRatings(r);setScreen('smresult')}}/>}
      {screen==='smresult'&&<SmellingResults topRatings={topRatings} midRatings={midRatings} baseRatings={baseRatings} topOils={activeOils('top')} midOils={activeOils('middle')} baseOils={activeOils('base')} onContinue={picks=>{preFill(picks);setScreen('builder')}}/>}

      {screen==='builder'&&(
        <div style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 80px',color:C.dark,minHeight:'100vh'}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:lang==='ko'?fK:fH,fontSize:10,letterSpacing:'0.32em',color:C.gold,textTransform:'uppercase',marginBottom:4}}>Sok Studios · {t.builder_step}</div>
            <div style={{fontFamily:lang==='ko'?fK:fH,fontSize:32,fontWeight:300,lineHeight:1}}>{t.builder_title}</div>
            <div style={{fontSize:11,color:C.mid,marginTop:5}}>{clientName} · 2ml · 2.000g · 100 drops</div>
          </div>
          <Builder selected={selected} heroes={heroes} emphasis={emphasis} clientName={clientName} activeOils={activeOils} toggleOil={toggleOil} setHeroes={setHeroes} setEmphasis={setEmphasis} onBuild={doBuild} onBack={()=>setScreen('smresult')} userPickedOils={userPickedOils}/>
        </div>
      )}

      {screen==='result1'&&sample1&&(
        <Result formula={sample1} clientName={clientName} emphasis={emphasis} sampleNum={1}
          onEdit={()=>setScreen('builder')}
          onAdjust={updated=>setSample1({...sample1,oils:updated})}
          onMix={()=>setScreen('mix1')}/>
      )}
      {screen==='mix1'&&sample1&&(
        <MixingChecklist formula={sample1} sampleNum={1} onDone={()=>setScreen('postmix1')}/>
      )}
      {screen==='postmix1'&&(
        <PostMix lang={lang} sampleNum={1}
          onMake2={()=>{setScreen('builder')}}
          onFinalize={()=>{setFinalFormula(sample1);setFinalSampleNum(1);setScreen('scale')}}/>
      )}
      {screen==='result2'&&sample2&&(
        <Result formula={sample2} clientName={clientName} emphasis={emphasis} sampleNum={2}
          onEdit={()=>setScreen('builder')}
          onAdjust={updated=>setSample2({...sample2,oils:updated})}
          onMix={()=>setScreen('mix2')}/>
      )}
      {screen==='mix2'&&sample2&&(
        <MixingChecklist formula={sample2} sampleNum={2} onDone={()=>{
          if(sample1&&sample2)setScreen('compare')
          else{setFinalFormula(sample2);setFinalSampleNum(2);setScreen('scale')}
        }}/>
      )}
      {screen==='compare'&&sample1&&sample2&&(
        <SampleCompare sample1={sample1} sample2={sample2} onSelect={(formula,num)=>{setFinalFormula(formula);setFinalSampleNum(num);setScreen('scale')}}/>
      )}
      {screen==='scale'&&<ScaleChoice onChoose={choice=>{setScaleChoice(choice);setScreen('final')}}/>}
      {screen==='final'&&finalFormula&&(
        <FinalResult formula={finalFormula} clientName={clientName} clientEmail={clientEmail} emphasis={emphasis} sampleNum={finalSampleNum} scaleChoice={scaleChoice}
          onNew={doReset} onCards={()=>setScreen('cards')}/>
      )}
      {screen==='cards'&&<LearnCards onDone={doReset}/>}
    </>
  )
}
