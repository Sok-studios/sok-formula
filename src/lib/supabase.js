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

// ── Session config (curated oil IDs) ──────────────────────

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
