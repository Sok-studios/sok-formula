import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function ScaleChoice({onChoose}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[choice,setChoice]=useState(null)
  const options=[
    {id:'30ml',label:t.scale_30_label,note:t.scale_30_note,highlight:false},
    {id:'50ml',label:t.scale_50_label,note:t.scale_50_note,highlight:false},
    {id:'both',label:t.scale_both_label,note:t.scale_both_note,highlight:true},
  ]
  return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:32,fontWeight:300,lineHeight:1.1,marginBottom:8}}>{t.scale_title}</div>
        <div style={{fontSize:13,color:C.mid}}>{t.scale_sub}</div>
      </div>
      {options.map(opt=>(
        <button key={opt.id} onClick={()=>setChoice(opt.id)}
          style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 20px',background:choice===opt.id?C.dark:'#FFF',border:`1px solid ${choice===opt.id?C.dark:opt.highlight?C.goldLight:C.border}`,borderRadius:8,marginBottom:10,cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
          <div>
            <div style={{fontSize:16,fontWeight:500,color:choice===opt.id?'white':C.dark,fontFamily:fB}}>{opt.label}</div>
            {opt.highlight&&choice!==opt.id&&<div style={{fontSize:11,color:C.gold,marginTop:3}}>★ Popular</div>}
          </div>
          <div style={{fontSize:15,fontWeight:500,color:choice===opt.id?C.goldLight:C.mid,fontFamily:fHead}}>{opt.note}</div>
        </button>
      ))}
      <div style={{fontSize:12,color:C.mid,marginBottom:28,lineHeight:1.6,marginTop:8}}>{t.scale_note}</div>
      <button onClick={()=>choice&&onChoose(choice)} disabled={!choice}
        style={{width:'100%',padding:16,background:choice?C.dark:C.border,color:choice?'white':C.mid,border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:choice?'pointer':'not-allowed',transition:'all 0.2s',fontFamily:fB}}>
        {t.scale_btn}
      </button>
    </div>
  )
}
