import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import LanguageToggle from'./LanguageToggle.jsx'

export default function NameInput({onContinue}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const valid=name.trim()&&email.trim()&&email.includes('@')
  return(
    <div className="screen" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{position:'absolute',top:16,right:16}}><LanguageToggle fixed={false}/></div>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:16}}>Sok Studios</div>
      <div style={{fontFamily:fHead,fontSize:lang==='ko'?28:34,fontWeight:300,lineHeight:1.1,marginBottom:12,textAlign:'center'}}>{t.name_title}</div>
      <div style={{fontSize:13,color:C.mid,marginBottom:40,textAlign:'center'}}>{t.name_sub}</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder={t.name_ph} autoFocus
        style={{width:'100%',maxWidth:320,padding:'14px 18px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:15,outline:'none',background:'#FFF',color:C.dark,textAlign:'center',marginBottom:10}}
        onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.email_ph} type="email"
        onKeyDown={e=>e.key==='Enter'&&valid&&onContinue(name.trim(),email.trim())}
        style={{width:'100%',maxWidth:320,padding:'14px 18px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:15,outline:'none',background:'#FFF',color:C.dark,textAlign:'center',marginBottom:6}}
        onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/>
      <div style={{fontSize:11,color:'#B8A898',marginBottom:28}}>{t.email_note}</div>
      <button onClick={()=>valid&&onContinue(name.trim(),email.trim())} disabled={!valid}
        style={{width:'100%',maxWidth:320,padding:15,background:valid?C.dark:C.border,color:valid?'white':C.mid,border:'none',borderRadius:6,fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',cursor:valid?'pointer':'not-allowed',transition:'all 0.2s',fontFamily:fB}}>
        {t.start_btn}
      </button>
    </div>
  )
}
