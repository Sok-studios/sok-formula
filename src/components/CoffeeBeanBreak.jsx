import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function CoffeeBeanBreak({onContinue}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  return(
    <div className="screen-up" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{fontSize:64,marginBottom:28}}>☕</div>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:10,opacity:0.8}}>Sok Studios</div>
      <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,color:'white',marginBottom:16,textAlign:'center'}}>{t.coffee_title}</div>
      <div style={{fontSize:13,color:C.goldLight,opacity:0.8,marginBottom:48,textAlign:'center',lineHeight:1.7,whiteSpace:'pre-line',maxWidth:320}}>{t.coffee_sub}</div>
      <button onClick={onContinue} style={{padding:'14px 32px',background:C.gold,color:'white',border:'none',borderRadius:30,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>{t.coffee_btn}</button>
    </div>
  )
}
