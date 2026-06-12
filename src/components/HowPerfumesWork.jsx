import { C, fH } from '../lib/theme.js'

const NOTES = [
  {
    tier: 'Top Note',
    emoji: '✨',
    time: 'First ~15 minutes',
    desc: '처음 맡는 향. 가장 먼저 느껴지고 가장 빨리 날아가요. 첫인상을 만들어요.',
    color: C.gold,
  },
  {
    tier: 'Middle Note',
    emoji: '🌸',
    time: '15 min ~ 4 hours',
    desc: '향수의 심장. 탑 노트가 사라진 후 드러나요. 향수의 가장 큰 캐릭터를 담아요.',
    color: '#8B6914',
  },
  {
    tier: 'Base Note',
    emoji: '🪵',
    time: '4 hours ~ 그 이후',
    desc: '가장 오래 남는 향. 피부에 스며들어 하루 종일 은은하게 남아요.',
    color: C.dark,
  },
]

export default function HowPerfumesWork({ onContinue }) {
  return (
    <div className="screen" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>
          Sok Studios · Step 3
        </div>
        <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
          How Perfumes Work
        </div>
        <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.7 }}>
          향수는 세 개의 레이어로 이루어져 있어요.<br />각 레이어가 시간에 따라 순서대로 느껴져요.
        </div>
      </div>

      {/* Timeline visual */}
      <div style={{ position: 'relative', marginBottom: 36 }}>
        {NOTES.map((note, i) => (
          <div key={note.tier} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {/* Timeline dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: note.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {note.emoji}
              </div>
              {i < NOTES.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 20, background: C.border, margin: '4px 0' }} />
              )}
            </div>
            {/* Content */}
            <div style={{ background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: fH, fontSize: 18, fontWeight: 400 }}>{note.tier}</span>
                <span style={{ fontSize: 11, color: note.color, background: note.color + '15', borderRadius: 20, padding: '2px 10px' }}>
                  {note.time}
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.6 }}>{note.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote from guidebook */}
      <div style={{ background: C.goldLight + '40', border: `1px solid ${C.goldLight}`, borderRadius: 8, padding: '18px 20px', marginBottom: 32 }}>
        <div style={{ fontFamily: fH, fontSize: 15, fontStyle: 'italic', color: C.dark, lineHeight: 1.7, textAlign: 'center' }}>
          "Think of your scent as a person — first impression, character, and the feeling they leave behind."
        </div>
      </div>

      <button onClick={onContinue}
        style={{ width: '100%', padding: 16, background: C.dark, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
        향료 고르러 가기 →
      </button>
    </div>
  )
}
