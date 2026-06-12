import{useState}from'react'
import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'

const NOTES=[
  {
    tier:'Top Note',
    icon:'✨',
    time_en:'First ~15 min',time_ko:'처음 ~15분',
    molecule_en:'Small & light molecules',molecule_ko:'작고 가벼운 분자',
    desc_en:"The smallest molecules — lightest and fastest to evaporate. For the first 15 minutes, they're the star. Then they drift away. Citrus, Green, Fresh notes live here.",
    desc_ko:'분자가 가장 작아서 가장 빠르게 날아가요. 처음 15분 동안 주인공이 되고, 그 이후엔 증발해요. 시트러스, 그린, 프레시 같은 향 계열이 여기 속해요.',
    families_en:'Citrus · Green · Fresh',
    families_ko:'시트러스 · 그린 · 프레시',
  },
  {
    tier:'Middle Note',
    icon:'🌿',
    time_en:'15 min – 4 hrs',time_ko:'15분 ~ 4시간',
    molecule_en:'Balanced molecules',molecule_ko:'균형 잡힌 분자',
    desc_en:"Well-balanced molecules — not too fast, not too slow. They carry the character of your perfume. Think of it as the personality. Spicy, Floral, Liquor notes belong here.",
    desc_ko:'너무 빠르지도 느리지도 않은 균형 잡힌 분자예요. 향수의 성격을 만드는 아이들이에요. 스파이시, 플로럴, 리큐어 계열이 여기 있어요.',
    families_en:'Spicy · Floral · Liquor',
    families_ko:'스파이시 · 플로럴 · 리큐어',
  },
  {
    tier:'Base Note',
    icon:'🪵',
    time_en:'4 hrs onwards',time_ko:'4시간 이후',
    molecule_en:'Large & heavy molecules',molecule_ko:'크고 무거운 분자',
    desc_en:'The heaviest molecules — they spread slowly but stay the longest. The lingering scent you feel hours later. Gourmand, Woody, Animalic notes are the base.',
    desc_ko:'분자가 가장 크고 무거워서 확산은 적지만 가장 오래 남아요. 몇 시간 후에도 느껴지는 잔향이 바로 이 아이들이에요. 고만드, 우디, 애니멀릭이 여기 속해요.',
    families_en:'Gourmand · Woody · Animalic',
    families_ko:'고만드 · 우디 · 애니멀릭',
  },
]

export default function HowPerfumesWork({onContinue,onBack}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const[step,setStep]=useState(0) // 0=intro, 1-3=each note, 4=wrap

  const isKo=lang==='ko'

  if(step===0)return(
    <div className="screen" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:40,opacity:0.7}}>Sok Studios</div>
      <div style={{maxWidth:340}}>
        <div style={{fontFamily:fHead,fontSize:isKo?22:20,fontWeight:300,color:C.goldLight,lineHeight:1.7,marginBottom:20,opacity:0.85}}>
          {isKo?'이제 향수의 구조에 대해\n잠깐 배워볼게요.':'Now let\'s take a moment\nto learn about fragrance structure.'}
        </div>
        <div style={{fontFamily:fHead,fontSize:isKo?28:26,fontWeight:300,color:'white',lineHeight:1.4,marginBottom:40}}>
          {isKo?'향수에는 구조가 있어요.\n탑 · 미들 · 베이스 노트.':'Perfume has a structure.\nTop · Middle · Base.'}
        </div>
      </div>
      <button onClick={()=>setStep(1)}
        style={{padding:'14px 40px',background:'transparent',color:C.gold,border:`1px solid ${C.gold}60`,borderRadius:30,fontSize:13,letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',fontFamily:fHead}}
        onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color='white'}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.gold}}>
        {isKo?'알아보기 →':'Explore →'}
      </button>
    </div>
  )

  if(step>=1&&step<=3){
    const note=NOTES[step-1]
    return(
      <div className="screen" style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:36}}>
        <div style={{maxWidth:360,width:'100%'}}>
          {/* Step indicator */}
          <div style={{display:'flex',gap:6,marginBottom:36,justifyContent:'center'}}>
            {[1,2,3].map(i=>(
              <div key={i} style={{height:3,borderRadius:2,flex:1,background:i<=step?C.gold:C.border,transition:'background 0.3s'}}/>
            ))}
          </div>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{fontSize:48,marginBottom:12}}>{note.icon}</div>
            <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,color:C.dark,marginBottom:6}}>{note.tier}</div>
            <div style={{fontSize:11,color:C.gold,background:C.goldLight,borderRadius:20,padding:'3px 14px',display:'inline-block',marginBottom:8}}>
              {isKo?note.time_ko:note.time_en}
            </div>
            <div style={{fontSize:12,color:C.mid,fontStyle:'italic',marginBottom:20}}>
              {isKo?note.molecule_ko:note.molecule_en}
            </div>
          </div>
          <div style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:10,padding:'20px 22px',marginBottom:16}}>
            <div style={{fontSize:14,color:C.dark,lineHeight:1.8}}>
              {isKo?note.desc_ko:note.desc_en}
            </div>
          </div>
          <div style={{background:C.goldLight+'50',borderRadius:8,padding:'10px 16px',marginBottom:32,textAlign:'center'}}>
            <div style={{fontSize:12,color:C.gold,letterSpacing:'0.06em'}}>
              {isKo?note.families_ko:note.families_en}
            </div>
          </div>
          <button onClick={()=>setStep(step+1)}
            style={{width:'100%',padding:15,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontFamily:fHead}}>
            {step<3?(isKo?'다음 →':'Next →'):(isKo?'향료 시향으로 →':'Start smelling →')}
          </button>
        </div>
      </div>
    )
  }

  // step 4 = wrap-up (이제 향료를 직접 시향합니다)
  return(
    <div className="screen" style={{position:'fixed',inset:0,background:C.dark,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{maxWidth:340}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:40,opacity:0.7}}>Sok Studios</div>
        <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:28}}>
          {NOTES.map(n=>(
            <div key={n.tier} style={{fontSize:28}}>{n.icon}</div>
          ))}
        </div>
        <div style={{fontFamily:fHead,fontSize:isKo?22:20,fontWeight:300,color:'white',lineHeight:1.7,marginBottom:16}}>
          {isKo
            ?'오늘 우리는 각 노트에서\n향료를 직접 골라 나만의 향수를 만들게 돼요.'
            :"Today you'll choose scents from each layer\nto build a fragrance that is truly yours."}
        </div>
        <div style={{fontFamily:fHead,fontSize:isKo?15:14,color:C.goldLight,lineHeight:1.8,marginBottom:48,opacity:0.75}}>
          {isKo?'이제 직접 시향해볼 차례예요.':'Now it\'s time to smell them for yourself.'}
        </div>
      </div>
      <button onClick={onContinue}
        style={{padding:'14px 40px',background:'transparent',color:C.gold,border:`1px solid ${C.gold}60`,borderRadius:30,fontSize:13,letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',fontFamily:fHead}}
        onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color='white'}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.gold}}>
        {isKo?'시향하러 가기 →':'Let\'s go →'}
      </button>
    </div>
  )
}
