import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase

// ── Formulas ──────────────────────────────────────────────

export async function saveFormula(data) {
  const { error } = await supabase.from('formulas').insert([{
    client_name:  data.clientName || null,
    emphasis:     data.emphasis,
    oils:         data.oils,
    warnings:     data.warnings,
    total_g:      data.oils.reduce((s, o) => s + o.g, 0),
    total_drops:  data.oils.reduce((s, o) => s + o.drops, 0),
  }])
  return error
}

export async function getAllFormulas() {
  const { data, error } = await supabase
    .from('formulas')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// ── Session config ─────────────────────────────────────────

export async function getSessionOils() {
  const { data } = await supabase
    .from('session_config')
    .select('active_ids')
    .eq('id', 1)
    .single()
  return data?.active_ids || null
}

export async function setSessionOils(ids) {
  const { error } = await supabase
    .from('session_config')
    .upsert([{ id: 1, active_ids: ids, updated_at: new Date().toISOString() }])
  return error
}

// ── Oil config (overrides + custom oils) ──────────────────

export async function getOilConfig() {
  const { data } = await supabase
    .from('oil_config')
    .select('*')
    .eq('active', true)
  return data || []
}

export async function upsertOilOverride(oilId, maxDrops) {
  // Delete existing override for this oil first
  await supabase.from('oil_config').delete().eq('type', 'override').eq('oil_id', oilId)
  // Insert new override (null maxDrops = remove cap)
  if (maxDrops !== null) {
    const { error } = await supabase.from('oil_config').insert([{
      type: 'override', oil_id: oilId, tier: '', name: '', max_drops: maxDrops, active: true
    }])
    return error
  }
  return null
}

export async function addCustomOil(tier, name, maxDrops) {
  const id = 'c_' + Date.now()
  const { error } = await supabase.from('oil_config').insert([{
    type: 'custom', oil_id: id, tier, name, max_drops: maxDrops || null, active: true
  }])
  return error
}

export async function deleteCustomOil(id) {
  const { error } = await supabase.from('oil_config').delete().eq('id', id)
  return error
}
