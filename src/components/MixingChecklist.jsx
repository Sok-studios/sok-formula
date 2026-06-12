import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

export default function MixingChecklist({ formula, sampleNum, onDone }) {
  const { t } = useLang()
  const [checked, setChecked] = useState({})
  const total = formula.oils.length
  const doneCount = Object.values(checked).filter(Boolean).length
  const allDone = doneCount === total

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="screen-up" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios · Sample {sampleNum}</div>
        <div style={{ fontFamily: fH, fontSize: 32, fontWeight: 300, lineHeight: 1.1, marginBottom: 8 }}>{t.mix_title}</div>
        <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.6 }}>{t.mix_sub}</div>
      </div>

      {/* Warning */}
      <div style={{ background: C.goldLight+'50', border: `1px solid ${C.goldLight}`, borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: C.dark }}>
        {t.mix_tip}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: C.mid }}>{doneCount} / {total} {t.mix_added}</span>
        <div style={{ width: 120, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(doneCount/total)*100}%`, background: C.gold, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Oil checklist */}
      {['Top','Middle','Base'].map(tier => {
        const tOils = formula.oils.filter(o => o.tier === tier)
        if (!tOils.length) return null
        return (
          <div key={tier} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: fH, fontSize: 16, fontStyle: 'italic', color: C.mid, marginBottom: 8 }}>{tier} Note</div>
            {tOils.map(oil => (
              <button key={oil.id} onClick={() => toggle(oil.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  background: checked[oil.id] ? C.goldLight+'60' : '#FFF',
                  border: `1px solid ${checked[oil.id] ? C.gold : C.border}`,
                  borderRadius: 8, marginBottom: 8, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                {/* Checkbox */}
                <div style={{ width: 26, height: 26, borderRadius: 6, border: `2px solid ${checked[oil.id] ? C.gold : C.border}`, background: checked[oil.id] ? C.gold : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {checked[oil.id] && <span style={{ color: 'white', fontSize: 14, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 400, color: checked[oil.id] ? C.mid : C.dark, textDecoration: checked[oil.id] ? 'line-through' : 'none' }}>
                    {oil.name}
                    {oil.isHero && <span style={{ fontSize: 10, color: C.gold, marginLeft: 8, textDecoration: 'none' }}>Main</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: fH, fontSize: 20, color: C.dark }}>{oil.g.toFixed(3)}</div>
                  <div style={{ fontSize: 10, color: C.mid }}>{t.mix_note} · {oil.drops} drops</div>
                </div>
              </button>
            ))}
          </div>
        )
      })}

      <button onClick={onDone} disabled={!allDone}
        style={{
          width: '100%', padding: 16, border: 'none', borderRadius: 8, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
          background: allDone ? C.dark : C.border,
          color: allDone ? 'white' : C.mid,
          cursor: allDone ? 'pointer' : 'not-allowed',
        }}>
        {t.mix_btn}
      </button>
    </div>
  )
}
