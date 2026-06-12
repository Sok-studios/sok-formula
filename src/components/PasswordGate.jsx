import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

export default function PasswordGate({ correctPassword, onSuccess }) {
  const { t } = useLang()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const try_ = () => {
    if (input.trim().toLowerCase() === correctPassword.trim().toLowerCase()) onSuccess()
    else { setError(true); setInput('') }
  }
  return (
    <div className="screen" style={{ position: 'fixed', inset: 0, background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 30, fontWeight: 300, marginBottom: 10 }}>{t.pwd_title}</div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 40, textAlign: 'center' }}>{t.pwd_sub}</div>
      <input value={input} onChange={e => { setInput(e.target.value); setError(false) }} onKeyDown={e => e.key==='Enter'&&try_()} placeholder="Session code" autoFocus
        style={{ width: '100%', maxWidth: 300, padding: '14px 18px', border: `1px solid ${error?C.red:C.border}`, borderRadius: 6, fontSize: 16, textAlign: 'center', outline: 'none', background: '#FFF', color: C.dark, letterSpacing: '0.2em' }} />
      {error && <div className="fade" style={{ fontSize: 12, color: C.red, marginTop: 10 }}>{t.pwd_error}</div>}
      <button onClick={try_} style={{ marginTop: 16, width: '100%', maxWidth: 300, padding: 15, background: C.dark, color: 'white', border: 'none', borderRadius: 6, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>{t.pwd_btn}</button>
    </div>
  )
}
