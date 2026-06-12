import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

export default function HowPerfumesWork({ onContinue, onBack }) {
  const { t } = useLang()
  return (
    <div className="screen" style={{ maxWidth:600, margin:'0 auto', padding:'36px 20px 100px', color:C.dark, minHeight:'100vh' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.gold, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:0, cursor:'pointer', marginBottom:16 }}>{t.back}</button>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:fH, fontSize:10, letterSpacing:'0.35em', color:C.gold, textTransform:'uppercase', marginBottom:8 }}>Sok Studios · {t.howto_step}</div>
        <div style={{ fontFamily:fH, fontSize:34, fontWeight:300, lineHeight:1.1, marginBottom:12 }}>{t.howto_title}</div>
        <div style={{ fontSize:13, color:C.mid, lineHeight:1.7 }}>{t.howto_sub}</div>
      </div>
      <div style={{ position:'relative', marginBottom:32 }}>
        {t.howto_notes.map((note, i) => (
          <div key={note.tier} style={{ display:'flex', gap:16, marginBottom:16 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:40, flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:C.dark, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{note.emoji}</div>
              {i<t.howto_notes.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ background:'#FFF', border:`1px solid ${C.border}`, borderRadius:8, padding:'14px 16px', flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontFamily:fH, fontSize:18, fontWeight:400 }}>{note.tier}</span>
                <span style={{ fontSize:11, color:C.gold, background:C.goldLight, borderRadius:20, padding:'2px 10px' }}>{note.time}</span>
              </div>
              <div style={{ fontSize:13, color:C.mid, lineHeight:1.6 }}>{note.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:C.goldLight+'40', border:`1px solid ${C.goldLight}`, borderRadius:8, padding:'18px 20px', marginBottom:32 }}>
        <div style={{ fontFamily:fH, fontSize:15, fontStyle:'italic', color:C.dark, lineHeight:1.7, textAlign:'center' }}>{t.howto_quote}</div>
      </div>
      <button onClick={onContinue} style={{ width:'100%', padding:16, background:C.dark, color:'white', border:'none', borderRadius:8, fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>
        {t.howto_btn}
      </button>
    </div>
  )
}
