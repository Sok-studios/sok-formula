import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

const SCALE_COLORS=['#EEE2C8','#D4B96A','#C4953A','#9A7A42','#231410']
const MAX_SELECT=7

export default function OilSmelling({tier,oils,onContinue,onBack}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[phase,setPhase]=useState('select') // select | rate
  const[selected,setSelected]=useState([]) // oil ids in order selected
  const[ratings,setRatings]=useState({}) // {oilId: 1-5}

  const titles={top:t.smell_top_title,middle:t.smell_mid_title,base:t.smell_base_title}
  const continueLabel=tier==='top'?t.smell_continue_mid:tier==='middle'?t.smell_continue_base:t.smell_continue_done

  const toggleSelect=oilId=>{
    setSelected(prev=>{
      if(prev.includes(oilId))return prev.filter(id=>id!==oilId)
      if(prev.length>=MAX_SELECT)return prev
      return[...prev,oilId]
    })
  }

  const handleContinue=()=>{
    if(phase==='select'){
      if(selected.length>0)setPhase('rate')
      else onContinue({})
    } else {
      onContinue(ratings)
    }
  }

  const selectedOils=oils.filter(o=>selected.includes(o.id))

  if(phase==='select') return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:16,fontFamily:fB}}>{t.back}</button>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:32,fontWeight:300,lineHeight:1}}>{titles[tier]}</div>
        <div style={{fontSize:12,color:C.mid,marginTop:6}}>{t.smell_select_hint} · {selected.length}/{MAX_SELECT}</div>
      </div>

      {/* Selected oils pinned at top */}
      {selected.length>0&&(
        <div className="fade" style={{background:C.goldLight+'40',border:`1px solid ${C.goldLight}`,borderRadius:8,padding:'12px 14px',marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:C.gold,marginBottom:8}}>{selected.length} {t.smell_selected_count}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {selectedOils.map(oil=>(
              <button key={oil.id} onClick={()=>toggleSelect(oil.id)}
                style={{padding:'5px 12px',borderRadius:20,fontSize:12,cursor:'pointer',background:C.dark,color:'white',border:'none'}}>
                {oil.name} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All oils */}
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:28}}>
        {oils.map(oil=>{
          const isSel=selected.includes(oil.id)
          const isDis=!isSel&&selected.length>=MAX_SELECT
          return(
            <button key={oil.id} onClick={()=>!isDis&&toggleSelect(oil.id)}
              style={{
                padding:'10px 16px',borderRadius:24,cursor:isDis?'not-allowed':'pointer',
                transition:'all 0.1s',opacity:isDis?0.3:1,
                background:isSel?C.dark:'#FFF',
                color:isSel?'white':C.dark,
                border:`1px solid ${isSel?C.dark:C.border}`,
                fontSize:15,fontWeight:400,
              }}>
              {oil.name}
            </button>
          )
        })}
      </div>

      <button onClick={handleContinue}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {selected.length>0?t.smell_rate_btn:continueLabel}
      </button>
      {selected.length===0&&<div style={{fontSize:11,color:'#B8A898',textAlign:'center',marginTop:10}}>{lang==='ko'?'선택 없이도 넘어갈 수 있어요':'You can continue without selecting'}
      </div>}
    </div>
  )

  // Rating phase
  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <button onClick={()=>setPhase('select')} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:16,fontFamily:fB}}>{t.smell_back_select}</button>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:30,fontWeight:300,lineHeight:1}}>{t.smell_rate_title}</div>
        <div style={{fontSize:12,color:C.mid,marginTop:6}}>{Object.keys(ratings).length} {t.smell_rated} / {selectedOils.length}</div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.mid,marginBottom:20,letterSpacing:'0.06em'}}>
        <span>{t.smell_scale_no}</span><span>{t.smell_scale_yes}</span>
      </div>

      {selectedOils.map(oil=>{
        const rating=ratings[oil.id]
        return(
          <div key={oil.id} style={{background:'#FFF',border:`1px solid ${rating?C.gold+'55':C.border}`,borderRadius:8,padding:'16px',marginBottom:12,transition:'border-color 0.2s'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <span style={{fontSize:18,fontWeight:400,color:C.dark}}>{oil.name}</span>
              {rating&&<div style={{width:8,height:8,borderRadius:'50%',background:SCALE_COLORS[rating-1]}}/>}
            </div>
            <div style={{display:'flex',gap:6}}>
              {[1,2,3,4,5].map(level=>(
                <button key={level} onClick={()=>setRatings(prev=>({...prev,[oil.id]:level}))}
                  style={{flex:1,height:40,borderRadius:6,border:`2px solid ${rating===level?'#000':'transparent'}`,background:SCALE_COLORS[level-1],cursor:'pointer',transition:'all 0.1s',transform:rating===level?'scale(1.08)':'scale(1)'}}/>
              ))}
            </div>
          </div>
        )
      })}

      <button onClick={handleContinue}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',marginTop:8,fontFamily:fB}}>
        {continueLabel}
      </button>
    </div>
  )
}
