import{C,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function Philosophy({onContinue}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:`'Cormorant Garamond',Georgia,serif`
  return(
    <div className="fade" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:48,opacity:0.7}}>Sok Studios</div>
      <div style={{maxWidth:360}}>
        <div style={{fontFamily:fHead,fontSize:lang==='ko'?22:20,fontWeight:300,color:C.goldLight,lineHeight:1.6,marginBottom:16,opacity:0.75,whiteSpace:'pre-line'}}>{t.phil_line1}</div>
        <div style={{fontFamily:fHead,fontSize:lang==='ko'?32:28,fontWeight:300,color:'white',lineHeight:1.3,marginBottom:24,whiteSpace:'pre-line'}}>{t.phil_line2}</div>
        <div style={{fontFamily:fHead,fontSize:lang==='ko'?18:16,fontStyle:'italic',color:C.goldLight,lineHeight:1.7,marginBottom:64,opacity:0.8}}>{t.phil_line3}</div>
      </div>
      <button onClick={onContinue}
        style={{padding:'14px 40px',background:'transparent',color:C.gold,border:`1px solid ${C.gold}60`,borderRadius:30,fontSize:13,letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.2s',fontFamily:fB}}
        onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color='white'}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.gold}}>
        {t.phil_btn}
      </button>
    </div>
  )
}
