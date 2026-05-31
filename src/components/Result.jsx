import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { EMPHASIS_OPTIONS, TIERS, TOTAL_DROPS } from '../data/oils.js'
import { saveFormula } from '../lib/supabase.js'

export default function Result({ formula, clientName, emphasis, onEdit, onNew }) {
  const [saved,     setSaved]     = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [showConv,  setShowConv]  = useState(false)
  const [saveError, setSaveError] = useState('')

  const empLabel = EMPHASIS_OPTIONS.find(e => e.value === emphasis)?.label
  const totalG   = formula.oils.reduce((s, o) => s + o.g, 0)
  const totalDr  = formula.oils.reduce((s, o) => s + o.drops, 0)

  const doSave = async () => {
    setSaving(true)
    setSaveError('')
    const err = await saveFormula({ clientName, emphasis, oils: formula.oils, warnings: formula.warnings })
    setSaving(false)
    if (err) {
      setSaveError('Save failed. Check your connection.')
    } else {
      setSaved(true)
    }
  }

  return (
    <div>
      <button onClick={onEdit}
        style={{ background: 'none', border: 'none', color: C.gold, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: 0, marginBottom: 20, cursor: 'pointer' }}>
        ← Edit
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: fH, fontSize: 28, fontWeight: 300, fontStyle: clientName ? 'normal' : 'italic' }}>
            {clientName || 'Untitled'}
          </div>
          <div style={{ fontSize: 11, color: C.mid, marginTop: 2 }}>
            {new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ fontSize: 11, background: C.goldLight, color: C.gold, borderRadius: 20, padding: '4px 12px' }}>
          {empLabel}
        </div>
      </div>

      {TIERS.map(t => t.charAt(0).toUpperCase() + t.slice(1)).map(tier => {
        const tOils  = formula.oils.filter(o => o.tier === tier)
        if (!tOils.length) return null
        const tDrops = tOils.reduce((s, o) => s + o.drops, 0)
        const tPct   = Math.round((tDrops / TOTAL_DROPS) * 100)
        return (
          <div key={tier} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic' }}>{tier} Note</span>
              <span style={{ fontSize: 11, color: C.gold }}>{tPct}% · {tDrops} drops</span>
            </div>
            <div style={{ height: 2, background: C.border, borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${tPct}%`, background: C.gold, borderRadius: 2 }} />
            </div>
            {tOils.map(oil => (
              <div key={oil.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: oil.isHero ? C.goldLight + '55' : C.card, borderRadius: 4, border: `1px solid ${oil.isHero ? C.gold + '55' : C.border}`, marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {oil.isHero && <span style={{ fontSize: 9, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Main</span>}
                  <span style={{ fontSize: 14 }}>{oil.name}</span>
                  {oil.isCapped && <span style={{ fontSize: 9, color: C.red }}>MAX</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: fH, fontSize: 22 }}>{oil.g.toFixed(3)}</span>
                    <span style={{ fontSize: 10, color: C.mid }}>g</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B0A090' }}>{oil.drops} drops · {oil.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {formula.warnings?.length > 0 && (
        <div style={{ background: '#FFF7F4', border: `1px solid ${C.red}40`, borderRadius: 4, padding: '10px 14px', marginBottom: 14 }}>
          {formula.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: C.red, lineHeight: 1.65 }}>⚠ {w}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${C.border}`, marginBottom: 12 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mid }}>Total</span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: fH, fontSize: 24 }}>{totalG.toFixed(3)}</span>
            <span style={{ fontSize: 11, color: C.mid }}>g</span>
          </div>
          <div style={{ fontSize: 10, color: '#B0A090' }}>{totalDr} drops</div>
        </div>
      </div>

      {/* 30g converter */}
      <button onClick={() => setShowConv(v => !v)}
        style={{ width: '100%', padding: '9px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 11, color: C.mid, cursor: 'pointer', marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {showConv ? '▲ Hide 30g Scale-Up' : '▼ Scale to 30g (×15)'}
      </button>

      {showConv && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>30g Formula · ×15</div>
          {formula.oils.map(oil => (
            <div key={oil.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {oil.isHero && <span style={{ fontSize: 9, color: C.gold }}>Main</span>}
                <span style={{ fontSize: 13 }}>{oil.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: fH, fontSize: 18 }}>{(oil.g * 15).toFixed(3)}</span>
                <span style={{ fontSize: 10, color: C.mid }}>g</span>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <span style={{ fontSize: 12, color: C.mid }}>Total</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: fH, fontSize: 20 }}>{(totalG * 15).toFixed(3)}</span>
              <span style={{ fontSize: 10, color: C.mid }}>g</span>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div style={{ fontSize: 12, color: C.red, marginBottom: 10, textAlign: 'center' }}>{saveError}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={doSave} disabled={saved || saving}
          style={{ padding: 13, border: 'none', borderRadius: 4, cursor: saved ? 'default' : 'pointer', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', background: saved ? C.goldLight : C.dark, color: saved ? C.gold : 'white' }}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Formula'}
        </button>
        <button onClick={onNew}
          style={{ padding: 13, background: C.card, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          New Formula
        </button>
      </div>
    </div>
  )
}
