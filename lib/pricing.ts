export const RATE_SOURCE = 'https://www.sla.gov.sg/properties/rent-state-land-and-properties/tol-rate-table/';
export const RATE_PDF = 'https://isomer-user-content.by.gov.sg/73/62ddd653-c26d-4247-974d-d6245e7da1ff/Table%20of%20TOL%20rates%202026%2010%2001.pdf';
export const RATE_DATE = '2026-10-01';
export type Sector = 'Central'|'Suburban'|'Outlying'|'Offshore'|'Unconfirmed';
export const EVENT_RATES = {
  sales: {Central:[2.55,1.25,1],Suburban:[2.4,1.1,.9],Outlying:[2.4,1.1,.9]},
  ancillary: {Central:[1.5,1.1,.8],Suburban:[1.35,1,.75],Outlying:[1.35,1,.75]},
};
export function suggestSector(survey:string|null, name:string):Sector {
  // Sector only suggested from MK/TS. Named island exceptions require review.
  if(/sentosa|brani|seletar/i.test(name)) return 'Unconfirmed';
  const match=survey?.match(/^(MK|TS)\s*(\d+)$/i);if(!match)return 'Unconfirmed';
  const n=Number(match[2]);
  if(match[1].toUpperCase()==='TS') return ([1,2,3,4,5,6,7,8,9,10,11,12,13,19,20,21,22,24,25,26,27,28].includes(n))?'Central':([14,15,16,17,18,23,29,30].includes(n)?'Suburban':'Unconfirmed');
  if([1,2,3,4,5,10,15,16,17,18,22,23,24,25,26,27,28,30].includes(n))return 'Suburban';
  if([6,7,8,9,11,12,13,14,19,20,21,29,31].includes(n))return 'Outlying';
  return n>=32&&n<=34?'Offshore':'Unconfirmed';
}
export function estimate(area:number, days:number, salesPercent:number, sector:Sector) {
  if(!Number.isFinite(area)||area<=0||!Number.isInteger(days)||days<1||!Number.isFinite(salesPercent)||salesPercent<0||salesPercent>100||sector==='Unconfirmed'||sector==='Offshore')return null;
  const classification=salesPercent>30?'sales':'ancillary';
  const billableArea=Math.max(100,area), rates=EVENT_RATES[classification][sector];
  const quantities=[Math.min(500,billableArea),Math.min(1500,Math.max(0,billableArea-500)),Math.max(0,billableArea-2000)];
  const tiers=quantities.map((quantity,i)=>({quantity,rate:rates[i],daily:quantity*rates[i]})).filter(x=>x.quantity>0);
  const daily=tiers.reduce((sum,t)=>sum+t.daily,0);
  const subtotal=Math.round(daily*days*100)/100, gst=Math.round(subtotal*.09*100)/100;
  return {classification,billableArea,tiers,daily,days,subtotal,gst,total:Math.round((subtotal+gst)*100)/100};
}
