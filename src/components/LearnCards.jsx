import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function LearnCards({onDone}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[idx,setIdx]=useState(0)
  const cards=t.cards
  const card=cards[idx]
  const isLast=idx===cards.length-1

  return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,lineHeight:1.1}}>{t.cards_title}</div>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:28}}>
        {cards.map((_,i)=>(
          <div key={i} onClick={()=>setIdx(i)}
            style={{height:3,flex:1,borderRadius:2,background:i<=idx?C.gold:C.border,cursor:'pointer',transition:'background 0.3s'}}/>
        ))}
      </div>
      <div className="fade" key={idx} style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:10,padding:'28px 24px',marginBottom:24,minHeight:180}}>
        <div style={{fontFamily:fHead,fontSize:20,fontWeight:400,marginBottom:16,lineHeight:1.3}}>{card.title}</div>
        <div style={{fontSize:14,color:C.mid,lineHeight:1.8}}>{card.body}</div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:11,color:'#B8A898'}}>{idx+1} {t.cards_of} {cards.length}</span>
        {isLast?(
          <button onClick={onDone}
            style={{padding:'12px 28px',background:C.dark,color:'white',border:'none',borderRadius:6,fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
            {t.cards_done}
          </button>
        ):(
          <button onClick={()=>setIdx(i=>i+1)}
            style={{padding:'12px 28px',background:C.dark,color:'white',border:'none',borderRadius:6,fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
            {t.cards_next}
          </button>
        )}
      </div>
    </div>
  )
}
