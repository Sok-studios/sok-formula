import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

const FEELINGS_EN=['Sweet','Cozy','Clean','Soft','Light','Deep','Flat','Complex','Natural','Unique']
const FEELINGS_KO=['달콤한','포근한','깨끗한','부드러운','가벼운','무게감 있는','플랫한','입체적인','자연스러운','독특한']
const OVERALL_EN=[{v:'keep',l:'Keep this direction'},{v:'adjust',l:'Make a few adjustments'},{v:'new',l:'Explore a different direction'}]
const OVERALL_KO=[{v:'keep',l:'지금 방향을 유지하고 싶어요'},{v:'adjust',l:'조금만 조정해보고 싶어요'},{v:'new',l:'다른 방향으로 새롭게 만들어보고 싶어요'}]

export default function PostMix({lang,sampleNum,onMake2,onFinalize}){
  const{t}=useLang()
  const fHead=lang==='ko'?fK:fH
  const isKo=lang==='ko'

  const[reaction,setReaction]=useState(null) // 😍😊🤔😐
  const[feelings,setFeelings]=useState([])
  const[sweetness,setSweetness]=useState(null)
  const[depth,setDepth]=useState(null)
  const[overall,setOverall]=useState(null)
  const[note,setNote]=useState('')

  const toggleFeeling=f=>{
    setFeelings(prev=>prev.includes(f)?prev.filter(x=>x!==f):[...prev,f].slice(0,3))
  }

  const reactions=[
    {id:'love',emoji:'😍',label:isKo?'너무 마음에 들어요':'Love it'},
    {id:'like',emoji:'😊',label:isKo?'마음에 들어요':'I like it'},
    {id:'adjust',emoji:'🤔',label:isKo?'조금 더 수정하고 싶어요':'Want to adjust'},
    {id:'unsure',emoji:'😐',label:isKo?'아직 잘 모르겠어요':'Not sure yet'},
  ]

  const feelings_list=isKo?FEELINGS_KO:FEELINGS_EN
  const overall_list=isKo?OVERALL_KO:OVERALL_EN

  const canFinalize=reaction==='love'||reaction==='like'
  const wantAdjust=reaction==='adjust'||reaction==='unsure'

  return(
    <div className="screen-up" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 120px',color:C.dark,minHeight:'100vh'}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios · Sample {sampleNum}</div>
        <div style={{fontFamily:fHead,fontSize:30,fontWeight:300,lineHeight:1.1,marginBottom:8}}>
          {isKo?'향이 어떤가요?':'How does it smell?'}
        </div>
        <div style={{fontSize:13,color:C.mid}}>{isKo?'잠깐 눈을 감고. 어떤 느낌이에요?':'Take a moment. Close your eyes. What do you feel?'}</div>
      </div>

      {/* 반응 선택 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:24}}>
        {reactions.map(r=>(
          <button key={r.id} onClick={()=>setReaction(r.id)}
            style={{padding:'14px 12px',borderRadius:8,border:`1px solid ${reaction===r.id?C.dark:C.border}`,background:reaction===r.id?C.dark:'#FFF',cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
            <div style={{fontSize:22,marginBottom:4}}>{r.emoji}</div>
            <div style={{fontSize:12,color:reaction===r.id?'white':C.dark,lineHeight:1.3}}>{r.label}</div>
          </button>
        ))}
      </div>

      {/* 느낌 태그 (최대 3개) */}
      {reaction&&(
        <div className="fade" style={{marginBottom:24}}>
          <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:C.mid,marginBottom:10}}>
            {isKo?'이 향을 어떻게 느끼셨나요? (최대 3개)':'How would you describe it? (up to 3)'}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {feelings_list.map(f=>{
              const sel=feelings.includes(f)
              const dis=!sel&&feelings.length>=3
              return(
                <button key={f} onClick={()=>!dis&&toggleFeeling(f)}
                  style={{padding:'7px 14px',borderRadius:20,fontSize:12,cursor:dis?'not-allowed':'pointer',border:`1px solid ${sel?C.dark:C.border}`,background:sel?C.dark:'#FFF',color:sel?'white':C.dark,opacity:dis?0.4:1,transition:'all 0.1s'}}>
                  {f}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 조정 방향 (adjust/unsure일 때만) */}
      {wantAdjust&&reaction&&(
        <div className="fade" style={{marginBottom:24}}>
          {/* 달콤함 */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              {isKo?'달콤함':'Sweetness'}
            </div>
            <div style={{display:'flex',gap:8}}>
              {(isKo?['조금 더 달게','지금이 좋아요','조금 덜 달게']:['Sweeter','Keep as is','Less sweet']).map((l,i)=>(
                <button key={i} onClick={()=>setSweetness(l)}
                  style={{flex:1,padding:'10px 8px',borderRadius:6,border:`1px solid ${sweetness===l?C.dark:C.border}`,background:sweetness===l?C.dark:'#FFF',color:sweetness===l?'white':C.dark,fontSize:11,cursor:'pointer',transition:'all 0.1s',textAlign:'center'}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {/* 무게감 */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              {isKo?'무게감':'Depth'}
            </div>
            <div style={{display:'flex',gap:8}}>
              {(isKo?['조금 더 가볍게','지금이 좋아요','조금 더 깊게']:['Lighter','Keep as is','Deeper']).map((l,i)=>(
                <button key={i} onClick={()=>setDepth(l)}
                  style={{flex:1,padding:'10px 8px',borderRadius:6,border:`1px solid ${depth===l?C.dark:C.border}`,background:depth===l?C.dark:'#FFF',color:depth===l?'white':C.dark,fontSize:11,cursor:'pointer',transition:'all 0.1s',textAlign:'center'}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {/* 전체 방향 */}
          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              {isKo?'전체적인 방향':'Overall direction'}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {overall_list.map(o=>(
                <button key={o.v} onClick={()=>setOverall(o.v)}
                  style={{padding:'11px 14px',borderRadius:6,border:`1px solid ${overall===o.v?C.dark:C.border}`,background:overall===o.v?C.dark:'#FFF',color:overall===o.v?'white':C.dark,fontSize:12,cursor:'pointer',transition:'all 0.1s',textAlign:'left'}}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 메모 */}
      {reaction&&(
        <div className="fade" style={{marginBottom:24}}>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
            placeholder={isKo?'더 쓰고 싶은 것들... (선택)':'Anything else you want to note... (optional)'}
            style={{width:'100%',padding:14,border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,outline:'none',background:'#FFF',color:C.dark,resize:'none',lineHeight:1.6,fontFamily:fH}}/>
        </div>
      )}

      {/* 버튼 */}
      {reaction&&(
        <div className="fade" style={{display:'grid',gridTemplateColumns:canFinalize?'1fr 1fr':'1fr',gap:10}}>
          {wantAdjust&&(
            <button onClick={onMake2}
              style={{padding:15,background:'#FFF',color:C.dark,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:fB}}>
              {isKo?'2번째 샘플 만들기':'Make Sample 2'}
            </button>
          )}
          {canFinalize&&(
            <>
              <button onClick={onMake2}
                style={{padding:15,background:'#FFF',color:C.dark,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:fB}}>
                {isKo?'2번째도 만들기':'Make Sample 2'}
              </button>
              <button onClick={onFinalize}
                style={{padding:15,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:12,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:fB}}>
                {isKo?'이걸로 할게요 ✓':'This is it ✓'}
              </button>
            </>
          )}
          {reaction==='unsure'&&!wantAdjust&&(
            <button onClick={onMake2}
              style={{padding:15,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:12,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:fB}}>
              {isKo?'2번째 샘플 만들기':'Make Sample 2'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
