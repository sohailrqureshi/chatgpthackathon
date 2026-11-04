# SLAInterimPop

Singapore temporary-land activation hackathon MVP. Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style Button, Framer Motion and React Leaflet.

## Develop

Requires Node.js 22+ and npm. From this directory:

```sh
npm ci --no-audit --no-fund
npm run dev
```

Visit `/` for the landing page and `/dashboard` for the co-pilot. No API keys or backend services are required. The basemap needs HTTPS access to `*.basemaps.cartocdn.com`.

## Validate

```sh
npm run typecheck
npm run build
npm run start
```

Smoke checks: load both routes; switch personas; send the East farmers-market quick prompt (map focuses Bedok); click a parcel then Select Site (input fills with its ID); send the draft request; try the fee and residential prompts. Check at narrow and desktop viewport sizes.

All parcels, zoning, footfall, otter risk, fees and regulatory responses are illustrative. Nothing is an official SLA quote or land availability claim. Application drafts stay in the browser and are not submitted. Chat is scripted; messages reset on reload.

## Cloud environment notes

The project scripts use Webpack because Turbopack's local CSS-worker port is unavailable in this environment. Keep TLS verification enabled and use the inherited session proxy for package installs. Environment setup and service startup instructions are saved in the configuration draft. Review and save that draft in environment settings, then publish to retain the prepared filesystem. The Carto tile allowlist addition must be applied before tiles can be fetched from this cloud machine; polygon and chat interactions work independently.
