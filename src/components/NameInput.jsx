import { useState } from 'react'
import { C, fH } from '../lib/theme.js'

export default function NameInput({ onContinue }) {
  const [name, setName] = useState('')

  return (
    <div className="screen" style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 16 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1.1, marginBottom: 12, textAlign: 'center' }}>
        나만의 향수를<br />만들어볼게요
      </div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 48, textAlign: 'center', lineHeight: 1.7 }}>
        시작 전에 이름을 알려주세요
      </div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onContinue(name.trim())}
        placeholder="이름을 입력해주세요"
        autoFocus
        style={{
          width: '100%', maxWidth: 320, padding: '14px 18px',
          border: `1px solid ${C.border}`, borderRadius: 6,
          fontSize: 15, outline: 'none', background: C.card, color: C.dark,
          textAlign: 'center', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = C.gold}
        onBlur={e => e.target.style.borderColor = C.border}
      />
      <button
        onClick={() => name.trim() && onContinue(name.trim())}
        disabled={!name.trim()}
        style={{
          marginTop: 14, width: '100%', maxWidth: 320, padding: 15,
          background: name.trim() ? C.dark : C.border,
          color: name.trim() ? 'white' : C.mid,
          border: 'none', borderRadius: 6,
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: name.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        }}>
        시작하기 →
      </button>
    </div>
  )
}
