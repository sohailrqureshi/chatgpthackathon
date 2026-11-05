'use client';
import {MapContainer,TileLayer,GeoJSON,useMap} from 'react-leaflet';
import {useEffect,useMemo,useState} from 'react';
import type {FeatureCollection} from 'geojson';
import type {Site} from '@/lib/sites';
import 'leaflet/dist/leaflet.css';
function Focus({site,reset}:{site:Site|undefined;reset:number}) {
 const map=useMap();
 useEffect(()=>{if(site)map.fitBounds(site.bounds,{padding:[45,45],maxZoom:17});else map.setView([1.3521,103.8198],11);},[site,map,reset]);
 useEffect(()=>{const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(map.getContainer());return()=>observer.disconnect();},[map]);
 return null;
}
export default function SiteMap({sites,selected,onSelect,reset}:{sites:Site[];selected:Site|undefined;onSelect:(id:string)=>void;reset:number}) {
 const [data,setData]=useState<FeatureCollection|null>(null),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0),[tileError,setTileError]=useState(false);
 useEffect(()=>{const controller=new AbortController();setFailed(false);fetch('/data/boundaries.geojson',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('boundaries');return r.json();}).then(setData).catch(e=>{if(e.name!=='AbortError')setFailed(true);});return()=>controller.abort();},[attempt]);
 const visible=useMemo(()=>{const ids=new Set(sites.map(s=>s.id));if(selected)ids.add(selected.id);return data?{...data,features:data.features.filter(f=>ids.has(String(f.properties?.id)))}:null;},[data,sites,selected]);
 return <div className="atlas-map-frame">
  {!data&&<div className="atlas-map-state">{failed?<><p>Boundaries could not load.</p><button onClick={()=>setAttempt(a=>a+1)}>Retry boundaries</button></>:<p>Loading official SLA boundaries…</p>}</div>}
  <MapContainer center={[1.3521,103.8198]} zoom={11} minZoom={11} maxZoom={19} preferCanvas className="leaflet-map">
   <TileLayer url="https://www.onemap.gov.sg/maps/tiles/Night/{z}/{x}/{y}.png" minZoom={11} maxNativeZoom={19} attribution='<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" alt="OneMap" style="height:18px;width:18px;display:inline;vertical-align:middle" /> <a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a> © contributors | <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>' eventHandlers={{tileerror:()=>setTileError(true),load:()=>setTileError(false)}} />
   <Focus site={selected} reset={reset}/>
   {visible&&<GeoJSON key={sites.map(s=>s.id).join(',')+'-'+selected?.id} data={visible} style={f=>({color:f?.properties?.id===selected?.id?'#edffb0':'#76dcb0',fillColor:f?.properties?.id===selected?.id?'#ddff84':'#49b389',fillOpacity:f?.properties?.id===selected?.id?0.4:0.18,weight:f?.properties?.id===selected?.id?3:1})} onEachFeature={(f,layer)=>{layer.on('click',()=>onSelect(String(f.properties?.id)));}}/>}
  </MapContainer>
  {tileError&&<div className="atlas-tile-error" role="status">Basemap connection interrupted. SLA boundaries remain interactive.</div>}
 </div>;
}
