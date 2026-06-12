import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import{TIERS,TOTAL_DROPS}from'../data/oils.js'
import{saveFormula}from'../lib/supabase.js'

const GOOGLE_REVIEW_URL='https://g.page/r/CYstTYxeAPArEAE/review'

export default function FinalResult({formula,clientName,clientEmail,emphasis,sampleNum,scaleChoice,onNew,onCards}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[perfumeName,setPerfumeName]=useState('')
  const[step,setStep]=useState('name')
  const[saved,setSaved]=useState(false)
  const[saving,setSaving]=useState(false)
  const[reviewed,setReviewed]=useState(false)
  const empLabel=t.emp.find(e=>e.value===emphasis)?.label||emphasis
  const totalG=formula.oils.reduce((s,o)=>s+o.g,0)
  const totalDr=formula.oils.reduce((s,o)=>s+o.drops,0)

  const doSave=async()=>{
    setSaving(true)
    await saveFormula({clientName,clientEmail,emphasis,oils:formula.oils,warnings:formula.warnings,perfumeName,sampleNum})
    setSaving(false);setSaved(true)
  }

  const SCALE_FACTOR=scaleChoice==='50ml'||scaleChoice==='both'?22.5:15
  const SCALE_LABEL=scaleChoice==='50ml'||scaleChoice==='both'?t.final_scale_50:t.final_scale_30

  if(step==='name')return(
    <div className="screen-up" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
      <div style={{fontFamily:fHead,fontSize:lang==='ko'?28:34,fontWeight:300,lineHeight:1.1,marginBottom:8,textAlign:'center'}}>{t.fname_title}</div>
      <div style={{fontSize:13,color:C.mid,marginBottom:12,textAlign:'center',lineHeight:1.7,maxWidth:320}}>{t.fname_sub}</div>
      <div style={{fontSize:11,color:C.gold,marginBottom:32,textAlign:'center'}}>{t.fname_label_note} {t.fname_char_note}</div>
      <input value={perfumeName} onChange={e=>setPerfumeName(e.target.value.slice(0,20))} onKeyDown={e=>e.key==='Enter'&&perfumeName.trim()&&setStep('formula')}
        placeholder={t.fname_ph} autoFocus maxLength={20}
        style={{width:'100%',maxWidth:340,padding:'14px 18px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:16,outline:'none',background:'#FFF',color:C.dark,textAlign:'center',fontFamily:fHead,fontStyle:perfumeName?'italic':'normal'}}
        onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/>
      <div style={{fontSize:11,color:'#B8A898',marginTop:6,marginBottom:4}}>{perfumeName.length}/20 · {t.fname_limit}</div>
      <div style={{fontSize:11,color:C.mid,marginBottom:28}}>{t.fname_crafted} {clientName}</div>
      <button onClick={()=>setStep('formula')} disabled={!perfumeName.trim()}
        style={{width:'100%',maxWidth:340,padding:15,background:perfumeName.trim()?C.dark:C.border,color:perfumeName.trim()?'white':C.mid,border:'none',borderRadius:6,fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',cursor:perfumeName.trim()?'pointer':'not-allowed',transition:'all 0.2s',fontFamily:fB}}>
        {t.fname_btn}
      </button>
      <button onClick={()=>setStep('formula')} style={{marginTop:12,background:'none',border:'none',color:'#B8A898',fontSize:12,cursor:'pointer',fontFamily:fB}}>{t.fname_skip}</button>
    </div>
  )

  return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:28,padding:'28px 20px',background:C.dark,borderRadius:12}}>
        <div style={{fontFamily:fHead,fontSize:11,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:10}}>Your Signature Formula</div>
        {perfumeName&&<div style={{fontFamily:fHead,fontSize:32,fontStyle:'italic',fontWeight:300,color:'white',marginBottom:6}}>{perfumeName}</div>}
        <div style={{fontFamily:fHead,fontSize:18,fontWeight:300,color:C.goldLight,opacity:0.8}}>{t.fname_crafted} {clientName}</div>
        <div style={{fontSize:11,color:C.goldLight,opacity:0.6,marginTop:4}}>{t.result_sample} {sampleNum} · {empLabel}</div>
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
              <span style={{fontSize:11,color:C.gold}}>{tPct}%</span>
            </div>
            <div style={{height:2,background:C.border,borderRadius:2,marginBottom:8,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${tPct}%`,background:C.gold}}/>
            </div>
            {tOils.map(oil=>(
              <div key={oil.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:oil.isHero?C.goldLight+'55':'#FFF',borderRadius:4,border:`1px solid ${oil.isHero?C.gold+'55':C.border}`,marginBottom:5}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  {oil.isHero&&<span style={{fontSize:9,color:C.gold,textTransform:'uppercase'}}>{t.main_label}</span>}
                  <span style={{fontSize:14}}>{oil.name}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:3}}>
                    <span style={{fontFamily:fHead,fontSize:22}}>{oil.g.toFixed(3)}</span>
                    <span style={{fontSize:10,color:C.mid}}>g</span>
                  </div>
                  <div style={{fontSize:10,color:'#B0A090'}}>{oil.drops} drops</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}
      <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderTop:`1px solid ${C.border}`,marginBottom:20}}>
        <span style={{fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid}}>{t.result_total}</span>
        <div style={{display:'flex',alignItems:'baseline',gap:3}}>
          <span style={{fontFamily:fHead,fontSize:24}}>{totalG.toFixed(3)}</span>
          <span style={{fontSize:11,color:C.mid}}>g · {totalDr} drops</span>
        </div>
      </div>
      {scaleChoice&&(
        <div className="fade" style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:4,padding:'14px 16px',marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:C.gold,marginBottom:10}}>{SCALE_LABEL}</div>
          {formula.oils.map(oil=>(
            <div key={oil.id} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13}}>{oil.name}</span>
              <div style={{display:'flex',alignItems:'baseline',gap:3}}>
                <span style={{fontFamily:fHead,fontSize:18}}>{(oil.g*SCALE_FACTOR).toFixed(3)}</span>
                <span style={{fontSize:10,color:C.mid}}>g</span>
              </div>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:8}}>
            <span style={{fontSize:12,color:C.mid}}>Total</span>
            <div style={{display:'flex',alignItems:'baseline',gap:3}}>
              <span style={{fontFamily:fHead,fontSize:20}}>{(totalG*SCALE_FACTOR).toFixed(3)}</span>
              <span style={{fontSize:10,color:C.mid}}>g</span>
            </div>
          </div>
        </div>
      )}
      {saved&&(
        <div className="fade" style={{background:C.goldLight+'50',border:`1px solid ${C.goldLight}`,borderRadius:8,padding:'14px 18px',marginBottom:16,textAlign:'center'}}>
          <div style={{fontSize:14,color:C.dark,marginBottom:4}}>✓ {t.final_saved_msg}</div>
          <div style={{fontSize:12,color:C.mid}}>{t.final_year}</div>
        </div>
      )}
      <button onClick={doSave} disabled={saved||saving}
        style={{width:'100%',padding:14,marginBottom:10,border:'none',borderRadius:6,cursor:saved?'default':'pointer',fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',background:saved?C.goldLight:C.dark,color:saved?C.gold:'white',fontFamily:fB}}>
        {saving?'...' : saved?t.final_saved_btn:t.final_save_btn}
      </button>
      <button onClick={()=>{window.open(GOOGLE_REVIEW_URL,'_blank');setReviewed(true)}}
        style={{width:'100%',padding:14,marginBottom:10,border:`1px solid ${C.border}`,borderRadius:6,cursor:'pointer',fontSize:13,background:reviewed?C.goldLight+'60':'#FFF',color:reviewed?C.gold:C.dark,transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:fB}}>
        {reviewed?t.final_reviewed:t.final_review_btn}
      </button>
      <button onClick={onCards}
        style={{width:'100%',padding:14,background:'none',color:C.mid,border:`1px solid ${C.border}`,borderRadius:6,cursor:'pointer',fontSize:12,letterSpacing:'0.1em',fontFamily:fB,marginBottom:10}}>
        {lang==='ko'?'오늘 배운 것들 보기 →':'See what you learned today →'}
      </button>
      <button onClick={onNew} style={{width:'100%',padding:14,background:'none',color:'#B0A090',border:'none',cursor:'pointer',fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:fB}}>{t.final_new}</button>
    </div>
  )
}
