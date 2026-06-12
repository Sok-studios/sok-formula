import { TIERS } from '../data/oils.js'
const WEIGHTS=[5,3,2]
export function buildFormula(selected,heroes,emphasis,empOptions){
  const emp=empOptions.find(e=>e.value===emphasis)
  const tierDrops={...emp.drops}
  const active=TIERS.filter(t=>selected[t].length>0)
  const inactive=TIERS.filter(t=>selected[t].length===0)
  if(inactive.length&&active.length){
    const extra=inactive.reduce((s,t)=>s+tierDrops[t],0)
    inactive.forEach(t=>{tierDrops[t]=0})
    const aSum=active.reduce((s,t)=>s+tierDrops[t],0)
    active.forEach(t=>{tierDrops[t]=Math.round((tierDrops[t]/aSum)*(aSum+extra))})
    const s=active.reduce((sum,t)=>sum+tierDrops[t],0)
    if(s!==100)tierDrops[active[0]]+=100-s
  }
  const allAllocs=[],warnings=[]
  let totalExcess=0
  const DROP=0.02
  for(const tier of TIERS){
    const oils=selected[tier]
    if(!oils.length)continue
    const heroId=heroes[tier]||oils[0].id
    const sorted=[...oils].sort((a,b)=>a.id===heroId?-1:b.id===heroId?1:0)
    const wts=sorted.map((_,i)=>WEIGHTS[i]??1)
    const wSum=wts.reduce((s,w)=>s+w,0)
    const tD=tierDrops[tier]
    let allocs=sorted.map((oil,i)=>({oil,tier,drops:Math.round((wts[i]/wSum)*tD),capped:false,isHero:oil.id===heroId&&sorted.length>1}))
    const rSum=allocs.reduce((s,a)=>s+a.drops,0)
    if(rSum!==tD)allocs[0].drops+=tD-rSum
    allocs=allocs.map(a=>{
      if(a.oil.maxDrops!==undefined&&a.drops>a.oil.maxDrops){
        const ex=a.drops-a.oil.maxDrops
        totalExcess+=ex
        warnings.push(`${a.oil.name} capped at ${(a.oil.maxDrops*DROP).toFixed(3)}g`)
        return{...a,drops:a.oil.maxDrops,capped:true}
      }
      return a
    })
    allAllocs.push(...allocs)
  }
  if(totalExcess>0){
    const uncapped=allAllocs.filter(a=>!a.capped)
    if(uncapped.length){let rem=totalExcess;uncapped.forEach((a,i)=>{const share=i===uncapped.length-1?rem:Math.round(rem/(uncapped.length-i));a.drops+=share;rem-=share})}
  }
  const DROP2=0.02
  return{oils:allAllocs.map(a=>({id:a.oil.id,name:a.oil.name,tier:a.tier.charAt(0).toUpperCase()+a.tier.slice(1),drops:a.drops,g:parseFloat((a.drops*DROP2).toFixed(3)),pct:Math.round((a.drops/100)*100),isHero:a.isHero,isCapped:a.capped})),warnings}
}
