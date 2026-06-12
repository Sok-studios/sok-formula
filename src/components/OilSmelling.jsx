import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'

const SCALE_COLORS = ['#EEE2C8', '#D4B96A', '#C4953A', '#9A7A42', '#231410']
const SCALE_TEXT_COLORS = ['#6B4D3A', '#231410', '#FFF', '#FFF', '#FFF']

export default function OilSmelling({ tier, oils, onContinue, isLast, onBack }) {
  const { t } = useLang()
  const [ratings, setRatings] = useState({}) // { oilId: 1-5 }

  const ratedCount = Object.keys(ratings).length
  const titles = { top: t.smell_top_title, middle: t.smell_mid_title, base: t.smell_base_title }
  const title = titles[tier]
  const continueLabel = tier === 'top' ? t.smell_continue : tier === 'middle' ? t.smell_continue_base : t.smell_continue_done

  return (
    <div className="screen" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.gold, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, cursor: 'pointer' }}>{t.back}</button>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 6 }}>Sok Studios</div>
        <div style={{ fontFamily: fH, fontSize: 32, fontWeight: 300, lineHeight: 1 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.mid, marginTop: 6 }}>
          {ratedCount} {t.smell_rated} {t.smell_of} {oils.length}
        </div>
      </div>

      {/* Scale legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.mid, marginBottom: 20, letterSpacing: '0.06em' }}>
        <span>{t.smell_scale_no}</span>
        <span>{t.smell_scale_yes}</span>
      </div>

      {/* Oil list */}
      <div style={{ marginBottom: 28 }}>
        {oils.map(oil => {
          const rating = ratings[oil.id]
          return (
            <div key={oil.id} style={{ background: '#FFF', border: `1px solid ${rating ? C.gold+'55' : C.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 10, transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 400 }}>{oil.name}</span>
                  {oil.maxDrops !== undefined && <span style={{ fontSize: 9, color: C.red }}>MAX</span>}
                </div>
                {rating && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: SCALE_COLORS[rating-1] }} />
                )}
              </div>
              {/* 5-level color intensity bar */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(level => (
                  <button key={level} onClick={() => setRatings(prev => ({ ...prev, [oil.id]: level }))}
                    style={{
                      flex: 1, height: 36, borderRadius: 6, border: `2px solid ${rating===level ? '#000' : 'transparent'}`,
                      background: SCALE_COLORS[level-1], cursor: 'pointer', transition: 'all 0.1s',
                      transform: rating===level ? 'scale(1.08)' : 'scale(1)',
                    }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={() => onContinue(ratings)}
        style={{ width: '100%', padding: 16, background: C.dark, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
        {continueLabel}
      </button>
      {ratedCount < oils.length && (
        <div style={{ fontSize: 11, color: '#B8A898', textAlign: 'center', marginTop: 10 }}>
          {oils.length - ratedCount} oils unrated — you can still continue
        </div>
      )}
    </div>
  )
}
