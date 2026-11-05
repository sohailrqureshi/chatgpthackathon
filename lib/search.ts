import type {Site} from './sites';
export type Filters={query:string;district:string;category:string;min:string;max:string};
export const EMPTY_FILTERS:Filters={query:'',district:'',category:'',min:'',max:''};
export function filterSites(sites:Site[], filters:Filters) {
 const words=filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 return sites.filter(s=>(!filters.district||s.district===filters.district)&&(!filters.category||s.category===filters.category)&&(!filters.min||s.area>=Number(filters.min))&&(!filters.max||s.area<=Number(filters.max))&&words.every(w=>[s.name,s.assetId,s.id,s.district,s.street,s.postal,...s.lots].filter(Boolean).join(' ').toLowerCase().includes(w)));
}
export function parseRequest(text:string,sites:Site[]):{filters:Filters;message:string;recognized:boolean} {
 const t=text.toLowerCase();const filters={...EMPTY_FILTERS};const pieces:string[]=[];
 const districts=Array.from(new Set(sites.map(s=>s.district))).filter(s=>s!=='UNSPECIFIED').sort((a,b)=>b.length-a.length);
 const district=districts.find(d=>t.includes(d.toLowerCase()));if(district){filters.district=district;pieces.push(district);}
 const range=t.replace(/,/g,'').match(/(?:between|from)\s*(\d+(?:\.\d+)?)\s*(?:and|to|[-–])\s*(\d+(?:\.\d+)?)/);
 if(range){filters.min=range[1];filters.max=range[2];pieces.push(`${range[1]}–${range[2]} m²`);}
 else {
  const min=t.replace(/,/g,'').match(/(?:at least|over|above|minimum|min|>=)\s*(\d+(?:\.\d+)?)/);const max=t.replace(/,/g,'').match(/(?:under|below|up to|maximum|max|<=)\s*(\d+(?:\.\d+)?)/);
  if(min){filters.min=min[1];pieces.push(`at least ${min[1]} m²`);}if(max){filters.max=max[1];pieces.push(`up to ${max[1]} m²`);}
 }
 const id=sites.find(s=>t.includes(s.id)||Boolean(s.assetId&&t.includes(s.assetId.toLowerCase())));if(id){filters.query=id.id;pieces.push(id.assetId||id.id);}
 if(!pieces.length){return {filters:{...filters,query:text.trim()},recognized:false,message:'Searching record text. For structured matching, try “Bedok between 500 and 2000 sqm”. Event suitability and permissions need separate review.'};}
 return {filters,recognized:true,message:`Applied: ${pieces.join(' · ')}. Results are records from the SLA snapshot, not confirmed offers to rent. Select a candidate to inspect evidence and calculate an event-space estimate.`};
}
