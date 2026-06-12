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
  const[step,setStep]=useState('name') // name | saving | saved | review | cards_prompt
  const[reviewed,setReviewed]=useState(false)
  const isKo=lang==='ko'
  const empLabel=t.emp.find(e=>e.value===emphasis)?.label||emphasis
  const totalG=formula.oils.reduce((s,o)=>s+o.g,0)
  const totalDr=formula.oils.reduce((s,o)=>s+o.drops,0)

  const SCALE_FACTOR=scaleChoice==='50ml'||scaleChoice==='both'?22.5:15
  const SCALE_LABEL=scaleChoice==='50ml'||scaleChoice==='both'?t.final_scale_50:t.final_scale_30

  const doSave=async()=>{
    if(!perfumeName.trim())return
    setStep('saving')
    await saveFormula({clientName,clientEmail,emphasis,oils:formula.oils,warnings:formula.warnings,perfumeName,sampleNum})
    setTimeout(()=>setStep('saved'),1200)
  }

  // Step: Name (필수)
  if(step==='name')return(
    <div className="screen-up" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
      <div style={{fontFamily:fHead,fontSize:isKo?28:34,fontWeight:300,lineHeight:1.1,marginBottom:8,textAlign:'center'}}>{t.fname_title}</div>
      <div style={{fontSize:13,color:C.mid,marginBottom:12,textAlign:'center',lineHeight:1.7,maxWidth:320}}>{t.fname_sub}</div>
      <div style={{fontSize:11,color:C.gold,marginBottom:32,textAlign:'center'}}>{t.fname_label_note}</div>
      <input value={perfumeName} onChange={e=>setPerfumeName(e.target.value.slice(0,20))}
        onKeyDown={e=>e.key==='Enter'&&perfumeName.trim()&&doSave()}
        placeholder={t.fname_ph} autoFocus maxLength={20}
        style={{width:'100%',maxWidth:340,padding:'14px 18px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:16,outline:'none',background:'#FFF',color:C.dark,textAlign:'center',fontFamily:fHead,fontStyle:perfumeName?'italic':'normal'}}
        onFocus={e=>e.target.style.borderColor=C.gold}
        onBlur={e=>e.target.style.borderColor=C.border}/>
      <div style={{fontSize:11,color:'#B8A898',marginTop:6,marginBottom:4}}>{perfumeName.length}/20 · {t.fname_limit}</div>
      <div style={{fontSize:11,color:C.mid,marginBottom:28}}>{t.fname_crafted} {clientName}</div>
      <button onClick={doSave} disabled={!perfumeName.trim()}
        style={{width:'100%',maxWidth:340,padding:15,background:perfumeName.trim()?C.dark:C.border,color:perfumeName.trim()?'white':C.mid,border:'none',borderRadius:6,fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',cursor:perfumeName.trim()?'pointer':'not-allowed',transition:'all 0.2s',fontFamily:fB}}>
        {t.fname_btn}
      </button>
    </div>
  )

  // Step: Saving
  if(step==='saving')return(
    <div className="fade" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{width:48,height:48,border:`2px solid ${C.gold}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:32}}/>
      <div style={{fontFamily:fHead,fontSize:isKo?20:18,fontWeight:300,color:'white',lineHeight:1.6}}>
        {isKo?`${perfumeName}\n레시피가 저장되고 있어요...`:`Saving your recipe\n${perfumeName}...`}
      </div>
    </div>
  )

  // Step: Saved — formula display
  if(step==='saved')return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:28,padding:'28px 20px',background:C.dark,borderRadius:12}}>
        <div style={{fontFamily:fHead,fontSize:11,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:10}}>Your Signature Formula</div>
        <div style={{fontFamily:fHead,fontSize:32,fontStyle:'italic',fontWeight:300,color:'white',marginBottom:6}}>{perfumeName}</div>
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
        </div>
      )}
      <div className="fade" style={{background:C.goldLight+'50',border:`1px solid ${C.goldLight}`,borderRadius:8,padding:'14px 18px',marginBottom:20,textAlign:'center'}}>
        <div style={{fontSize:14,color:C.dark,marginBottom:4}}>✓ {t.final_saved_msg}</div>
        <div style={{fontSize:12,color:C.mid}}>{t.final_year}</div>
      </div>

      {/* 별점 팝업 */}
      <div style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:10,padding:'20px',marginBottom:12,textAlign:'center'}}>
        <div style={{fontFamily:fHead,fontSize:16,fontWeight:300,marginBottom:6}}>
          {isKo?'오늘 경험이 어떠셨나요?':'How was your experience today?'}
        </div>
        <div style={{fontSize:12,color:C.mid,marginBottom:16}}>
          {isKo?'잠깐 시간을 내어 Sok Studios를 도와주시겠어요?':'Could you spare a moment to help Sok Studios?'}
        </div>
        <button onClick={()=>{window.open(GOOGLE_REVIEW_URL,'_blank');setReviewed(true)}}
          style={{width:'100%',padding:13,border:`1px solid ${C.border}`,borderRadius:6,cursor:'pointer',fontSize:13,background:reviewed?C.goldLight+'60':'#FFF',color:reviewed?C.gold:C.dark,transition:'all 0.2s',fontFamily:fHead}}>
          {reviewed?(isKo?'감사해요! 💛':'Thank you so much! 💛'):(isKo?'리뷰 남기기 ⭐':'Leave a review ⭐')}
        </button>
      </div>

      <button onClick={onCards}
        style={{width:'100%',padding:14,background:'none',color:C.mid,border:`1px solid ${C.border}`,borderRadius:6,cursor:'pointer',fontSize:12,letterSpacing:'0.1em',fontFamily:fB,marginBottom:10}}>
        {isKo?'오늘 배운 것들 보기 →':'See what you learned today →'}
      </button>
    </div>
  )

  return null
}
