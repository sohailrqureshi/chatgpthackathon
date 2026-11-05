export type Site = {
  id: string; assetId: string | null; name: string; district: string; category: string;
  area: number; calculatedArea: number; street: string | null; postal: string | null;
  survey: string | null; updated: string; center: [number,number]; bounds: [[number,number],[number,number]];
  lots: string[]; zoning: {name:string;percent:number}[]; reserveArea: number; reserveLots: string[];
};
export type Metadata = {
  count:number;featured:string[];snapshot:string;method:string;geometryRepairs:number;
  sources:Record<string,{url:string;count:number;sha256:string;retrieved:string}>;
};
export const number = (n:number) => n.toLocaleString('en-SG',{maximumFractionDigits:0});
export const money = (n:number) => n.toLocaleString('en-SG',{style:'currency',currency:'SGD'});
