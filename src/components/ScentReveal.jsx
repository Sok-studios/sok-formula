import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'
import { SCENT_FAMILIES } from '../data/families.js'

function getScentProfile(families) {
  if (!families.length) return { name:'Explorer', desc:'Every possibility is open to you.' }
  const dark=['woody','animalic','balsamic','gourmand','spicy','liquor']
  const light=['fresh','citrus','green','aromatic']
  const warm=['floral','fruity','balsamic','gourmand','spicy']
  const bright=['citrus','fruity','green','fresh']
  const ids=new Set(families)
  const dc=families.filter(f=>dark.includes(f)).length
  const lc=families.filter(f=>light.includes(f)).length
  const bc=families.filter(f=>bright.includes(f)).length
  const wc=families.filter(f=>warm.includes(f)).length
  if (ids.has('floral')&&ids.has('fruity')&&bc>=2) return {name:'Romantic & Bright',desc:'You\'re drawn to bright, loving scents. Sweet florals and fruits that tell your story.'}
  if (ids.has('woody')&&ids.has('animalic')) return {name:'Dark & Intimate',desc:'Deep, sensual scents call to you. The kind that grow more captivating over time.'}
  if (dc>=3) return {name:'Deep & Grounding',desc:'You prefer bold, lasting scents. A presence that stays long after you leave the room.'}
  if (lc>=3) return {name:'Clean & Alive',desc:'Bright, fresh energy. Natural, effortless, and alive.'}
  if (ids.has('gourmand')&&wc>=2) return {name:'Warm & Comforting',desc:'You\'re drawn to warmth and familiarity. Scents that feel like a safe, cozy place.'}
  if (ids.has('floral')&&ids.has('woody')) return {name:'Structured & Elegant',desc:'Floral delicacy meets woody strength. Balanced and refined.'}
  return {name:'Unique & Layered',desc:'Your taste is complex and multifaceted. That\'s what makes you interesting.'}
}

export default function ScentReveal({ selectedFamilies, onContinue, onBack }) {
  const { t } = useLang()
  const families = SCENT_FAMILIES.filter(f=>selectedFamilies.includes(f.id))
  const profile = getScentProfile(selectedFamilies)
  return (
    <div className="screen" style={{ maxWidth:600, margin:'0 auto', padding:'36px 20px 100px', color:C.dark, minHeight:'100vh' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.gold, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:0, cursor:'pointer', marginBottom:16 }}>{t.back}</button>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:fH, fontSize:10, letterSpacing:'0.35em', color:C.gold, textTransform:'uppercase', marginBottom:8 }}>Sok Studios · Scent Profile</div>
        <div style={{ fontFamily:fH, fontSize:34, fontWeight:300, lineHeight:1.1 }}>{t.reveal_title}</div>
      </div>
      <div style={{ background:C.dark, borderRadius:12, padding:'28px 24px', marginBottom:28, textAlign:'center' }}>
        <div style={{ fontFamily:fH, fontSize:11, letterSpacing:'0.3em', color:C.goldLight, textTransform:'uppercase', marginBottom:12, opacity:0.7 }}>{t.reveal_personality}</div>
        <div style={{ fontFamily:fH, fontSize:30, fontWeight:300, color:'white', marginBottom:12 }}>{profile.name}</div>
        <div style={{ fontSize:14, color:C.goldLight, lineHeight:1.7, opacity:0.85 }}>{profile.desc}</div>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:C.mid, marginBottom:16 }}>{t.reveal_chosen} ({families.length})</div>
        {families.map(f => (
          <div key={f.id} style={{ background:'#FFF', border:`1px solid ${C.border}`, borderRadius:8, padding:'14px 16px', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <span style={{ fontSize:22 }}>{f.emoji}</span>
              <span style={{ fontFamily:fH, fontSize:18, fontWeight:400 }}>{f.name}</span>
            </div>
            <div style={{ fontSize:13, color:C.mid, lineHeight:1.6, marginBottom:4 }}>{f.desc}</div>
            <div style={{ fontSize:12, color:C.gold, fontStyle:'italic' }}>→ {f.tagline}</div>
          </div>
        ))}
      </div>
      <button onClick={onContinue} style={{ width:'100%', padding:16, background:C.dark, color:'white', border:'none', borderRadius:8, fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>
        {t.reveal_btn}
      </button>
    </div>
  )
}
