import{C,fH,fK}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

export default function PhotoConsent({onAnswer}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  return(
    <div className="screen-up" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:36}}>
      <div style={{maxWidth:340,width:'100%',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:24}}>🌸</div>
        <div style={{fontFamily:fHead,fontSize:26,fontWeight:300,marginBottom:14,lineHeight:1.2}}>
          {lang==='ko'?'오늘 사진 한 장 남겨드릴까요?':'Would you like a photo from today?'}
        </div>
        <div style={{fontSize:13,color:C.mid,marginBottom:12,lineHeight:1.8,maxWidth:300,margin:'0 auto 12px'}}>
          {lang==='ko'
            ?'호스트가 자연스러운 블렌딩 장면을 촬영해드려요. 세션이 끝난 후 인화해드릴게요.'
            :"Your host will capture natural moments from your blending session. We'll print it for you to take home."}
        </div>
        <div style={{fontSize:12,color:C.gold,marginBottom:36,lineHeight:1.7}}>
          {lang==='ko'
            ?'촬영 사진은 Sok Studios 홍보에 활용될 수 있어요.'
            :'Photos may be used for Sok Studios promotional purposes.'}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,width:'100%'}}>
          <button onClick={()=>onAnswer(true)}
            style={{padding:'15px 20px',background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:14,cursor:'pointer',fontFamily:fHead,letterSpacing:'0.04em'}}>
            {lang==='ko'?'좋아요, 사진 받을게요 😊':'Yes, I\'d love a photo 😊'}
          </button>
          <button onClick={()=>onAnswer(false)}
            style={{padding:'15px 20px',background:'#FFF',color:C.mid,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,cursor:'pointer',fontFamily:fHead,letterSpacing:'0.04em'}}>
            {lang==='ko'?'괜찮아요':'No thanks'}
          </button>
        </div>
      </div>
    </div>
  )
}
