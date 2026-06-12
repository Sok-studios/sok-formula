import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

const SCALE_COLORS=['#EEE2C8','#D4BC82','#C4953A','#9A6E2A','#7A4E1A']

export default function SmellingResults({topRatings,midRatings,baseRatings,topOils,midOils,baseOils,onContinue}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH

  // 4점 이상만 표시
  const getHighRated=(oils,ratings)=>oils
    .filter(o=>ratings[o.id]>=4)
    .sort((a,b)=>(ratings[b.id]||0)-(ratings[a.id]||0))

  const topPicks=getHighRated(topOils,topRatings)
  const midPicks=getHighRated(midOils,midRatings)
  const basePicks=getHighRated(baseOils,baseRatings)

  const Section=({label,oils,ratings})=>{
    if(!oils.length)return null
    return(
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:18,fontStyle:'italic',marginBottom:12}}>{label}</div>
        {oils.map(oil=>(
          <div key={oil.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'#FFF',border:`1px solid ${C.border}`,borderRadius:6,marginBottom:6}}>
            <span style={{fontSize:14}}>{oil.name}</span>
            <div style={{display:'flex',gap:3}}>
              {[1,2,3,4,5].map(lv=>(
                <div key={lv} style={{width:14,height:14,borderRadius:3,background:ratings[oil.id]>=lv?SCALE_COLORS[lv-1]:C.border}}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const hasAny=topPicks.length||midPicks.length||basePicks.length

  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:34,fontWeight:300,lineHeight:1.1,marginBottom:8}}>{t.smresult_title}</div>
        <div style={{fontSize:13,color:C.mid}}>
          {lang==='ko'?'4점 이상을 준 향료들이에요':'Scents you rated 4 or above'}
        </div>
      </div>
      {hasAny?(
        <>
          <Section label={t.smell_top_title} oils={topPicks} ratings={topRatings}/>
          <Section label={t.smell_mid_title} oils={midPicks} ratings={midRatings}/>
          <Section label={t.smell_base_title} oils={basePicks} ratings={baseRatings}/>
        </>
      ):(
        <div style={{textAlign:'center',color:C.mid,padding:40,fontFamily:fHead,fontStyle:'italic',fontSize:18}}>
          {lang==='ko'?'4점 이상 선택된 향료가 없어요. 전체 향료를 사용할게요.':'No favorites rated 4+ — all oils will be available.'}
        </div>
      )}
      <button onClick={()=>onContinue({topPicks:topPicks.slice(0,3),midPicks:midPicks.slice(0,3),basePicks:basePicks.slice(0,3)})}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {t.smresult_btn}
      </button>
    </div>
  )
}
