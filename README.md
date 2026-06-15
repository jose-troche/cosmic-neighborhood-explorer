# Cosmic Neighborhood Explorer

If Earth were placed inside a 3D map of our stellar neighborhood, what would our surroundings actually look like?

This repository is a Cloudflare-free-tier TypeScript monorepo:

- `apps/web`: Vite, React, React Three Fiber frontend for Cloudflare Pages.
- `apps/api`: Hono Cloudflare Worker API with KV-backed catalog/fact caching.
- `packages/shared`: shared schemas, types, constants, and travel-time math.
- `packages/data`: deterministic MVP data pipeline that emits compact JSON snapshots.

## Local development

```bash
npm install
npm run data:generate
npm run dev
```

The frontend runs at `http://localhost:5173`. Set `VITE_API_BASE_URL=http://127.0.0.1:8787` to use the local Worker instead of bundled seed data.

## Verification

```bash
npm run typecheck
npm run test
npm run build
npm --workspace apps/api run deploy:dry-run
```
