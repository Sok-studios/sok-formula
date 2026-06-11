import { useState, useEffect } from 'react'
import { C, fH } from '../lib/theme.js'
import { ALL_OILS, TIERS, EMPHASIS_OPTIONS } from '../data/oils.js'
import { getAllFormulas, getSessionConfig, setSessionOils, setSessionPassword, setVialOrder, getOilConfig, upsertOilOverride, addCustomOil, deleteCustomOil } from '../lib/supabase.js'
import { SCENT_FAMILIES, DEFAULT_VIAL_ORDER } from '../data/families.js'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234'

export default function Admin({ oilConfig, vialOrder: initVialOrder, onSessionUpdate, onOilConfigChange, onPasswordChange, onVialOrderChange }) {
  const [authed,   setAuthed]   = useState(false)
  const [pin,      setPin]      = useState('')
  const [pinError, setPinError] = useState(false)
  const [tab,      setTab]      = useState('formulas')
  const [formulas, setFormulas] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [pending,  setPending]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  // Session password
  const [pwdInput,    setPwdInput]    = useState('')
  const [savingPwd,   setSavingPwd]   = useState(false)
  const [currentPwd,  setCurrentPwd]  = useState('')

  // Vial order
  const [pendingVials, setPendingVials] = useState(null)
  const [savingVials,  setSavingVials]  = useState(false)

  // Oil management
  const [editingMax, setEditingMax] = useState({})
  const [newOil,     setNewOil]     = useState({ tier: 'top', name: '', maxDrops: '' })
  const [addingOil,  setAddingOil]  = useState(false)

  const doLogin = () => {
    if (pin === ADMIN_PIN) { setAuthed(true); loadData() }
    else { setPinError(true); setPin('') }
  }

  const loadData = async () => {
    setLoading(true)
    const [{ data }, cfg] = await Promise.all([getAllFormulas(), getSessionConfig()])
    setFormulas(data || [])
    const ids = cfg.active_ids
    const allIds = TIERS.flatMap(t => ALL_OILS[t].map(o => o.id))
    const obj = {}
    allIds.forEach(id => { obj[id] = ids ? ids.includes(id) : true })
    setPending(obj)
    setCurrentPwd(cfg.session_password || '')
    setPwdInput(cfg.session_password || '')
    setPendingVials(cfg.vial_order || initVialOrder || DEFAULT_VIAL_ORDER)
    setLoading(false)
  }

  const effectiveOils = (() => {
    const result = { top: [], middle: [], base: [] }
    for (const tier of TIERS) result[tier] = ALL_OILS[tier].map(o => ({ ...o }))
    for (const cfg of oilConfig) {
      if (cfg.type === 'override') {
        for (const tier of TIERS) {
          const oil = result[tier].find(o => o.id === cfg.oil_id)
          if (oil) oil.maxDrops = cfg.max_drops
        }
      } else if (cfg.type === 'custom' && cfg.active) {
        result[cfg.tier]?.push({ id: cfg.oil_id, name: cfg.name, maxDrops: cfg.max_drops, _configId: cfg.id, isCustom: true })
      }
    }
    return result
  })()

  const doSaveSession = async () => {
    setSaving(true); setMsg('')
    const ids = Object.keys(pending).filter(id => pending[id])
    const err = await setSessionOils(ids)
    setSaving(false)
    if (err) setMsg('저장 실패')
    else { setMsg('세션 저장됨'); onSessionUpdate(ids); setTimeout(() => setMsg(''), 2000) }
  }

  const doSavePassword = async () => {
    setSavingPwd(true)
    const err = await setSessionPassword(pwdInput.trim() || null)
    setSavingPwd(false)
    if (!err) {
      setCurrentPwd(pwdInput.trim())
      onPasswordChange(pwdInput.trim() || null)
      setMsg(pwdInput.trim() ? `세션 코드: "${pwdInput.trim()}" 저장됨` : '세션 코드 없음 (공개)')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const doSaveMax = async (oilId, val) => {
    const drops = val === '' || val === null ? null : parseInt(val)
    const err = await upsertOilOverride(oilId, drops)
    if (!err) { setEditingMax(e => { const n={...e}; delete n[oilId]; return n }); onOilConfigChange() }
  }

  const doSaveVials = async () => {
    setSavingVials(true)
    const err = await setVialOrder(pendingVials)
    setSavingVials(false)
    if (!err) { onVialOrderChange(pendingVials); setMsg('바이알 순서 저장됨'); setTimeout(() => setMsg(''), 2000) }
  }

  const doAddOil = async () => {
    if (!newOil.name.trim()) return
    setAddingOil(true)
    const err = await addCustomOil(newOil.tier, newOil.name.trim(), newOil.maxDrops ? parseInt(newOil.maxDrops) : null)
    setAddingOil(false)
    if (!err) { setNewOil({ tier: 'top', name: '', maxDrops: '' }); onOilConfigChange() }
  }

  const doDeleteOil = async (configId) => {
    await deleteCustomOil(configId); onOilConfigChange()
  }

  if (!authed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg, padding: 24 }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 28, fontWeight: 300, marginBottom: 28 }}>Admin</div>
      <input type="password" value={pin} onChange={e => { setPin(e.target.value); setPinError(false) }}
        onKeyDown={e => e.key === 'Enter' && doLogin()} placeholder="PIN"
        style={{ width: 160, padding: '12px 16px', border: `1px solid ${pinError ? C.red : C.border}`, borderRadius: 4, fontSize: 18, textAlign: 'center', outline: 'none', letterSpacing: '0.3em', background: '#FFF', color: C.dark }} />
      {pinError && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>PIN이 맞지 않아요</div>}
      <button onClick={doLogin}
        style={{ marginTop: 16, padding: '12px 32px', background: C.dark, color: 'white', border: 'none', borderRadius: 4, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
        Enter
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '36px 20px 80px', color: C.dark, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.32em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>Sok Studios</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: fH, fontSize: 32, fontWeight: 300 }}>Admin</div>
          <a href="/" style={{ fontSize: 11, color: C.mid, textDecoration: 'none', letterSpacing: '0.1em' }}>← Client view</a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 26 }}>
        {[{ v: 'formulas', label: `Formulas (${formulas.length})` }, { v: 'session', label: 'Session' }, { v: 'oils', label: 'Oils' }].map(({ v, label }) => (
          <button key={v} onClick={() => setTab(v)}
            style={{ background: 'none', border: 'none', padding: '7px 0', marginBottom: -1, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', color: tab === v ? C.dark : '#B0A090', borderBottom: `2px solid ${tab === v ? C.dark : 'transparent'}`, transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {msg && <div style={{ fontSize: 12, color: msg.includes('실패') ? C.red : C.gold, marginBottom: 14, textAlign: 'center' }}>{msg}</div>}
      {loading && <div style={{ textAlign: 'center', color: C.mid, padding: 40, fontFamily: fH, fontStyle: 'italic' }}>Loading...</div>}

      {/* FORMULAS */}
      {!loading && tab === 'formulas' && (
        <div>
          {!formulas.length ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: C.mid }}>
              <div style={{ fontFamily: fH, fontSize: 24, fontStyle: 'italic', marginBottom: 8 }}>아직 저장된 레시피가 없어요</div>
            </div>
          ) : formulas.map(item => (
            <div key={item.id} style={{ background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: fH, fontSize: 20, fontWeight: 300 }}>{item.client_name || '—'}</div>
                  <div style={{ fontSize: 11, color: C.mid, marginTop: 2 }}>
                    {new Date(item.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{EMPHASIS_OPTIONS.find(e => e.value === item.emphasis)?.label}
                    {' · '}{item.total_g?.toFixed(3)}g
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

      {/* SESSION */}
      {!loading && tab === 'session' && pending && (
        <div>
          {/* Password section */}
          <div style={{ background: C.goldLight + '40', border: `1px solid ${C.goldLight}`, borderRadius: 8, padding: '16px 18px', marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>세션 입장 코드</div>
            <div style={{ fontSize: 12, color: C.mid, marginBottom: 12 }}>
              비워두면 누구나 입장 가능. 입력하면 코드 아는 사람만 입장.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={pwdInput} onChange={e => setPwdInput(e.target.value)}
                placeholder="예: ROSE2026 또는 비워두기"
                style={{ flex: 1, padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 14, outline: 'none', background: '#FFF' }} />
              <button onClick={doSavePassword} disabled={savingPwd}
                style={{ padding: '10px 18px', background: C.dark, color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {savingPwd ? '...' : '저장'}
              </button>
            </div>
            {currentPwd && (
              <div style={{ fontSize: 12, color: C.mid, marginTop: 8 }}>
                현재 코드: <strong style={{ color: C.dark }}>{currentPwd}</strong>
              </div>
            )}
          </div>

          {/* Vial order */}
          {pendingVials && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.mid, marginBottom: 12 }}>
                블라인드 스멜링 바이알 순서
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {pendingVials.map((familyId, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 4 }}>
                    <span style={{ fontSize: 12, color: C.gold, fontWeight: 500, minWidth: 24 }}>#{i+1}</span>
                    <select value={familyId}
                      onChange={e => setPendingVials(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
                      style={{ flex: 1, border: 'none', background: 'none', fontSize: 12, color: C.dark, outline: 'none', cursor: 'pointer' }}>
                      {SCENT_FAMILIES.map(f => (
                        <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={doSaveVials} disabled={savingVials}
                style={{ width: '100%', padding: 12, background: C.mid, color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {savingVials ? '저장 중...' : '바이알 순서 저장'}
              </button>
            </div>
          )}

          {/* Oil curation */}
          <div style={{ fontSize: 13, color: C.mid, marginBottom: 16 }}>
            {Object.values(pending).filter(Boolean).length}개 향료 활성화됨
          </div>
          {TIERS.map(tier => {
            const tierOils = ALL_OILS[tier]
            const cnt = tierOils.filter(o => pending[o.id]).length
            return (
              <div key={tier} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic' }}>{tier.charAt(0).toUpperCase()+tier.slice(1)} Note</span>
                  <span style={{ fontSize: 11, color: C.gold }}>{cnt}/{tierOils.length}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tierOils.map(oil => {
                    const on = !!pending[oil.id]
                    return (
                      <button key={oil.id} onClick={() => setPending(p => ({ ...p, [oil.id]: !p[oil.id] }))}
                        style={{ padding: '5px 11px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.1s', background: on ? C.dark : '#FFF', color: on ? 'white' : '#AAA', border: `1px solid ${on ? C.dark : C.border}` }}>
                        {oil.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <button onClick={doSaveSession} disabled={saving}
            style={{ width: '100%', padding: 15, background: C.dark, color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {saving ? '저장 중...' : `세션 저장 (${Object.values(pending).filter(Boolean).length}개 향료)`}
          </button>
        </div>
      )}

      {/* OILS */}
      {!loading && tab === 'oils' && (
        <div>
          <div style={{ fontSize: 13, color: C.mid, marginBottom: 20 }}>맥스값 수정 및 향료 추가. 1 drop = 0.02g 기준.</div>
          {TIERS.map(tier => (
            <div key={tier} style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic', marginBottom: 12 }}>
                {tier.charAt(0).toUpperCase()+tier.slice(1)} Note
              </div>
              {effectiveOils[tier].map(oil => {
                const isDraft = oil.id in editingMax
                const draftVal = editingMax[oil.id] ?? ''
                const currentMax = oil.maxDrops !== undefined ? oil.maxDrops : ''
                return (
                  <div key={oil.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 5 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 13 }}>{oil.name}</span>
                      {oil.isCustom && <span style={{ fontSize: 9, color: C.gold }}>CUSTOM</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: C.mid, whiteSpace: 'nowrap' }}>max drops</span>
                      <input type="number" min="0" max="100"
                        value={isDraft ? draftVal : currentMax}
                        placeholder="none"
                        onChange={e => setEditingMax(prev => ({ ...prev, [oil.id]: e.target.value }))}
                        style={{ width: 56, padding: '4px 8px', border: `1px solid ${isDraft ? C.gold : C.border}`, borderRadius: 4, fontSize: 12, textAlign: 'center', outline: 'none', background: isDraft ? C.goldLight + '50' : C.bg }} />
                      {isDraft && (
                        <button onClick={() => doSaveMax(oil.id, draftVal)}
                          style={{ padding: '4px 10px', background: C.dark, color: 'white', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                          Save
                        </button>
                      )}
                      {oil.isCustom && (
                        <button onClick={() => doDeleteOil(oil._configId)}
                          style={{ padding: '4px 8px', background: 'none', color: C.red, border: `1px solid ${C.red}40`, borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          <div style={{ background: C.goldLight + '40', border: `1px solid ${C.goldLight}`, borderRadius: 4, padding: '16px 18px', marginTop: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>향료 추가</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select value={newOil.tier} onChange={e => setNewOil(n => ({ ...n, tier: e.target.value }))}
                style={{ padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, background: '#FFF', color: C.dark, outline: 'none' }}>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="base">Base</option>
              </select>
              <input value={newOil.name} onChange={e => setNewOil(n => ({ ...n, name: e.target.value }))}
                placeholder="향료 이름"
                style={{ flex: 1, minWidth: 140, padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, outline: 'none', background: '#FFF' }} />
              <input type="number" min="1" value={newOil.maxDrops} onChange={e => setNewOil(n => ({ ...n, maxDrops: e.target.value }))}
                placeholder="Max drops"
                style={{ width: 96, padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, outline: 'none', background: '#FFF', textAlign: 'center' }} />
              <button onClick={doAddOil} disabled={addingOil || !newOil.name.trim()}
                style={{ padding: '8px 18px', background: newOil.name.trim() ? C.dark : C.border, color: newOil.name.trim() ? 'white' : C.mid, border: 'none', borderRadius: 4, fontSize: 12, cursor: newOil.name.trim() ? 'pointer' : 'not-allowed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {addingOil ? '...' : '추가'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: C.mid, marginTop: 8 }}>Max drops 비워두면 캡 없음.</div>
          </div>
        </div>
      )}
    </div>
  )
}

