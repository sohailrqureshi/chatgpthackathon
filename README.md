# InterimPop

Data-backed Singapore temporary land discovery and event-planning demo, deployed publicly through Sites. Next.js frontend with a Cloudflare Worker API and embedded static export, React, TypeScript, Leaflet and OneMap Night basemap. The public demo includes an OpenAI conversational co-pilot with server-side tools and authenticated OneMap/data.gov.sg lookups. Manual map search, evidence, pricing and proposal export continue to work independently of AI availability.

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

Dataset inclusion is not an offer to rent or confirmation of availability. Zoning intersections and reserve checks are evidence, not planning or legal approval. The reserve snapshot has five features; zero overlap must not be interpreted as clearance. Dataset and source timestamps differ and are shown explicitly. Measured footfall and SPIO availability reconciliation are not included. Demographics and walking routes are available through live OneMap tools.

Pricing supports single-storey event-space scenarios only. Suggested sectors require user confirmation and island exceptions need review. Dates include both event endpoints plus explicit setup/teardown days. Additional floor area, deposits, processing fees, and other charges are excluded. Offshore event-space rates are unsupported. SLA confirms prevailing rates when the licence commences. A Markdown brief is not an official form or submitted application.

The conversational runtime below provides live OpenAI and authenticated OneMap calls. Never embed credentials in the static frontend.

## Conversational runtime

`npm run build` exports the frontend and builds `dist/server/index.js`, an ESM Worker containing the backend and embedded public assets. The hosting manifest intentionally has no static field. `npm run preview` runs the Worker locally on port 4173 and loads ignored `.env.local` credentials in server memory.

Runtime secrets: `OPENAI_API_KEY`, `ONEMAP_ACCESS_TOKEN`, `DATA_GOV_SG_API_KEY`. Optional `OPENAI_MODEL` defaults to `gpt-4.1-mini`. Configure production values through Sites runtime secrets, not the Git repository. The existing preview image is retained. OneMap access tokens expire; without renewal credentials, the owner must replace an expired token in Sites and redeploy.

Chat streams Responses API text and calls bounded tools for snapshot search, site evidence/selection, geocoding, walking routes, census context, deterministic estimates, proposal-editor population, curated policy extracts and catalogue metadata. Geography and arithmetic stay in code. Search activity labels are not interpreted as approved uses. Conversation history is kept in browser session storage and sent with each request; Responses requests use `store:false`. The UI includes a new-chat control and stop button.

Requests are same-origin, limited to 32KB and 16 messages, with at most four model rounds and 1,600 output tokens per round. A basic per-isolate IP limit allows 20 requests/hour; this is not a global billing cap. Set and monitor API-project usage limits separately. External services have timeouts and live lookup results are cached for one hour per isolate. API credentials are never sent to the browser.

Policy guidance is a small curated source corpus with page references, not comprehensive legal RAG. Dataset metadata lookups do not rebuild geometry or establish live rental availability. Walking routes end at a representative point rather than a verified entrance. Demographics are planning-area census data, not site footfall.
