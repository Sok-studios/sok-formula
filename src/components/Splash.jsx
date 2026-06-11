import { useEffect } from 'react'
import { C, fH, fB } from '../lib/theme.js'

const MESSAGES = [
  '당신의 향이 블렌딩되고 있어요...',
  '오늘의 향수를 준비하고 있어요...',
  '나만의 레시피를 만들어볼게요...',
]

export default function Splash({ onDone }) {
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fade" style={{
      position: 'fixed', inset: 0, background: C.dark,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      {/* Logo area */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: `1px solid ${C.gold}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <div style={{ fontFamily: fH, fontSize: 28, color: C.gold, fontWeight: 300 }}>S</div>
        </div>
        <div style={{ fontFamily: fH, fontSize: 11, letterSpacing: '0.45em', color: C.gold, textTransform: 'uppercase', marginBottom: 10, opacity: 0.8 }}>
          Sok Studios
        </div>
        <div style={{ fontFamily: fH, fontSize: 38, fontWeight: 300, color: 'white', lineHeight: 1.1 }}>
          Formula Builder
        </div>
      </div>

      {/* Loading message */}
      <div style={{ fontFamily: fH, fontSize: 15, fontStyle: 'italic', color: C.goldLight, opacity: 0.7, marginBottom: 32, animation: 'shimmer 2s ease infinite' }}>
        {msg}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%', background: C.gold,
            animation: `pulse 1.5s ease-in-out ${i * 0.25}s infinite`
          }} />
        ))}
      </div>
    </div>
  )
}
