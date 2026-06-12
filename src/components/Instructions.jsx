import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

export default function Instructions({ onContinue }) {
  const { t } = useLang()
  return (
    <div className="screen" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios · Step 1</div>
        <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>{t.instr_title}</div>
      </div>
      <div style={{ marginBottom: 32 }}>
        {t.instr.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: fH, fontSize: 16, color: C.gold, fontWeight: 400 }}>
              {i+1}
            </div>
            <div style={{ background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', flex: 1 }}>
              <div style={{ fontFamily: fH, fontSize: 17, fontWeight: 400, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onContinue}
        style={{ width: '100%', padding: 16, background: C.dark, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
        {t.instr_ready}
      </button>
    </div>
  )
}
