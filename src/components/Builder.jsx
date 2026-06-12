import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import{TIERS,ALL_OILS}from'../data/oils.js'

export default function Builder({selected,heroes,emphasis,clientName,activeOils,toggleOil,setHeroes,setEmphasis,onBuild,onBack,userPickedOils}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[showAll,setShowAll]=useState({top:false,middle:false,base:false})
  const totalSel=TIERS.reduce((s,ti)=>s+selected[ti].length,0)
  const noteLabels={top:t.note_top,middle:t.note_mid,base:t.note_base}
  const isKo=lang==='ko'

  return(
    <div>
      {onBack&&<button onClick={onBack} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:20,fontFamily:fB}}>{t.back}</button>}
      {TIERS.map(tier=>{
        const pickedOils=userPickedOils?userPickedOils[tier]||[]:activeOils(tier)
        const allOilsForTier=activeOils(tier)
        const displayOils=showAll[tier]?allOilsForTier:pickedOils
        const sel=selected[tier]
        const heroId=heroes[tier]||sel[0]?.id
        return(
          <div key={tier} style={{marginBottom:22}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{fontFamily:fHead,fontSize:19,fontStyle:'italic'}}>{noteLabels[tier]} Note</span>
              {sel.length>0&&<span style={{fontSize:11,background:C.goldLight,color:C.gold,borderRadius:20,padding:'2px 8px'}}>{sel.length}/3</span>}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {displayOils.map(oil=>{
                const isSel=!!sel.find(o=>o.id===oil.id)
                const isDis=!isSel&&sel.length>=3
                const isHero=isSel&&sel.length>1&&oil.id===heroId
                return(
                  <button key={oil.id} onClick={()=>!isDis&&toggleOil(tier,oil)}
                    style={{padding:'6px 12px',borderRadius:24,fontSize:12.5,cursor:isDis?'not-allowed':'pointer',fontWeight:oil.maxDrops!==undefined?500:300,transition:'all 0.1s',background:isSel?(isHero?C.gold:C.dark):'#FFF',color:isSel?'white':isDis?'#CCC':C.dark,border:`1px solid ${isSel?(isHero?C.gold:C.dark):isDis?'#EEE':C.border}`,opacity:isDis?0.35:1}}>
                    {oil.name}
                  </button>
                )
              })}
            </div>

            {/* 전체 향료 보기 버튼 */}
            {!showAll[tier]&&pickedOils.length<allOilsForTier.length&&(
              <button onClick={()=>setShowAll(p=>({...p,[tier]:true}))}
                style={{marginTop:10,background:'none',border:`1px dashed ${C.border}`,borderRadius:20,padding:'5px 14px',fontSize:11,color:C.mid,cursor:'pointer',letterSpacing:'0.06em'}}>
                {isKo?`+ 전체 ${allOilsForTier.length}개 향료 보기`:`+ Browse all ${allOilsForTier.length} oils`}
              </button>
            )}
            {showAll[tier]&&(
              <button onClick={()=>setShowAll(p=>({...p,[tier]:false}))}
                style={{marginTop:10,background:'none',border:`1px dashed ${C.gold}60`,borderRadius:20,padding:'5px 14px',fontSize:11,color:C.gold,cursor:'pointer',letterSpacing:'0.06em'}}>
                {isKo?'내 픽만 보기':'Show my picks only'}
              </button>
            )}

            {sel.length>1&&(
              <div style={{marginTop:10,padding:'10px 14px',background:C.goldLight+'40',borderRadius:4,border:`1px solid ${C.goldLight}`}}>
                <div style={{fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:C.gold,marginBottom:7}}>{t.builder_hero}</div>
                <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                  {sel.map(oil=>(
                    <button key={oil.id} onClick={()=>setHeroes(h=>({...h,[tier]:oil.id}))}
                      style={{padding:'5px 12px',borderRadius:20,fontSize:12,cursor:'pointer',transition:'all 0.1s',background:oil.id===heroId?C.gold:'#FFF',color:oil.id===heroId?'white':C.mid,border:`1px solid ${oil.id===heroId?C.gold:C.border}`}}>
                      {oil.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      <div style={{marginBottom:28}}>
        <div style={{fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:C.mid,marginBottom:10}}>{t.builder_emp}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {t.emp.map(e=>(
            <button key={e.value} onClick={()=>setEmphasis(e.value)}
              style={{padding:'11px 14px',borderRadius:4,textAlign:'left',cursor:'pointer',transition:'all 0.12s',background:emphasis===e.value?C.dark:'#FFF',color:emphasis===e.value?'white':C.dark,border:`1px solid ${emphasis===e.value?C.dark:C.border}`}}>
              <div style={{fontSize:13,fontWeight:500}}>{e.label}</div>
              <div style={{fontSize:11,opacity:0.6,marginTop:2,fontWeight:300}}>{e.sub}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={onBuild} disabled={totalSel===0}
        style={{width:'100%',padding:15,border:'none',borderRadius:4,cursor:totalSel===0?'not-allowed':'pointer',fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',background:totalSel===0?C.border:C.dark,color:totalSel===0?C.mid:'white',transition:'all 0.2s',fontFamily:fB}}>
        {t.builder_btn}
      </button>
      <div style={{fontSize:10,color:'#B8A898',textAlign:'center',marginTop:8}}>{t.builder_hint}</div>
    </div>
  )
}
