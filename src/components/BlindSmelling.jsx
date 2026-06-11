import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { SCENT_FAMILIES } from '../data/families.js'

export default function BlindSmelling({ vialOrder, onDone }) {
  const [selected, setSelected] = useState(new Set())

  const toggle = (num) => {
    setSelected(prev => {
      const next = new Set([...prev])
      next.has(num) ? next.delete(num) : next.add(num)
      return next
    })
  }

  const handleDone = () => {
    const families = [...selected].sort((a,b) => a-b).map(num => vialOrder[num - 1]).filter(Boolean)
    onDone(families)
  }

  return (
    <div className="screen" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>
          Sok Studios · Step 2
        </div>
        <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
          Blind Smelling
        </div>
        <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.7 }}>
          Smell each vial and tap the ones that speak to you.<br />
          No labels. No right or wrong. Just notice how you feel.
        </div>
      </div>

      {/* Vials grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
        {Array.from({ length: vialOrder.length }, (_, i) => i + 1).map(num => {
          const isSel = selected.has(num)
          return (
            <button key={num} onClick={() => toggle(num)}
              style={{
                aspectRatio: '1', borderRadius: 16,
                border: `2px solid ${isSel ? C.gold : C.border}`,
                background: isSel ? C.dark : '#FFF',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
                transform: isSel ? 'scale(1.05)' : 'scale(1)',
              }}>
              <div style={{ fontFamily: fH, fontSize: 28, fontWeight: 300, color: isSel ? C.gold : C.mid }}>
                {num}
              </div>
              {isSel && (
                <div style={{ fontSize: 18, marginTop: 4 }}>✓</div>
              )}
            </button>
          )
        })}
      </div>

      {selected.size > 0 && (
        <div className="fade" style={{ fontSize: 12, color: C.gold, textAlign: 'center', marginBottom: 16 }}>
          {selected.size}개 선택됨
        </div>
      )}

      <button onClick={handleDone} disabled={selected.size === 0}
        style={{
          width: '100%', padding: 16, border: 'none', borderRadius: 8,
          background: selected.size > 0 ? C.dark : C.border,
          color: selected.size > 0 ? 'white' : C.mid,
          fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}>
        결과 보기 →
      </button>

      <div style={{ fontSize: 11, color: '#B8A898', textAlign: 'center', marginTop: 12 }}>
        끌리는 것만 고르면 돼요. 많이 골라도, 조금 골라도 괜찮아요.
      </div>
    </div>
  )
}
