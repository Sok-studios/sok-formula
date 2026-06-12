import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function BlindSmelling({vialOrder,onDone,onBack}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[selected,setSelected]=useState(new Set())
  const toggle=n=>{setSelected(prev=>{const s=new Set([...prev]);s.has(n)?s.delete(n):s.add(n);return s})}
  const handleDone=()=>{const families=[...selected].sort((a,b)=>a-b).map(n=>vialOrder[n-1]).filter(Boolean);onDone(families)}
  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:16,fontFamily:fB}}>{t.back}</button>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios · {t.blind_step}</div>
        <div style={{fontFamily:fHead,fontSize:34,fontWeight:300,lineHeight:1.1,marginBottom:12}}>{t.blind_title}</div>
        <div style={{fontSize:13,color:C.mid,lineHeight:1.7,whiteSpace:'pre-line'}}>{t.blind_sub}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
        {Array.from({length:vialOrder.length},(_,i)=>i+1).map(num=>{
          const sel=selected.has(num)
          return(
            <button key={num} onClick={()=>toggle(num)}
              style={{aspectRatio:'1',borderRadius:16,border:`2px solid ${sel?C.gold:C.border}`,background:sel?C.dark:'#FFF',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.15s',transform:sel?'scale(1.05)':'scale(1)'}}>
              <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,color:sel?C.gold:C.mid}}>{num}</div>
              {sel&&<div style={{fontSize:14,color:C.gold}}>✓</div>}
            </button>
          )
        })}
      </div>
      {selected.size>0&&<div className="fade" style={{fontSize:12,color:C.gold,textAlign:'center',marginBottom:16}}>{selected.size} {t.blind_step.includes('2')?'선택됨':'selected'}</div>}
      <button onClick={handleDone} disabled={selected.size===0}
        style={{width:'100%',padding:16,border:'none',borderRadius:8,background:selected.size>0?C.dark:C.border,color:selected.size>0?'white':C.mid,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:selected.size>0?'pointer':'not-allowed',transition:'all 0.2s',fontFamily:fB}}>
        {t.blind_btn}
      </button>
      <div style={{fontSize:11,color:'#B8A898',textAlign:'center',marginTop:12}}>{t.blind_hint}</div>
    </div>
  )
}
