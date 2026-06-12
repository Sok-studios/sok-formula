import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { EMPHASIS_OPTIONS, TIERS, TOTAL_DROPS } from '../data/oils.js'
import { saveFormula } from '../lib/supabase.js'

const GOOGLE_REVIEW_URL = 'https://g.page/r/CYstTYxeAPArEAE/review'
const SCALES = [
  { label: '30ml', factor: 15 },
  { label: '50ml', factor: 22.5 },
]

export default function FinalResult({ formula, clientName, emphasis, sampleNum, onNew }) {
  const [perfumeName, setPerfumeName] = useState('')
  const [scaleIdx,    setScaleIdx]    = useState(null)
  const [saved,       setSaved]       = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [reviewed,    setReviewed]    = useState(false)
  const [step,        setStep]        = useState('name') // name | formula

  const empLabel = EMPHASIS_OPTIONS.find(e => e.value === emphasis)?.label
  const totalG   = formula.oils.reduce((s, o) => s + o.g, 0)
  const totalDr  = formula.oils.reduce((s, o) => s + o.drops, 0)

  const doSave = async () => {
    setSaving(true)
    await saveFormula({ clientName, emphasis, oils: formula.oils, warnings: formula.warnings, perfumeName })
    setSaving(false)
    setSaved(true)
  }

  const openReview = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank')
    setReviewed(true)
  }

  // Step 1: Name your perfume
  if (step === 'name') return (
    <div className="screen-up" style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 36, fontWeight: 300, lineHeight: 1.1, marginBottom: 8, textAlign: 'center' }}>
        Give your<br />perfume a name
      </div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 48, textAlign: 'center', lineHeight: 1.7 }}>
        By giving it a name,<br />this scent becomes truly yours.
      </div>

      <input
        value={perfumeName}
        onChange={e => setPerfumeName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && perfumeName.trim() && setStep('formula')}
        placeholder="향수 이름을 지어주세요"
        autoFocus
        style={{
          width: '100%', maxWidth: 340, padding: '14px 18px',
          border: `1px solid ${C.border}`, borderRadius: 6,
          fontSize: 16, outline: 'none', background: '#FFF', color: C.dark,
          textAlign: 'center', fontFamily: fH, fontStyle: perfumeName ? 'italic' : 'normal',
        }}
        onFocus={e => e.target.style.borderColor = C.gold}
        onBlur={e => e.target.style.borderColor = C.border}
      />

      <div style={{ fontSize: 12, color: '#B8A898', marginTop: 10, marginBottom: 32 }}>
        Crafted by {clientName}
      </div>

      <button onClick={() => setStep('formula')}
        disabled={!perfumeName.trim()}
        style={{
          width: '100%', maxWidth: 340, padding: 15,
          background: perfumeName.trim() ? C.dark : C.border,
          color: perfumeName.trim() ? 'white' : C.mid,
          border: 'none', borderRadius: 6,
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: perfumeName.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        }}>
        완성하기 →
      </button>

      <button onClick={() => setStep('formula')}
        style={{ marginTop: 12, background: 'none', border: 'none', color: '#B8A898', fontSize: 12, cursor: 'pointer' }}>
        이름 없이 진행하기
      </button>
    </div>
  )

  // Step 2: Final formula
  return (
    <div className="screen-up" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, padding: '28px 20px', background: C.dark, borderRadius: 12 }}>
        <div style={{ fontFamily: fH, fontSize: 11, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
          Your Signature Formula
        </div>
        {perfumeName && (
          <div style={{ fontFamily: fH, fontSize: 32, fontStyle: 'italic', fontWeight: 300, color: 'white', marginBottom: 6 }}>
            {perfumeName}
          </div>
        )}
        <div style={{ fontFamily: fH, fontSize: 18, fontWeight: 300, color: C.goldLight, opacity: 0.8 }}>
          Crafted by {clientName}
        </div>
        <div style={{ fontSize: 11, color: C.goldLight, opacity: 0.6, marginTop: 4 }}>
          Sample {sampleNum} · {empLabel}
        </div>
      </div>

      {/* Oils */}
      {TIERS.map(t => t.charAt(0).toUpperCase() + t.slice(1)).map(tier => {
        const tOils  = formula.oils.filter(o => o.tier === tier)
        if (!tOils.length) return null
        const tDrops = tOils.reduce((s, o) => s + o.drops, 0)
        const tPct   = Math.round((tDrops / TOTAL_DROPS) * 100)
        return (
          <div key={tier} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontFamily: fH, fontSize: 18, fontStyle: 'italic' }}>{tier} Note</span>
              <span style={{ fontSize: 11, color: C.gold }}>{tPct}%</span>
            </div>
            <div style={{ height: 2, background: C.border, borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${tPct}%`, background: C.gold }} />
            </div>
            {tOils.map(oil => (
              <div key={oil.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: oil.isHero ? C.goldLight + '55' : '#FFF', borderRadius: 4, border: `1px solid ${oil.isHero ? C.gold + '55' : C.border}`, marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {oil.isHero && <span style={{ fontSize: 9, color: C.gold, textTransform: 'uppercase' }}>Main</span>}
                  <span style={{ fontSize: 14 }}>{oil.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                    <span style={{ fontFamily: fH, fontSize: 22 }}>{oil.g.toFixed(3)}</span>
                    <span style={{ fontSize: 10, color: C.mid }}>g</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B0A090' }}>{oil.drops} drops</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${C.border}`, marginBottom: 20 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mid }}>Total</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontFamily: fH, fontSize: 24 }}>{totalG.toFixed(3)}</span>
          <span style={{ fontSize: 11, color: C.mid }}>g · {totalDr} drops</span>
        </div>
      </div>

      {/* Scale up */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {SCALES.map((s, i) => (
          <button key={s.label} onClick={() => setScaleIdx(scaleIdx === i ? null : i)}
            style={{ flex: 1, padding: '9px 14px', background: scaleIdx === i ? C.dark : '#FFF', color: scaleIdx === i ? 'white' : C.mid, border: `1px solid ${scaleIdx === i ? C.dark : C.border}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s' }}>
            {s.label} 스케일
          </button>
        ))}
      </div>

      {scaleIdx !== null && (
        <div className="fade" style={{ background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            {SCALES[scaleIdx].label} 기준 · ×{SCALES[scaleIdx].factor}
          </div>
          {formula.oils.map(oil => (
            <div key={oil.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13 }}>{oil.name}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: fH, fontSize: 18 }}>{(oil.g * SCALES[scaleIdx].factor).toFixed(3)}</span>
                <span style={{ fontSize: 10, color: C.mid }}>g</span>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontSize: 12, color: C.mid }}>Total</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: fH, fontSize: 20 }}>{(totalG * SCALES[scaleIdx].factor).toFixed(3)}</span>
              <span style={{ fontSize: 10, color: C.mid }}>g</span>
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <button onClick={doSave} disabled={saved || saving}
        style={{ width: '100%', padding: 14, marginBottom: 10, border: 'none', borderRadius: 6, cursor: saved ? 'default' : 'pointer', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', background: saved ? C.goldLight : C.dark, color: saved ? C.gold : 'white' }}>
        {saving ? '저장 중...' : saved ? '레시피 저장됨 ✓' : '레시피 저장하기'}
      </button>

      {/* Google Review */}
      <button onClick={openReview}
        style={{
          width: '100%', padding: 14, marginBottom: 10, border: `1px solid ${C.border}`,
          borderRadius: 6, cursor: 'pointer', fontSize: 13,
          background: reviewed ? C.goldLight + '60' : '#FFF',
          color: reviewed ? C.gold : C.dark, transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        <span style={{ fontSize: 16 }}>⭐</span>
        {reviewed ? '리뷰 감사해요! 💛' : '오늘 경험이 어떠셨나요? 리뷰 남기기'}
      </button>

      <button onClick={onNew}
        style={{ width: '100%', padding: 14, background: 'none', color: '#B0A090', border: 'none', cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        새로 만들기
      </button>
    </div>
  )
}
