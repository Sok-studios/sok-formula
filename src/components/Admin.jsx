import { useState, useEffect } from 'react'
import { C, fH } from '../lib/theme.js'
import { ALL_OILS, TIERS, EMPHASIS_OPTIONS } from '../data/oils.js'
import { getAllFormulas, getSessionOils, setSessionOils } from '../lib/supabase.js'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234'

export default function Admin({ onSessionUpdate }) {
  const [authed,    setAuthed]    = useState(false)
  const [pin,       setPin]       = useState('')
  const [pinError,  setPinError]  = useState(false)
  const [adminView, setAdminView] = useState('formulas') // formulas | session
  const [formulas,  setFormulas]  = useState([])
  const [loading,   setLoading]   = useState(false)
  const [pending,   setPending]   = useState(null) // { [id]: bool }
  const [saving,    setSaving]    = useState(false)
  const [saveMsg,   setSaveMsg]   = useState('')

  const doLogin = () => {
    if (pin === ADMIN_PIN) { setAuthed(true); loadData() }
    else { setPinError(true); setPin('') }
  }

  const loadData = async () => {
    setLoading(true)
    const { data } = await getAllFormulas()
    setFormulas(data || [])
    const ids = await getSessionOils()
    if (ids) {
      const obj = {}
      TIERS.flatMap(t => ALL_OILS[t]).forEach(o => { obj[o.id] = ids.includes(o.id) })
      setPending(obj)
    } else {
      const obj = {}
      TIERS.flatMap(t => ALL_OILS[t]).forEach(o => { obj[o.id] = true })
      setPending(obj)
    }
    setLoading(false)
  }

  const doSaveSession = async () => {
    setSaving(true)
    setSaveMsg('')
    const ids = Object.keys(pending).filter(id => pending[id])
    const err = await setSessionOils(ids)
    setSaving(false)
    if (err) {
      setSaveMsg('Save failed. Try again.')
    } else {
      setSaveMsg('Session saved.')
      onSessionUpdate(ids)
      setTimeout(() => setSaveMsg(''), 2000)
    }
  }

  if (!authed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg, padding: 24 }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 28, fontWeight: 300, marginBottom: 28 }}>Admin</div>
      <input
        type="password" value={pin} onChange={e => { setPin(e.target.value); setPinError(false) }}
        onKeyDown={e => e.key === 'Enter' && doLogin()}
        placeholder="PIN"
        style={{ width: 160, padding: '12px 16px', border: `1px solid ${pinError ? C.red : C.border}`, borderRadius: 4, fontSize: 18, textAlign: 'center', outline: 'none', letterSpacing: '0.3em', background: C.card, color: C.dark }}
      />
      {pinError && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>Incorrect PIN</div>}
      <button onClick={doLogin}
        style={{ marginTop: 16, padding: '12px 32px', background: C.dark, color: 'white', border: 'none', borderRadius: 4, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
        Enter
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '36px 20px 80px', fontFamily: 'inherit', color: C.dark, minHeight: '100vh' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>Sok Studios</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: fH, fontSize: 32, fontWeight: 300 }}>Admin</div>
          <a href="/" style={{ fontSize: 11, color: C.mid, textDecoration: 'none', letterSpacing: '0.1em' }}>← Client view</a>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 26 }}>
        {[{ v: 'formulas', label: `Formulas (${formulas.length})` }, { v: 'session', label: 'Session Setup' }].map(({ v, label }) => (
          <button key={v} onClick={() => setAdminView(v)}
            style={{ background: 'none', border: 'none', padding: '7px 0', marginBottom: -1, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', color: adminView === v ? C.dark : '#B0A090', borderBottom: `2px solid ${adminView === v ? C.dark : 'transparent'}`, transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', color: C.mid, padding: 40, fontFamily: fH, fontStyle: 'italic' }}>Loading...</div>}

      {/* Formulas */}
      {!loading && adminView === 'formulas' && (
        <div>
          {formulas.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: C.mid }}>
              <div style={{ fontFamily: fH, fontSize: 24, fontStyle: 'italic', marginBottom: 8 }}>No formulas yet</div>
            </div>
          ) : formulas.map(item => (
            <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: fH, fontSize: 20, fontWeight: 300 }}>{item.client_name || '—'}</div>
                  <div style={{ fontSize: 11, color: C.mid, marginTop: 2 }}>
                    {new Date(item.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{EMPHASIS_OPTIONS.find(e => e.value === item.emphasis)?.label}
                    {' · '}{item.total_g?.toFixed(3)}g · {item.total_drops} drops
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {item.oils?.map(o => (
                  <span key={o.id} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: o.isHero ? C.goldLight : C.bg, color: C.dark, border: `1px solid ${C.border}` }}>
                    {o.isHero && '★ '}{o.name} {o.g?.toFixed(3)}g
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session setup */}
      {!loading && adminView === 'session' && pending && (
        <div>
          <div style={{ fontSize: 13, color: C.mid, marginBottom: 20 }}>
            {Object.values(pending).filter(Boolean).length} oils active for this session.
            Clients will only see the oils you activate here.
          </div>

          {TIERS.map(tier => {
            const oils = ALL_OILS[tier]
            const cnt  = oils.filter(o => pending[o.id]).length
            return (
              <div key={tier} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic' }}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)} Note
                  </span>
                  <span style={{ fontSize: 11, color: C.gold }}>{cnt}/{oils.length}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {oils.map(oil => {
                    const on = !!pending[oil.id]
                    return (
                      <button key={oil.id}
                        onClick={() => setPending(p => ({ ...p, [oil.id]: !p[oil.id] }))}
                        style={{ padding: '5px 11px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.1s', background: on ? C.dark : C.card, color: on ? 'white' : '#AAA', border: `1px solid ${on ? C.dark : C.border}` }}>
                        {oil.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {saveMsg && (
            <div style={{ fontSize: 12, color: saveMsg.includes('failed') ? C.red : C.gold, marginBottom: 10, textAlign: 'center' }}>
              {saveMsg}
            </div>
          )}

          <button onClick={doSaveSession} disabled={saving}
            style={{ width: '100%', padding: 15, background: C.dark, color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {saving ? 'Saving...' : `Save Session (${Object.values(pending).filter(Boolean).length} oils)`}
          </button>
        </div>
      )}
    </div>
  )
}
