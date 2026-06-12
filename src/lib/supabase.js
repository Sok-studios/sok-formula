import{createClient}from'@supabase/supabase-js'
const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)
export default supabase
export async function saveFormula(d){
  const{error}=await supabase.from('formulas').insert([{client_name:d.clientName||null,emphasis:d.emphasis,oils:d.oils,warnings:d.warnings,total_g:d.oils.reduce((s,o)=>s+o.g,0),total_drops:d.oils.reduce((s,o)=>s+o.drops,0),perfume_name:d.perfumeName||null,client_email:d.clientEmail||null,sample_num:d.sampleNum||null}])
  return error
}
export async function getAllFormulas(){
  const{data,error}=await supabase.from('formulas').select('*').order('created_at',{ascending:false})
  return{data:data||[],error}
}
export async function getSessionConfig(){
  const{data}=await supabase.from('session_config').select('active_ids,session_password,vial_order,available_50ml').eq('id',1).single()
  return data||{}
}
export async function setSessionOils(ids){const{error}=await supabase.from('session_config').upsert([{id:1,active_ids:ids,updated_at:new Date().toISOString()}]);return error}
export async function setSessionPassword(p){const{error}=await supabase.from('session_config').upsert([{id:1,session_password:p||null,updated_at:new Date().toISOString()}]);return error}
export async function setVialOrder(o){const{error}=await supabase.from('session_config').upsert([{id:1,vial_order:o,updated_at:new Date().toISOString()}]);return error}
export async function saveBlindResult(clientName,families){const{error}=await supabase.from('blind_results').insert([{client_name:clientName,selected_families:families}]);return error}
export async function getOilConfig(){const{data}=await supabase.from('oil_config').select('*').eq('active',true);return data||[]}
export async function upsertOilOverride(oilId,maxDrops){
  await supabase.from('oil_config').delete().eq('type','override').eq('oil_id',oilId)
  if(maxDrops!==null){const{error}=await supabase.from('oil_config').insert([{type:'override',oil_id:oilId,tier:'',name:'',max_drops:maxDrops,active:true}]);return error}
  return null
}
export async function addCustomOil(tier,name,maxDrops){const id='c_'+Date.now();const{error}=await supabase.from('oil_config').insert([{type:'custom',oil_id:id,tier,name,max_drops:maxDrops||null,active:true}]);return error}
export async function deleteCustomOil(id){const{error}=await supabase.from('oil_config').delete().eq('id',id);return error}

export async function set50mlAvailability(available){
  const{error}=await supabase.from('session_config').upsert([{id:1,available_50ml:available,updated_at:new Date().toISOString()}])
  return error
}
