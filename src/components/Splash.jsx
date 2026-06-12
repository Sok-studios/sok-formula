import{useState,useEffect}from'react'
import{C,fK,fH}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function Splash({onDone}){
  const{t,lang}=useLang()
  const[phase,setPhase]=useState('meaning') // meaning | loading
  const msg=t.loading[Math.floor(Math.random()*t.loading.length)]

  useEffect(()=>{
    const x=setTimeout(()=>setPhase('loading'),3200)
    return()=>clearTimeout(x)
  },[])

  useEffect(()=>{
    if(phase==='loading'){
      const x=setTimeout(onDone,2600)
      return()=>clearTimeout(x)
    }
  },[phase])

  if(phase==='meaning')return(
    <div className="fade" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{maxWidth:340}}>
        <div style={{fontFamily:fK,fontSize:10,letterSpacing:'0.45em',color:C.gold,textTransform:'uppercase',marginBottom:48,opacity:0.7}}>Sok Studios</div>
        <div style={{fontFamily:fK,fontSize:lang==='ko'?64:72,fontWeight:300,color:C.gold,marginBottom:12,lineHeight:1}}>속</div>
        <div style={{fontFamily:fK,fontSize:lang==='ko'?16:15,color:'white',letterSpacing:'0.08em',marginBottom:8,opacity:0.9}}>
          {lang==='ko'?'속 (sok) · 내면':'sok · inner self'}
        </div>
        <div style={{fontFamily:fK,fontSize:lang==='ko'?15:14,color:C.goldLight,lineHeight:1.8,opacity:0.75,marginTop:20}}>
          {lang==='ko'
            ?'향수는 외면을 가꾸는 것이 아니에요.\n당신의 내면을 표현하는 언어예요.'
            :'Fragrance is not about appearance.\nIt is a language for expressing your inner self.'}
        </div>
      </div>
    </div>
  )

  return(
    <div className="fade" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32}}>
      <div style={{width:72,height:72,borderRadius:'50%',border:`1px solid ${C.gold}60`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
        <div style={{fontFamily:fK,fontSize:28,color:C.gold,fontWeight:300}}>S</div>
      </div>
      <div style={{fontFamily:fK,fontSize:11,letterSpacing:'0.45em',color:C.gold,textTransform:'uppercase',marginBottom:10,opacity:0.8}}>Sok Studios</div>
      <div style={{fontFamily:fK,fontSize:36,fontWeight:300,color:'white',lineHeight:1.1,marginBottom:32}}>Formula Builder</div>
      <div style={{fontFamily:fK,fontSize:15,fontStyle:'italic',color:C.goldLight,opacity:0.7,marginBottom:32,animation:'shimmer 2s ease infinite',textAlign:'center',whiteSpace:'pre-line'}}>{msg}</div>
      <div style={{display:'flex',gap:8}}>
        {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:C.gold,animation:`pulse 1.5s ease-in-out ${i*0.25}s infinite`}}/>)}
      </div>
    </div>
  )
}
