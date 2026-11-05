# InterimPop

Data-backed Singapore temporary land discovery and event-planning demo, deployed publicly through Sites. Next.js static export, React, TypeScript, Leaflet and OneMap Night basemap. No credentials are required for the current demo. No live LLM or authenticated OneMap APIs are used.

## Run

Node 22+; `npm ci`, `npm run dev`. Validate with `npm run typecheck`, `npm test`, `npm run build`.

## What works

- 2,706 records from the user-supplied SLA Vacant State Land and Properties GeoJSON, searchable by location, asset reference, lot or area.
- Structured request parser for planning area names and numeric ranges; explicit filters remain visible and editable.
- Canvas map with source boundaries, topology-preserving display simplification, and full-boundary selection.
- Full-resolution spatial joins against cadastral lots (147,484), URA MP2025 polygons (113,394), and the downloaded State Reserve snapshot (5 features).
- Browser-local shortlist and comparison.
- Event-space TOL estimate from SLA's 1 October 2026 schedule: items 3/4, tiered areas, 100 m² minimum, sector selection, 30% ancillary-sales threshold and GST from unrounded pre-GST rates.
- Markdown proposal brief export with evidence, assumptions, source URLs and outstanding checks.
- Existing project preview image remains in Open Graph metadata.

## Rebuild source assets

Create a Python environment with `shapely`, `pyproj` and `requests`. Run:

```
python scripts/prepare-data.py /absolute/path/vacant.geojson /absolute/path/supporting-directory
```

The supporting directory must contain `cadastre.geojson`, `zoning.geojson` and `reserve.geojson`. Download from the exact dataset URLs in `public/data/metadata.json`, using data.gov.sg's poll-download API. The output records SHA-256 hashes and feature counts. Review and update snapshot/retrieval dates when refreshing sources.

Original polygons are repaired when necessary and projected to SVY21 (EPSG:3414) for intersections. Overlaps below max(1 m², 0.01% of candidate geometry area) are omitted to reduce slivers. Display geometry is simplified to 1m and rounded to 7 decimal places. Full source geometries remain the calculation inputs. OBJECTID is unique within this snapshot; ASSETID is non-unique and may be missing. Source category casing is normalized; meanings are not invented.

## Limits

Dataset inclusion is not an offer to rent or confirmation of availability. Zoning intersections and reserve checks are evidence, not planning or legal approval. The reserve snapshot has five features; zero overlap must not be interpreted as clearance. Dataset and source timestamps differ and are shown explicitly. Demographics, measured footfall, live routing and SPIO availability reconciliation are not included.

Pricing supports single-storey event-space scenarios only. Suggested sectors require user confirmation and island exceptions need review. Dates include both event endpoints plus explicit setup/teardown days. Additional floor area, deposits, processing fees, and other charges are excluded. Offshore event-space rates are unsupported. SLA confirms prevailing rates when the licence commences. A Markdown brief is not an official form or submitted application.

For future live OpenAI or authenticated OneMap capabilities, add a server-side component and store credentials as Sites runtime secrets. Never embed keys in the static frontend.
