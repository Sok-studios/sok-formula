import { useState } from 'react'
import { C, fH } from '../lib/theme.js'

export default function PasswordGate({ correctPassword, onSuccess }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const tryPassword = () => {
    if (input.trim().toLowerCase() === correctPassword.trim().toLowerCase()) {
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="screen" style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 30, fontWeight: 300, marginBottom: 10 }}>Private Session</div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 40, textAlign: 'center', lineHeight: 1.7 }}>
        오늘의 세션 코드를 입력해주세요
      </div>
      <input
        value={input}
        onChange={e => { setInput(e.target.value); setError(false) }}
        onKeyDown={e => e.key === 'Enter' && tryPassword()}
        placeholder="Session code"
        autoFocus
        style={{
          width: '100%', maxWidth: 300, padding: '14px 18px',
          border: `1px solid ${error ? C.red : C.border}`, borderRadius: 6,
          fontSize: 16, textAlign: 'center', outline: 'none',
          background: C.card, color: C.dark, letterSpacing: '0.2em',
          transition: 'border-color 0.2s',
          transform: shake ? 'translateX(-8px)' : 'none',
        }}
      />
      {error && (
        <div className="fade" style={{ fontSize: 12, color: C.red, marginTop: 10 }}>
          코드가 맞지 않아요. 다시 확인해주세요.
        </div>
      )}
      <button onClick={tryPassword}
        style={{
          marginTop: 16, width: '100%', maxWidth: 300, padding: 15,
          background: C.dark, color: 'white', border: 'none', borderRadius: 6,
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
        입장하기
      </button>
    </div>
  )
}
