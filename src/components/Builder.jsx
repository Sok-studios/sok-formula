import { C, fH } from '../lib/theme.js'
import { TIERS, EMPHASIS_OPTIONS } from '../data/oils.js'

export default function Builder({ selected, heroes, emphasis, clientName, activeOils, toggleOil, setHeroes, setEmphasis, setClientName, onBuild }) {
  const totalSel = TIERS.reduce((s, t) => s + selected[t].length, 0)

  return (
    <div>
      {/* Client name */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.mid, marginBottom: 8 }}>
          Client Name
        </div>
        <input
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          placeholder="Optional"
          style={{ width: '100%', padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 14, color: C.dark, outline: 'none' }}
        />
      </div>

      {/* Tiers */}
      {TIERS.map(tier => {
        const oils   = activeOils(tier)
        const sel    = selected[tier]
        const heroId = heroes[tier] || sel[0]?.id
        return (
          <div key={tier} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: fH, fontSize: 19, fontStyle: 'italic' }}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)} Note
              </span>
              {sel.length > 0 && (
                <span style={{ fontSize: 11, background: C.goldLight, color: C.gold, borderRadius: 20, padding: '2px 8px' }}>
                  {sel.length}/3
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {oils.map(oil => {
                const isSel  = !!sel.find(o => o.id === oil.id)
                const isDis  = !isSel && sel.length >= 3
                const isHero = isSel && sel.length > 1 && oil.id === heroId
                return (
                  <button
                    key={oil.id}
                    onClick={() => !isDis && toggleOil(tier, oil)}
                    style={{
                      padding: '6px 12px', borderRadius: 24, fontSize: 12.5,
                      cursor: isDis ? 'not-allowed' : 'pointer',
                      fontWeight: oil.maxDrops !== undefined ? 500 : 300,
                      transition: 'all 0.1s',
                      background: isSel ? (isHero ? C.gold : C.dark) : C.card,
                      color: isSel ? 'white' : isDis ? '#CCC' : oil.maxDrops !== undefined ? C.red : C.dark,
                      border: `1px solid ${isSel ? (isHero ? C.gold : C.dark) : isDis ? '#EEE' : oil.maxDrops !== undefined ? C.red + '55' : C.border}`,
                      opacity: isDis ? 0.35 : 1,
                    }}
                  >
                    {oil.name}
                    {oil.maxDrops !== undefined && (
                      <span style={{ fontSize: 8, marginLeft: 4, opacity: 0.65 }}>MAX</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Hero selector */}
            {sel.length > 1 && (
              <div style={{ marginTop: 10, padding: '10px 14px', background: C.goldLight + '40', borderRadius: 4, border: `1px solid ${C.goldLight}` }}>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.gold, marginBottom: 7 }}>
                  Main scent
                </div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {sel.map(oil => (
                    <button
                      key={oil.id}
                      onClick={() => setHeroes(h => ({ ...h, [tier]: oil.id }))}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.1s',
                        background: oil.id === heroId ? C.gold : C.card,
                        color:      oil.id === heroId ? 'white' : C.mid,
                        border:     `1px solid ${oil.id === heroId ? C.gold : C.border}`,
                      }}
                    >
                      {oil.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Emphasis */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.mid, marginBottom: 10 }}>
          Emphasis
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {EMPHASIS_OPTIONS.map(e => (
            <button
              key={e.value}
              onClick={() => setEmphasis(e.value)}
              style={{
                padding: '11px 14px', borderRadius: 4, textAlign: 'left', cursor: 'pointer', transition: 'all 0.12s',
                background: emphasis === e.value ? C.dark : C.card,
                color:      emphasis === e.value ? 'white' : C.dark,
                border:     `1px solid ${emphasis === e.value ? C.dark : C.border}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500 }}>{e.label}</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2, fontWeight: 300 }}>{e.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onBuild}
        disabled={totalSel === 0}
        style={{
          width: '100%', padding: 15, border: 'none', borderRadius: 4,
          cursor: totalSel === 0 ? 'not-allowed' : 'pointer',
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s',
          background: totalSel === 0 ? C.border : C.dark,
          color:      totalSel === 0 ? C.mid : 'white',
        }}
      >
        Build Formula
      </button>
      <div style={{ fontSize: 10, color: '#B8A898', textAlign: 'center', marginTop: 8 }}>
        MAX = usage cap · gold = main scent
      </div>
    </div>
  )
}
