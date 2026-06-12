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
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,lineHeight:1.1}}>{t.cards_title}</div>
        <div style={{fontSize:11,color:C.mid,marginTop:6}}>{idx+1} {t.cards_of} {cards.length}</div>
      </div>
      <div style={{display:'flex',gap:4,marginBottom:24}}>
        {cards.map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=idx?C.gold:C.border,transition:'background 0.3s'}}/>
        ))}
      </div>
      <div key={idx} className="card-in" style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:12,padding:'28px 24px',marginBottom:32,minHeight:200}}>
        <div style={{fontFamily:fHead,fontSize:22,fontWeight:400,marginBottom:16}}>{card.title}</div>
        <div style={{fontSize:14,color:C.mid,lineHeight:1.8}}>{card.body}</div>
      </div>
      <button onClick={()=>isLast?onDone():setIdx(i=>i+1)}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {isLast?t.cards_done:t.cards_next}
      </button>
    </div>
  )
}
