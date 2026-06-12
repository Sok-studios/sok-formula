import { C, fH } from '../lib/theme.js'
import { SCENT_FAMILIES } from '../data/families.js'

function getScentProfile(families) {
  const ids = new Set(families)
  if (families.length === 0) return { name: 'Explorer', desc: '모든 가능성이 열려 있어요.' }

  const dark   = ['woody','animalic','balsamic','gourmand','spicy','liquor']
  const light  = ['fresh','citrus','green','aromatic']
  const warm   = ['floral','fruity','balsamic','gourmand','spicy']
  const bright = ['citrus','fruity','green','fresh']

  const darkCount  = families.filter(f => dark.includes(f)).length
  const lightCount = families.filter(f => light.includes(f)).length
  const warmCount  = families.filter(f => warm.includes(f)).length
  const brightCount= families.filter(f => bright.includes(f)).length

  if (ids.has('floral') && ids.has('fruity') && brightCount >= 2)
    return { name: 'Romantic & Bright', desc: '밝고 사랑스러운 향을 좋아해요. 꽃과 과일의 달콤함이 어우러진 당신만의 스토리예요.' }
  if (ids.has('woody') && ids.has('animalic'))
    return { name: 'Dark & Intimate', desc: '깊고 관능적인 향에 끌려요. 시간이 지날수록 더 매력적으로 변하는 향이에요.' }
  if (darkCount >= 3)
    return { name: 'Deep & Grounding', desc: '묵직하고 진한 향을 선호해요. 존재감 있고 오래 남는 향이에요.' }
  if (lightCount >= 3)
    return { name: 'Clean & Alive', desc: '맑고 생기 있는 향을 좋아해요. 상쾌하고 자연스러운 에너지예요.' }
  if (ids.has('gourmand') && warmCount >= 2)
    return { name: 'Warm & Comforting', desc: '따뜻하고 포근한 향에 끌려요. 기억 속 편안한 장소 같은 향이에요.' }
  if (ids.has('floral') && ids.has('woody'))
    return { name: 'Structured & Elegant', desc: '꽃의 섬세함과 우드의 단단함이 함께해요. 균형 잡힌 세련된 향이에요.' }
  if (brightCount >= 2 && warmCount >= 1)
    return { name: 'Playful & Warm', desc: '밝으면서도 따뜻한 향을 좋아해요. 활기차고 매력적인 향이에요.' }

  return { name: 'Unique & Layered', desc: '다양한 향에 끌리는 복합적인 취향이에요. 그게 당신을 더 특별하게 만들어요.' }
}

export default function ScentReveal({ selectedFamilies, onContinue }) {
  const families = SCENT_FAMILIES.filter(f => selectedFamilies.includes(f.id))
  const profile  = getScentProfile(selectedFamilies)

  return (
    <div className="screen" style={{ maxWidth: 600, margin: '0 auto', padding: '36px 20px 100px', color: C.dark, minHeight: '100vh' }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>
          Sok Studios · Scent Profile
        </div>
        <div style={{ fontFamily: fH, fontSize: 34, fontWeight: 300, lineHeight: 1.1 }}>
          당신의 향
        </div>
      </div>

      {/* Profile card */}
      <div style={{ background: C.dark, borderRadius: 12, padding: '28px 24px', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontFamily: fH, fontSize: 11, letterSpacing: '0.3em', color: C.goldLight, textTransform: 'uppercase', marginBottom: 12, opacity: 0.7 }}>
          Your scent personality
        </div>
        <div style={{ fontFamily: fH, fontSize: 30, fontWeight: 300, color: 'white', marginBottom: 12 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 14, color: C.goldLight, lineHeight: 1.7, opacity: 0.85 }}>
          {profile.desc}
        </div>
      </div>

      {/* Selected families */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.mid, marginBottom: 16 }}>
          당신이 선택한 향 ({families.length}개)
        </div>
        {families.map(f => (
          <div key={f.id} style={{ background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <span style={{ fontFamily: fH, fontSize: 18, fontWeight: 400 }}>{f.name}</span>
            </div>
            <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.6, marginBottom: 4 }}>{f.desc}</div>
            <div style={{ fontSize: 12, color: C.gold, fontStyle: 'italic' }}>→ {f.tagline}</div>
          </div>
        ))}
      </div>

      <button onClick={onContinue}
        style={{ width: '100%', padding: 16, background: C.dark, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
        향수 만들러 가기 →
      </button>
    </div>
  )
}
