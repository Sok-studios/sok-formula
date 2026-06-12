import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import{TOTAL_DROPS}from'../data/oils.js'

export default function SampleCompare({sample1,sample2,onSelect}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 80px',color:C.dark,minHeight:'100vh'}}>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios</div>
      <div style={{fontFamily:fHead,fontSize:30,fontWeight:300,marginBottom:6}}>{t.compare_title}</div>
      <div style={{fontSize:13,color:C.mid,marginBottom:32}}>{t.compare_sub}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {[sample1,sample2].map((formula,idx)=>(
          <button key={idx} onClick={()=>onSelect(formula,idx+1)}
            style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:8,padding:'18px 14px',cursor:'pointer',textAlign:'left',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=C.goldLight+'30'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='#FFF'}}>
            <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:C.gold,marginBottom:10}}>{t.result_sample} {idx+1}</div>
            {['Top','Middle','Base'].map(tier=>{
              const oils=formula.oils.filter(o=>o.tier===tier)
              if(!oils.length)return null
              return(
                <div key={tier} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.mid,marginBottom:4,textTransform:'uppercase'}}>{tier}</div>
                  {oils.map(oil=>(
                    <div key={oil.id} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                      <span style={{fontSize:12,color:oil.isHero?C.dark:C.mid,fontWeight:oil.isHero?500:300}}>{oil.name}</span>
                      <span style={{fontSize:11,color:C.gold,fontFamily:fHead}}>{oil.g.toFixed(3)}g</span>
                    </div>
                  ))}
                </div>
              )
            })}
            <div style={{marginTop:12,padding:'10px 0',background:C.dark,borderRadius:4,textAlign:'center',color:'white',fontSize:12,fontFamily:fB}}>{t.compare_btn}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
