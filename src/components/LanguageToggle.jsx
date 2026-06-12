import{useLang}from'../context/LangContext.jsx'
import{LANG_OPTIONS}from'../data/translations.js'
import{C}from'../lib/theme.js'

export default function LanguageToggle({fixed=true}){
  const{lang,setLang}=useLang()
  const style=fixed?{position:'fixed',top:14,right:14,zIndex:200}:{display:'inline-flex'}
  return(
    <div style={{...style,display:'flex',gap:2,background:'white',borderRadius:20,padding:'3px 6px',border:`1px solid ${C.border}`,boxShadow:fixed?'0 2px 8px rgba(0,0,0,0.08)':undefined}}>
      {LANG_OPTIONS.map(opt=>(
        <button key={opt.code} onClick={()=>setLang(opt.code)}
          style={{padding:'3px 9px',borderRadius:16,fontSize:11,cursor:'pointer',fontWeight:500,border:'none',transition:'all 0.15s',background:lang===opt.code?C.dark:'none',color:lang===opt.code?'white':C.mid}}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
