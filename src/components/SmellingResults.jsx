import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

const SCALE_COLORS=['#EEE2C8','#D4B96A','#C4953A','#9A7A42','#231410']

export default function SmellingResults({topRatings,midRatings,baseRatings,topOils,midOils,baseOils,onContinue}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH

  const getTopRated=(oils,ratings)=>oils.filter(o=>ratings[o.id]).sort((a,b)=>(ratings[b.id]||0)-(ratings[a.id]||0))

  const topPicks=getTopRated(topOils,topRatings)
  const midPicks=getTopRated(midOils,midRatings)
  const basePicks=getTopRated(baseOils,baseRatings)

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
                <div key={lv} style={{width:12,height:12,borderRadius:3,background:ratings[oil.id]>=lv?SCALE_COLORS[lv-1]:C.border}}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
        <div style={{fontFamily:fHead,fontSize:34,fontWeight:300,lineHeight:1.1,marginBottom:8}}>{t.smresult_title}</div>
        <div style={{fontSize:13,color:C.mid}}>{t.smresult_sub}</div>
      </div>
      <Section label={t.smell_top_title} oils={topPicks} ratings={topRatings}/>
      <Section label={t.smell_mid_title} oils={midPicks} ratings={midRatings}/>
      <Section label={t.smell_base_title} oils={basePicks} ratings={baseRatings}/>
      {!topPicks.length&&!midPicks.length&&!basePicks.length&&(
        <div style={{textAlign:'center',color:C.mid,padding:40,fontFamily:fHead,fontStyle:'italic',fontSize:18}}>
          {lang==='ko'?'선택된 향료가 없어요. 전체 향료를 사용할게요.':'No favorites selected — all oils will be available.'}
        </div>
      )}
      <button onClick={()=>onContinue({topPicks:topPicks.slice(0,3),midPicks:midPicks.slice(0,3),basePicks:basePicks.slice(0,3)})}
        style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>
        {t.smresult_btn}
      </button>
    </div>
  )
}
