import{C,fH,fK}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function PhotoConsent({onAnswer}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  return(
    <div className="screen-up" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{fontSize:40,marginBottom:20}}>📸</div>
      <div style={{fontFamily:fHead,fontSize:24,fontWeight:300,marginBottom:12,textAlign:'center'}}>{t.photo_title}</div>
      <div style={{fontSize:13,color:C.mid,marginBottom:48,textAlign:'center',lineHeight:1.7,maxWidth:300}}>{t.photo_sub}</div>
      <div style={{display:'flex',gap:12,width:'100%',maxWidth:320}}>
        <button onClick={()=>onAnswer(true)}
          style={{flex:1,padding:14,background:C.dark,color:'white',border:'none',borderRadius:6,fontSize:13,cursor:'pointer'}}>
          {t.photo_yes}
        </button>
        <button onClick={()=>onAnswer(false)}
          style={{flex:1,padding:14,background:'#FFF',color:C.mid,border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,cursor:'pointer'}}>
          {t.photo_no}
        </button>
      </div>
    </div>
  )
}
