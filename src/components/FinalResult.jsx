import { useState } from 'react'
import { C, fH } from '../lib/theme.js'
import { useLang } from '../context/LangContext.jsx'
import { TIERS, TOTAL_DROPS } from '../data/oils.js'
import { saveFormula } from '../lib/supabase.js'

const GOOGLE_REVIEW_URL = 'https://g.page/r/CYstTYxeAPArEAE/review'
const SCALES = [{ key: 'scale_30', factor: 15 }, { key: 'scale_50', factor: 22.5 }]

export default function FinalResult({ formula, clientName, clientEmail, emphasis, sampleNum, onNew }) {
  const { t } = useLang()
  const [perfumeName, setPerfumeName] = useState('')
  const [step,    setStep]    = useState('name')
  const [scaleIdx, setScaleIdx] = useState(null)
  const [saved,   setSaved]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [reviewed,setReviewed]= useState(false)

  const empLabel = t.emp.find(e=>e.value===emphasis)?.label || emphasis
  const totalG   = formula.oils.reduce((s,o)=>s+o.g,0)
  const totalDr  = formula.oils.reduce((s,o)=>s+o.drops,0)

  const doSave = async () => {
    setSaving(true)
    await saveFormula({ clientName, clientEmail, emphasis, oils: formula.oils, warnings: formula.warnings, perfumeName })
    setSaving(false); setSaved(true)
  }

  if (step === 'name') return (
    <div className="screen-up" style={{ position: 'fixed', inset: 0, background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ fontFamily: fH, fontSize: 10, letterSpacing: '0.35em', color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Sok Studios</div>
      <div style={{ fontFamily: fH, fontSize: 36, fontWeight: 300, lineHeight: 1.1, marginBottom: 8, textAlign: 'center' }}>{t.fname_title}</div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 40, textAlign: 'center', lineHeight: 1.7 }}>{t.fname_sub}</div>
      <input value={perfumeName} onChange={e=>setPerfumeName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&perfumeName.trim()&&setStep('formula')}
        placeholder={t.fname_ph} autoFocus
        style={{ width:'100%', maxWidth:340, padding:'14px 18px', border:`1px solid ${C.border}`, borderRadius:6, fontSize:16, outline:'none', background:'#FFF', color:C.dark, textAlign:'center', fontFamily:fH, fontStyle:perfumeName?'italic':'normal' }}
        onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border} />
      <div style={{ fontSize: 12, color: '#B8A898', marginTop: 10, marginBottom: 32 }}>{t.fname_crafted} {clientName}</div>
      <button onClick={()=>setStep('formula')} disabled={!perfumeName.trim()}
        style={{ width:'100%', maxWidth:340, padding:15, background:perfumeName.trim()?C.dark:C.border, color:perfumeName.trim()?'white':C.mid, border:'none', borderRadius:6, fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', cursor:perfumeName.trim()?'pointer':'not-allowed', transition:'all 0.2s' }}>
        {t.fname_btn}
      </button>
      <button onClick={()=>setStep('formula')} style={{ marginTop:12, background:'none', border:'none', color:'#B8A898', fontSize:12, cursor:'pointer' }}>{t.fname_skip}</button>
    </div>
  )

  return (
    <div className="screen-up" style={{ maxWidth:600, margin:'0 auto', padding:'36px 20px 100px', color:C.dark, minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:28, padding:'28px 20px', background:C.dark, borderRadius:12 }}>
        <div style={{ fontFamily:fH, fontSize:11, letterSpacing:'0.35em', color:C.gold, textTransform:'uppercase', marginBottom:10 }}>Your Signature Formula</div>
        {perfumeName && <div style={{ fontFamily:fH, fontSize:32, fontStyle:'italic', fontWeight:300, color:'white', marginBottom:6 }}>{perfumeName}</div>}
        <div style={{ fontFamily:fH, fontSize:18, fontWeight:300, color:C.goldLight, opacity:0.8 }}>{t.fname_crafted} {clientName}</div>
        <div style={{ fontSize:11, color:C.goldLight, opacity:0.6, marginTop:4 }}>{t.result_sample} {sampleNum} · {empLabel}</div>
      </div>

      {TIERS.map(tier => {
        const tLabel = {top:t.note_top,middle:t.note_mid,base:t.note_base}[tier]
        const tOils = formula.oils.filter(o=>o.tier===tier.charAt(0).toUpperCase()+tier.slice(1))
        if (!tOils.length) return null
        const tDrops = tOils.reduce((s,o)=>s+o.drops,0)
        const tPct = Math.round((tDrops/TOTAL_DROPS)*100)
        return (
          <div key={tier} style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
              <span style={{ fontFamily:fH, fontSize:18, fontStyle:'italic' }}>{tLabel} Note</span>
              <span style={{ fontSize:11, color:C.gold }}>{tPct}%</span>
            </div>
            <div style={{ height:2, background:C.border, borderRadius:2, marginBottom:8, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${tPct}%`, background:C.gold }} />
            </div>
            {tOils.map(oil => (
              <div key={oil.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:oil.isHero?C.goldLight+'55':'#FFF', borderRadius:4, border:`1px solid ${oil.isHero?C.gold+'55':C.border}`, marginBottom:5 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  {oil.isHero && <span style={{ fontSize:9, color:C.gold, textTransform:'uppercase' }}>{t.main_label}</span>}
                  <span style={{ fontSize:14 }}>{oil.name}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                    <span style={{ fontFamily:fH, fontSize:22 }}>{oil.g.toFixed(3)}</span>
                    <span style={{ fontSize:10, color:C.mid }}>g</span>
                  </div>
                  <div style={{ fontSize:10, color:'#B0A090' }}>{oil.drops} {t.result_drops}</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderTop:`1px solid ${C.border}`, marginBottom:20 }}>
        <span style={{ fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:C.mid }}>{t.result_total}</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
          <span style={{ fontFamily:fH, fontSize:24 }}>{totalG.toFixed(3)}</span>
          <span style={{ fontSize:11, color:C.mid }}>g · {totalDr} {t.result_drops}</span>
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {SCALES.map((s,i) => (
          <button key={s.key} onClick={()=>setScaleIdx(scaleIdx===i?null:i)}
            style={{ flex:1, padding:'9px 14px', background:scaleIdx===i?C.dark:'#FFF', color:scaleIdx===i?'white':C.mid, border:`1px solid ${scaleIdx===i?C.dark:C.border}`, borderRadius:4, fontSize:11, cursor:'pointer', transition:'all 0.15s' }}>
            {t[`final_${s.key}`]}
          </button>
        ))}
      </div>

      {scaleIdx !== null && (
        <div className="fade" style={{ background:'#FFF', border:`1px solid ${C.border}`, borderRadius:4, padding:'14px 16px', marginBottom:20 }}>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:C.gold, marginBottom:10 }}>{t[`final_${SCALES[scaleIdx].key}`]}</div>
          {formula.oils.map(oil => (
            <div key={oil.id} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:13 }}>{oil.name}</span>
              <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                <span style={{ fontFamily:fH, fontSize:18 }}>{(oil.g*SCALES[scaleIdx].factor).toFixed(3)}</span>
                <span style={{ fontSize:10, color:C.mid }}>g</span>
              </div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8 }}>
            <span style={{ fontSize:12, color:C.mid }}>Total</span>
            <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
              <span style={{ fontFamily:fH, fontSize:20 }}>{(totalG*SCALES[scaleIdx].factor).toFixed(3)}</span>
              <span style={{ fontSize:10, color:C.mid }}>g</span>
            </div>
          </div>
        </div>
      )}

      {/* Saved confirmation */}
      {saved && (
        <div className="fade" style={{ background:C.goldLight+'50', border:`1px solid ${C.goldLight}`, borderRadius:8, padding:'14px 18px', marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:14, color:C.dark, marginBottom:4 }}>✓ {t.final_saved_msg}</div>
          <div style={{ fontSize:12, color:C.mid }}>{t.final_reorder}</div>
        </div>
      )}

      <button onClick={doSave} disabled={saved||saving}
        style={{ width:'100%', padding:14, marginBottom:10, border:'none', borderRadius:6, cursor:saved?'default':'pointer', fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', background:saved?C.goldLight:C.dark, color:saved?C.gold:'white' }}>
        {saving?'...' : saved?t.final_saved_btn : t.final_save_btn}
      </button>

      <button onClick={()=>{ window.open(GOOGLE_REVIEW_URL,'_blank'); setReviewed(true) }}
        style={{ width:'100%', padding:14, marginBottom:10, border:`1px solid ${C.border}`, borderRadius:6, cursor:'pointer', fontSize:13, background:reviewed?C.goldLight+'60':'#FFF', color:reviewed?C.gold:C.dark, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        {reviewed ? t.final_reviewed : t.final_review_btn}
      </button>

      <button onClick={onNew} style={{ width:'100%', padding:14, background:'none', color:'#B0A090', border:'none', cursor:'pointer', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase' }}>
        {t.final_new}
      </button>
    </div>
  )
}
