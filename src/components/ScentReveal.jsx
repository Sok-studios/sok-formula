import{C,fH,fK,fB}from'../lib/theme.js'
import{useLang}from'../context/LangContext.jsx'
import{SCENT_FAMILIES}from'../data/families.js'

function getProfile(families){
  if(!families.length)return{name:'Explorer',desc:'Every possibility is open to you.',ko_name:'탐험가',ko_desc:'모든 가능성이 열려 있어요.'}
  const ids=new Set(families)
  const dark=['woody','animalic','balsamic','gourmand','spicy','liquor']
  const light=['fresh','citrus','green','aromatic']
  const dc=families.filter(f=>dark.includes(f)).length
  const lc=families.filter(f=>light.includes(f)).length
  if(families.length===1){
    const f=SCENT_FAMILIES.find(x=>x.id===families[0])
    return{name:`A ${f?.name} Soul`,desc:`You have a clear, instinctive sense of what you love. That clarity is rare and beautiful.`,ko_name:`${f?.name} 감성`,ko_desc:`좋아하는 게 분명한 사람이에요. 그 명확함이 특별해요.`}
  }
  if(ids.has('floral')&&ids.has('fruity'))return{name:'Romantic & Bright',desc:'Bright, loving scents pull you in. Sweet florals and fruits that tell your story.',ko_name:'로맨틱 & 브라이트',ko_desc:'밝고 사랑스러운 향에 끌려요. 꽃과 과일의 달콤함이 당신을 표현해요.'}
  if(ids.has('woody')&&ids.has('animalic'))return{name:'Dark & Intimate',desc:'Deep, sensual scents call to you. The kind that grow more captivating over time.',ko_name:'다크 & 인티메이트',ko_desc:'깊고 관능적인 향에 끌려요. 시간이 지날수록 더 매력적으로 변해요.'}
  if(dc>=3)return{name:'Deep & Grounding',desc:'Bold, lasting scents. A presence that stays long after you leave the room.',ko_name:'딥 & 그라운딩',ko_desc:'묵직하고 오래 남는 향을 선호해요. 존재감이 있는 향이에요.'}
  if(lc>=3)return{name:'Clean & Alive',desc:'Bright, fresh energy. Natural, effortless, and alive.',ko_name:'클린 & 얼라이브',ko_desc:'맑고 생기 있는 향을 좋아해요. 자연스럽고 상쾌한 에너지예요.'}
  if(ids.has('floral')&&ids.has('woody'))return{name:'Structured & Elegant',desc:'Floral delicacy meets woody strength. Balanced and refined.',ko_name:'스트럭처드 & 엘레강트',ko_desc:'꽃의 섬세함과 우드의 단단함이 함께해요. 균형 잡힌 세련된 향이에요.'}
  return{name:'Unique & Layered',desc:'Your taste is complex and multifaceted — that\'s what makes you interesting.',ko_name:'유니크 & 레이어드',ko_desc:'복합적이고 다층적인 취향이에요. 그게 당신을 더 특별하게 만들어요.'}
}

export default function ScentReveal({selectedFamilies,onContinue,onBack}){
  const{t,lang}=useLang()
  const fHead=lang==='ko'?fK:fH
  const families=SCENT_FAMILIES.filter(f=>selectedFamilies.includes(f.id))
  const profile=getProfile(selectedFamilies)
  const profileName=lang==='ko'?profile.ko_name:profile.name
  const profileDesc=lang==='ko'?profile.ko_desc:profile.desc
  return(
    <div className="screen" style={{maxWidth:600,margin:'0 auto',padding:'36px 20px 100px',color:C.dark,minHeight:'100vh'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.gold,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:0,cursor:'pointer',marginBottom:16,fontFamily:fB}}>{t.back}</button>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:fHead,fontSize:10,letterSpacing:'0.35em',color:C.gold,textTransform:'uppercase',marginBottom:8}}>Sok Studios · Scent Profile</div>
        <div style={{fontFamily:fHead,fontSize:34,fontWeight:300,lineHeight:1.1}}>{t.reveal_title}</div>
      </div>
      <div style={{background:C.dark,borderRadius:12,padding:'28px 24px',marginBottom:28,textAlign:'center'}}>
        <div style={{fontFamily:fHead,fontSize:11,letterSpacing:'0.3em',color:C.goldLight,textTransform:'uppercase',marginBottom:12,opacity:0.7}}>{t.reveal_sub}</div>
        <div style={{fontFamily:fHead,fontSize:28,fontWeight:300,color:'white',marginBottom:12}}>{profileName}</div>
        <div style={{fontSize:14,color:C.goldLight,lineHeight:1.7,opacity:0.85}}>{profileDesc}</div>
      </div>
      <div style={{marginBottom:32}}>
        <div style={{fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:C.mid,marginBottom:16}}>{t.reveal_chosen} ({families.length})</div>
        {families.map(f=>(
          <div key={f.id} style={{background:'#FFF',border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 16px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span style={{fontSize:22}}>{f.emoji}</span>
              <span style={{fontFamily:fHead,fontSize:18,fontWeight:400}}>{f.name}</span>
            </div>
            <div style={{fontSize:13,color:C.mid,lineHeight:1.6,marginBottom:4}}>{f.desc}</div>
            <div style={{fontSize:12,color:C.gold,fontStyle:'italic'}}>→ {f.tagline}</div>
          </div>
        ))}
      </div>
      <button onClick={onContinue} style={{width:'100%',padding:16,background:C.dark,color:'white',border:'none',borderRadius:8,fontSize:13,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',fontFamily:fB}}>{t.reveal_btn}</button>
    </div>
  )
}
