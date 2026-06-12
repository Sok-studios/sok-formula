import { useEffect } from 'react'
import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

export default function Splash({ onDone }) {
  const { t } = useLang()
  const msg = t.loading[Math.floor(Math.random() * t.loading.length)]
  useEffect(() => { const x = setTimeout(onDone, 2800); return () => clearTimeout(x) }, [])
  return (
    <div className="fade" style={{ position: 'fixed', inset: 0, background: C.dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', border: `1px solid ${C.gold}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <div style={{ fontFamily: fH, fontSize: 28, color: C.gold, fontWeight: 300 }}>S</div>
      </div>
      <div style={{ fontFamily: fH, fontSize: 11, letterSpacing: '0.45em', color: C.gold, textTransform: 'uppercase', marginBottom: 10, opacity: 0.8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 38, fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 32 }}>Formula Builder</div>
      <div style={{ fontFamily: fH, fontSize: 15, fontStyle: 'italic', color: C.goldLight, opacity: 0.7, marginBottom: 32, animation: 'shimmer 2s ease infinite', textAlign: 'center' }}>{msg}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: `pulse 1.5s ease-in-out ${i*0.25}s infinite` }} />)}
      </div>
    </div>
  )
}
