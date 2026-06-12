import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import{TIERS,TOTAL_DROPS,DROP}from'../data/oils.js'

export default function Result({formula,clientName,emphasis,sampleNum,onEdit,onAdjust,onMix}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[showEdit,setShowEdit]=useState(false)
  const[editDrops,setEditDrops]=useState(()=>{const m={};formula.oils.forEach(o=>{m[o.id]=o.drops});return m})
  const empLabel=t.emp.find(e=>e.value===emphasis)?.label||emphasis
  const totalG=formula.oils.reduce((s,o)=>s+o.g,0)
  const totalDr=formula.oils.reduce((s,o)=>s+o.drops,0)
  const editTotal=Object.values(editDrops).reduce((s,v)=>s+(parseInt(v)||0),0)
  const editValid=editTotal===TOTAL_DROPS

  const saveEdit=()=>{
    const updated=formula.oils.map(o=>({...o,drops:parseInt(editDrops[o.id])||0,g:parseFloat(((parseInt(editDrops[o.id])||0)*DROP).toFixed(3)),pct:Math.round(((parseInt(editDrops[o.id])||0)/TOTAL_DROPS)*100)}))
    onAdjust(updated);setShowEdit(false)
  }

  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <button onClick={onEdit} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',fontFamily:fB}}>{t.result_edit}</button>
        <div style={{fontSize:11,background:C.goldLight,color:C.gold,borderRadius:20,padding:'4px 12px'}}>{t.result_sample} {sampleNum}</div>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:28,fontWeight:300}}>{clientName}</div>
        <div style={{fontSize:11,color:C.mid,marginTop:2}}>{new Date().toLocaleDateString('en-NZ',{day:'numeric',month:'long',year:'numeric'})} · {empLabel}</div>
      </div>
      {TIERS.map(tier=>{
        const tLabel={top:t.note_top,middle:t.note_mid,base:t.note_base}[tier]
        const tOils=formula.oils.filter(o=>o.tier===tier.charAt(0).toUpperCase()+tier.slice(1))
        if(!tOils.length)return null
        const tDrops=tOils.reduce((s,o)=>s+o.drops,0)
        const tPct=Math.round((tDrops/TOTAL_DROPS)*100)
        return(
          <div key={tier} style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <span style={{fontFamily:fHead,fontSize:18,fontStyle:'italic'}}>{tLabel} Note</span>
              <span style={{fontSize:11,color:C.gold}}>{tPct}% · {tDrops} {t.result_drops}</span>
            </div>
            <div style={{height:2,background:C.border,borderRadius:2,marginBottom:8,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${tPct}%`,background:C.gold}}/>
            </div>
            {tOils.map(oil=>(
              <div key={oil.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:oil.isHero?C.goldLight+'55':'#FFF',borderRadius:4,border:`1px solid ${oil.isHero?C.gold+'55':C.border}`,marginBottom:5}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  {oil.isHero&&<span style={{fontSize:9,color:C.gold,textTransform:'uppercase',fontWeight:500}}>{t.main_label}</span>}
                  <span style={{fontSize:14}}>{oil.name}</span>
                  {oil.isCapped&&<span style={{fontSize:9,color:C.red}}>MAX</span>}
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:3,justifyContent:'flex-end'}}>
                    <span style={{fontFamily:fHead,fontSize:22}}>{oil.g.toFixed(3)}</span>
                    <span style={{fontSize:10,color:C.mid}}>g</span>
                  </div>
                  <div style={{fontSize:10,color:'#B0A090'}}>{oil.drops} {t.result_drops}</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}
      {formula.warnings?.length>0&&(
        <div style={{background:'#FFF7F4',border:`1px solid ${C.red}40`,borderRadius:4,padding:'10px 14px',marginBottom:14}}>
          {formula.warnings.map((w,i)=><div key={i} style={{fontSize:12,color:C.red,lineHeight:1.65}}>⚠ {w}</div>)}
        </div>
      )}
      <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderTop:`1px solid ${C.border}`,marginBottom:14}}>
        <span style={{fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid}}>{t.result_total}</span>
        <div style={{display:'flex',alignItems:'baseline',gap:3}}>
          <span style={{fontFamily:fHead,fontSize:24}}>{totalG.toFixed(3)}</span>
          <span style={{fontSize:11,color:C.mid}}>g · {totalDr} {t.result_drops}</span>
        </div>
      </div>
      <button onClick={()=>setShowEdit(v=>!v)}
        style={{width:'100%',padding:'10px',background:'#FFF',color:C.mid,border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,cursor:'pointer',marginBottom:14,letterSpacing:'0.1em',fontFamily:fB}}>
        ✏ {t.result_edit_btn}
      </button>
      {showEdit&&(
        <div className="fade" style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:8,padding:'16px',marginBottom:16}}>
          <div style={{fontSize:12,color:C.mid,marginBottom:14}}>{t.result_adj_sub}</div>
          {formula.oils.map(oil=>(
            <div key={oil.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:13,flex:1}}>{oil.name}</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <button onClick={()=>setEditDrops(p=>({...p,[oil.id]:Math.max(0,(parseInt(p[oil.id])||0)-1)}))} style={{width:28,height:28,border:`1px solid ${C.border}`,borderRadius:4,background:'#FFF',fontSize:16,cursor:'pointer'}}>−</button>
                <span style={{fontFamily:fHead,fontSize:18,minWidth:30,textAlign:'center'}}>{editDrops[oil.id]||0}</span>
                <button onClick={()=>setEditDrops(p=>({...p,[oil.id]:(parseInt(p[oil.id])||0)+1}))} style={{width:28,height:28,border:`1px solid ${C.border}`,borderRadius:4,background:'#FFF',fontSize:16,cursor:'pointer'}}>+</button>
                <span style={{fontSize:11,color:C.mid,minWidth:50}}>{((editDrops[oil.id]||0)*0.02).toFixed(3)}g</span>
              </div>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderTop:`1px solid ${C.border}`,marginBottom:12}}>
            <span style={{fontSize:12,color:C.mid}}>Total</span>
            <span style={{fontFamily:fHead,fontSize:18,color:editValid?C.dark:C.red}}>{editTotal} / 100 drops</span>
          </div>
          {!editValid&&<div style={{fontSize:11,color:C.red,marginBottom:10,textAlign:'center'}}>{t.result_adj_warn}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <button onClick={saveEdit} disabled={!editValid} style={{padding:12,background:editValid?C.dark:C.border,color:editValid?'white':C.mid,border:'none',borderRadius:6,fontSize:12,cursor:editValid?'pointer':'not-allowed',letterSpacing:'0.1em',fontFamily:fB}}>{t.result_adj_save}</button>
            <button onClick={()=>setShowEdit(false)} style={{padding:12,background:'#FFF',color:C.dark,border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,cursor:'pointer',fontFamily:fB}}>{t.result_adj_cancel}</button>
          </div>
        </div>
      )}
      <button onClick={onMix}
        style={{width:'100%',padding:15,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {t.result_save}
      </button>
    </div>
  )
}
