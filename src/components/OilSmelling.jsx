import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

// 같은 계열에서 진해지는 색상 (연한 골드 → 짙은 브라운) - 검정 제외
const SCALE_COLORS=['#EEE2C8','#D4BC82','#C4953A','#9A6E2A','#7A4E1A']
const MAX_SELECT=7

export default function OilSmelling({tier,oils,onContinue,onBack}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[selected,setSelected]=useState([]) // oil ids
  const[ratings,setRatings]=useState({}) // {oilId: 1-5}
  const[showRating,setShowRating]=useState(null) // oilId currently showing rating picker

  const titles={top:t.smell_top_title,middle:t.smell_mid_title,base:t.smell_base_title}
  const continueLabel=tier==='top'?t.smell_continue_mid:tier==='middle'?t.smell_continue_base:t.smell_continue_done

  const toggleSelect=oilId=>{
    setSelected(prev=>{
      if(prev.includes(oilId)){
        // deselect: remove rating too
        setRatings(r=>{const n={...r};delete n[oilId];return n})
        setShowRating(s=>s===oilId?null:s)
        return prev.filter(id=>id!==oilId)
      }
      if(prev.length>=MAX_SELECT)return prev
      // select: immediately show rating
      setShowRating(oilId)
      return[...prev,oilId]
    })
  }

  const setRating=(oilId,level)=>{
    setRatings(prev=>({...prev,[oilId]:level}))
    setShowRating(null)
  }

  const handleContinue=()=>onContinue(ratings)

  const selectedOils=oils.filter(o=>selected.includes(o.id))
  const isKo=lang==='ko'

  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 120px',color:C.dark,minHeight:'100vh'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:16,fontFamily:fB}}>{t.back}</button>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:32,fontWeight:300,lineHeight:1}}>{titles[tier]}</div>
        <div style={{fontSize:12,color:C.mid,marginTop:6}}>
          {isKo?`끌리는 향을 탭해요 — ${selected.length}/${MAX_SELECT}`:`Tap to select & rate — ${selected.length}/${MAX_SELECT}`}
        </div>
      </div>

      {/* Rating overlay modal */}
      {showRating&&(()=>{
        const oil=oils.find(o=>o.id===showRating)
        if(!oil)return null
        return(
          <div className="fade" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
            onClick={e=>{if(e.target===e.currentTarget)setShowRating(null)}}>
            <div style={{background:'#FFF',borderRadius:'16px 16px 0 0',padding:'28px 24px 40px',width:'100%',maxWidth:500}}>
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontFamily:fHead,fontSize:22,fontWeight:400,color:C.dark,marginBottom:6}}>{oil.name}</div>
                <div style={{fontSize:12,color:C.mid}}>{isKo?'얼마나 마음에 들어요?':'How much do you like it?'}</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.mid,marginBottom:12,letterSpacing:'0.04em',padding:'0 4px'}}>
                <span>{isKo?'별로예요':'Not for me'}</span>
                <span>{isKo?'완전 내 취향':'Perfect for me'}</span>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                {[1,2,3,4,5].map(level=>(
                  <button key={level} onClick={()=>setRating(showRating,level)}
                    style={{flex:1,height:52,borderRadius:8,border:'none',background:SCALE_COLORS[level-1],cursor:'pointer',transition:'all 0.1s',transform:'scale(1)',position:'relative'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                    <span style={{position:'absolute',bottom:4,right:6,fontSize:9,color:'rgba(0,0,0,0.35)',fontFamily:fHead}}>{level}</span>
                  </button>
                ))}
              </div>
              <button onClick={()=>setShowRating(null)}
                style={{width:'100%',padding:'10px',background:'none',border:'none',color:'#B8A898',fontSize:12,cursor:'pointer',marginTop:4,fontFamily:fHead}}>
                {isKo?'지금은 건너뛸게요':'Skip for now'}
              </button>
            </div>
          </div>
        )
      })()}

      {/* Selected oils with ratings */}
      {selectedOils.length>0&&(
        <div className="fade" style={{background:C.goldLight+'40',border:`1px solid ${C.goldLight}`,borderRadius:8,padding:'12px 14px',marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:C.gold,marginBottom:8}}>
            {isKo?`${selectedOils.length}개 선택됨`:`${selectedOils.length} selected`}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {selectedOils.map(oil=>{
              const r=ratings[oil.id]
              return(
                <button key={oil.id} onClick={()=>r?setShowRating(oil.id):toggleSelect(oil.id)}
                  style={{padding:'5px 10px',borderRadius:20,fontSize:12,cursor:'pointer',background:r?SCALE_COLORS[r-1]:C.dark,color:r&&r<3?C.dark:'white',border:'none',display:'flex',alignItems:'center',gap:5}}>
                  {oil.name}
                  {r&&<span style={{fontSize:10,opacity:0.7}}>{'★'.repeat(r)}</span>}
                  <span style={{fontSize:10,opacity:0.5}} onClick={e=>{e.stopPropagation();toggleSelect(oil.id)}}>✕</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* All oils grid */}
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:28}}>
        {oils.map(oil=>{
          const isSel=selected.includes(oil.id)
          const isDis=!isSel&&selected.length>=MAX_SELECT
          const r=ratings[oil.id]
          return(
            <button key={oil.id} onClick={()=>{if(!isDis){if(isSel&&r)setShowRating(oil.id);else toggleSelect(oil.id)}}}
              style={{
                padding:'10px 16px',borderRadius:24,cursor:isDis?'not-allowed':'pointer',
                transition:'all 0.1s',opacity:isDis?0.3:1,
                background:isSel?(r?SCALE_COLORS[r-1]:C.dark):'#FFF',
                color:isSel?(r&&r<3?C.dark:'white'):C.dark,
                border:`1px solid ${isSel?(r?SCALE_COLORS[r-1]:C.dark):C.border}`,
                fontSize:15,fontWeight:400,
              }}>
              {oil.name}
            </button>
          )
        })}
      </div>

      <button onClick={handleContinue}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {continueLabel}
      </button>
      {selected.length===0&&(
        <div style={{fontSize:11,color:'#B8A898',textAlign:'center',marginTop:10}}>
          {isKo?'선택 없이도 넘어갈 수 있어요':'You can continue without selecting'}
        </div>
      )}
    </div>
  )
}
