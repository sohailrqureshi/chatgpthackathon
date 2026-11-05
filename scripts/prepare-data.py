"""Build reproducible static assets from official GeoJSONs. Requires shapely and pyproj.
Usage: python scripts/prepare-data.py VACANT_FILE SUPPORTING_DIRECTORY
All overlap calculations use repaired full-resolution polygons projected to SVY21.
"""
import sys,json,hashlib,collections,datetime
from pathlib import Path
from shapely.geometry import shape,mapping
from shapely import make_valid,STRtree,union_all
from shapely.ops import transform
from pyproj import Transformer

vacant=Path(sys.argv[1]);support=Path(sys.argv[2]);output=Path('public/data');output.mkdir(parents=True,exist_ok=True)
project=Transformer.from_crs('EPSG:4326','EPSG:3414',always_xy=True).transform
sources={};layers={}
def load(p,name,url):
 raw=p.read_bytes();d=json.loads(raw);features=d['features']
 sources[name]={'url':url,'count':len(features),'sha256':hashlib.sha256(raw).hexdigest(),'retrieved':'2026-11-05'}
 return features
base=load(vacant,'vacant','https://data.gov.sg/datasets/d_408e0ce796d119ea87b93b2d3402e134/view')
for name,id in [('cadastre','d_e7395d743076a2bcc487b0d12b9bf33b'),('zoning','d_a8c3546b26712e35021f3a681d0353ae'),('reserve','d_0436cc1b096c5da4aa2362f90bcaf935')]:
 features=load(support/(name+'.geojson'),name,'https://data.gov.sg/datasets/'+id+'/view')
 geometries=[transform(project,make_valid(shape(f['geometry']))) for f in features]
 layers[name]=(features,geometries,STRtree(geometries))
 print(name,len(features),flush=True)
def clean(v):
 if v is None or str(v).strip().upper() in ('NA','N/A','NULL','0',''):return None
 return str(v).strip()
def overlaps(g,name):
 features,geos,tree=layers[name];hits=[]
 for j in tree.query(g,predicate='intersects'):
  inter=g.intersection(geos[j]);a=inter.area
  if a>max(1,g.area*.0001):hits.append((features[j]['properties'],a,inter))
 return sorted(hits,key=lambda x:-x[1])
index=[];mapfeatures=[];repairs=0
for n,f in enumerate(base):
 p=f['properties'];raw=shape(f['geometry']);repairs+=not raw.is_valid;g=make_valid(raw);metric=transform(project,g)
 if metric.is_empty or metric.area<=0:raise ValueError('Empty geometry '+str(p['OBJECTID']))
 lot=overlaps(metric,'cadastre');zone=overlaps(metric,'zoning');reserve=overlaps(metric,'reserve');z=collections.defaultdict(float)
 for prop,a,_ in zone:z[prop.get('LU_DESC') or 'Unspecified']+=a
 zlist=[{'name':k,'percent':round(a/metric.area*100,2)} for k,a in sorted(z.items(),key=lambda x:-x[1])]
 point=g.representative_point();bounds=g.bounds
 date=str(p.get('FMEL_UPD_D',''));date=f'{date[:4]}-{date[4:6]}-{date[6:8]}' if len(date)>=8 else None
 r={'id':str(p['OBJECTID']),'assetId':clean(p.get('ASSETID')),'name':clean(p.get('ASSET_DESC')) or clean(p.get('ST_NAME')) or 'Unnamed SLA site '+str(p['OBJECTID']), 'district':clean(p.get('DGP_DESC')) or 'UNSPECIFIED', 'category':(clean(p.get('CATEGORY')) or 'UNSPECIFIED').upper(),'area':round(p['SHAPE.AREA'],2),'calculatedArea':round(metric.area,2),'street':clean(p.get('ST_NAME')),'postal':clean(p.get('POSTALCODE')),'survey':clean(p.get('MK_TS')),'updated':date,'center':[point.y,point.x],'bounds':[[bounds[1],bounds[0]],[bounds[3],bounds[2]]],'lots':list(dict.fromkeys(x[0].get('LOT_KEY') for x in lot if x[0].get('LOT_KEY'))),'zoning':zlist,'reserveArea':round(union_all([x[2] for x in reserve]).area,2) if reserve else 0,'reserveLots':list(dict.fromkeys(x[0].get('LOT_KEY') for x in reserve if x[0].get('LOT_KEY')))}
 index.append(r)
 # Display simplification only: ~1 metre in SVY21, topology preserved; original calculations above.
 simplified=transform(Transformer.from_crs('EPSG:3414','EPSG:4326',always_xy=True).transform,metric.simplify(1,preserve_topology=True))
 def rounding(o):
  if isinstance(o,(list,tuple)):return [rounding(v) for v in o]
  if isinstance(o,float):return round(o,7)
  return o
 geom=dict(mapping(simplified));geom['coordinates']=rounding(geom['coordinates'])
 mapfeatures.append({'type':'Feature','id':r['id'],'properties':{'id':r['id']},'geometry':geom})
 if n%500==0:print('processed',n,flush=True)
featured=[]
for district in ['BEDOK','KALLANG','DOWNTOWN CORE','JURONG EAST','TAMPINES','QUEENSTOWN','GEYLANG','BISHAN']:
 candidates=[s for s in index if s['district']==district and 300<=s['area']<=5000 and not s['name'].startswith('Unnamed')]
 candidates.sort(key=lambda s:(abs(s['area']-1000),s['id']))
 if candidates:featured.append(candidates[0]['id'])
metadata={'count':len(index),'featured':featured,'sources':sources,'geometryRepairs':repairs,'method':'Full geometry intersections in EPSG:3414; display simplified to 1m. Overlaps smaller than max(1 m², 0.01% of candidate geometry) omitted. Record IDs are unique only within this snapshot. No overlap is not regulatory clearance.','snapshot':'2026-11-05'}
for name,data in [('sites.json',index),('boundaries.geojson',{'type':'FeatureCollection','features':mapfeatures}),('metadata.json',metadata)]:
 (output/name).write_text(json.dumps(data,separators=(',',':'),ensure_ascii=False));print(name,(output/name).stat().st_size,flush=True)
print('Done',len(index),'records,',len(featured),'featured')
