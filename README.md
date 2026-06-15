# Cosmic Neighborhood Explorer

If Earth were placed inside a 3D map of our stellar neighborhood, what would our surroundings actually look like?

This repository is a Cloudflare-free-tier TypeScript monorepo:

- `apps/web`: Vite, React, React Three Fiber frontend for Cloudflare Pages.
- `apps/api`: Hono Cloudflare Worker API with KV-backed catalog, fact, and insight caching.
- `packages/shared`: shared schemas, types, constants, and travel-time math.
- `packages/data`: source-backed data pipeline that emits compact JSON snapshots, plus live public-source fetchers.

## Features

- Interactive 3D stellar map with temperature colors, luminosity sizing, proper-motion animation, and deep sky overlays.
- Cosmic facts engine with star, planet, travel, density, motion, asteroid, and deep sky insights.
- Habitability bubble chart for nearby exoplanets.
- "What If We Left Today?" travel-time explorer with real speed presets.
- Nearby Worlds Race comparing Earth, Mars, Europa, Titan, and exoplanets.
- Near-Earth Object watch list, planet discovery timeline, and local density heatmap.
- Worker endpoints for catalog slices, insights, worlds, deep sky objects, NEOs, travel targets, and admin refresh.
- Source-backed generation from ESA Gaia TAP, NASA Exoplanet Archive TAP, NASA/JPL CNEOS, and SIMBAD TAP with curated seed fallbacks.

## Local development

```bash
npm install
npm run data:generate
npm run dev
```

The frontend runs at `http://localhost:5173`. Set `VITE_API_BASE_URL=http://127.0.0.1:8787` to use the local Worker instead of bundled seed data.

## Verification

```bash
npm --workspace packages/data run fetch:sources
npm run data:generate
npm run typecheck
npm run test
npm run build
npm run audit:cloudflare
npm --workspace apps/api run deploy:dry-run
```

Raw source API responses are written to `packages/data/source-cache/`, which is ignored so large public-data snapshots do not get committed accidentally.
If the cache exists, `npm run data:generate` merges it into the committed compact artifacts; if it does not, generation falls back to curated seed data.
`npm run audit:cloudflare` checks generated JSON values, Pages assets, and the Worker dry-run bundle against the Cloudflare free-tier size limits targeted by this app.

## Cloudflare first deploy

This project deploys as two Cloudflare resources:

- Worker API: `cosmic-neighborhood-api`, configured by `apps/api/wrangler.toml`.
- Pages frontend: `cosmic-neighborhood-explorer`, deployed from `apps/web/dist`.

`ADMIN_REFRESH_TOKEN` is not a Cloudflare token. It is an app-specific shared secret used by `POST /api/admin/refresh`.
The same value must be stored in the Worker as a secret and supplied locally or in CI when running `npm run data:publish`.

### 1. Install and verify locally

```bash
npm install
npm --workspace packages/data run fetch:sources
npm run data:generate
npm run typecheck
npm run test
npm run build
npm run audit:cloudflare
```

### 2. Log in to Cloudflare

```bash
npx wrangler login
npx wrangler whoami
```

Save your account ID from `wrangler whoami` or from the Cloudflare dashboard. If Wrangler cannot infer the account later, set it as `CLOUDFLARE_ACCOUNT_ID`.

### 3. Create the KV namespaces

From the repo root:

```bash
npx wrangler kv namespace create COSMIC_CACHE --config apps/api/wrangler.toml
npx wrangler kv namespace create COSMIC_CACHE --preview --config apps/api/wrangler.toml
```

Each command prints an ID. Export those IDs, then let the repo script update `apps/api/wrangler.toml`:

```bash
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
export COSMIC_CACHE_KV_ID=<production-kv-id>
export COSMIC_CACHE_PREVIEW_KV_ID=<preview-kv-id>
npm run cloudflare:configure
```

If you do not use a separate preview namespace, set `COSMIC_CACHE_PREVIEW_KV_ID` to the same value as `COSMIC_CACHE_KV_ID`.

### 4. Generate `ADMIN_REFRESH_TOKEN`

Generate a random value and keep it somewhere safe:

```bash
export ADMIN_REFRESH_TOKEN="$(node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64url"))')"
echo "$ADMIN_REFRESH_TOKEN"
```

Use this exact value in two places:

- Worker secret: authorizes `/api/admin/refresh`.
- Local shell or GitHub Actions secret: lets `npm run data:publish` call that endpoint.

Do not commit this value to git. For local Worker development, copy `apps/api/.dev.vars.example` to `apps/api/.dev.vars` and replace the example value.

### 5. Deploy the Worker API

Deploy once so the Worker exists and has the KV binding:

```bash
npm run deploy:api
```

Store the refresh token as a Worker secret:

```bash
cd apps/api
printf "%s" "$ADMIN_REFRESH_TOKEN" | npx wrangler secret put ADMIN_REFRESH_TOKEN
cd ../..
```

If your shell or Wrangler version does not accept the piped value, run `npx wrangler secret put ADMIN_REFRESH_TOKEN` interactively and paste the token when prompted.
If `wrangler secret put` says the Worker does not exist, rerun `npm run deploy:api` from the repo root and then repeat the secret command.

Your Worker URL will usually be:

```text
https://cosmic-neighborhood-api.<your-workers-subdomain>.workers.dev
```

Confirm it:

```bash
export COSMIC_API_BASE_URL=https://cosmic-neighborhood-api.<your-workers-subdomain>.workers.dev
curl "$COSMIC_API_BASE_URL/api/health"
```

### 6. Publish generated astronomy snapshots to KV

The Worker has bundled seed data, but publishing writes the freshly generated catalog, facts, and insights into KV:

```bash
COSMIC_API_BASE_URL="$COSMIC_API_BASE_URL" \
ADMIN_REFRESH_TOKEN="$ADMIN_REFRESH_TOKEN" \
npm run data:publish
```

Check that the Worker is serving the refreshed snapshot:

```bash
curl "$COSMIC_API_BASE_URL/api/catalog"
curl "$COSMIC_API_BASE_URL/api/facts"
curl "$COSMIC_API_BASE_URL/api/insights"
```

### 7. Create and deploy the Pages frontend

Create the Pages project once:

```bash
npx wrangler pages project create cosmic-neighborhood-explorer --production-branch main
```

Build the frontend with the Worker URL baked in, then deploy the `dist` directory:

```bash
VITE_API_BASE_URL="$COSMIC_API_BASE_URL" npm --workspace apps/web run build
npm run deploy:web
```

The Pages URL will usually be:

```text
https://cosmic-neighborhood-explorer.pages.dev
```

### 8. Smoke test the live deployment

```bash
COSMIC_API_BASE_URL="$COSMIC_API_BASE_URL" \
COSMIC_PAGES_URL=https://cosmic-neighborhood-explorer.pages.dev \
npm run smoke:live
```

## Cloudflare refresh after first deploy

For later data refreshes, run:

```bash
npm --workspace packages/data run fetch:sources
npm run data:generate
COSMIC_API_BASE_URL=https://cosmic-neighborhood-api.<your-workers-subdomain>.workers.dev \
ADMIN_REFRESH_TOKEN=<same-admin-refresh-token> \
npm run data:publish
```

## GitHub Actions deployment

The manual/scheduled deployment in `.github/workflows/deploy.yml` expects these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `COSMIC_CACHE_KV_ID`
- `COSMIC_CACHE_PREVIEW_KV_ID` (optional; falls back to `COSMIC_CACHE_KV_ID`)
- `COSMIC_API_BASE_URL`
- `COSMIC_PAGES_URL`
- `ADMIN_REFRESH_TOKEN`

`CLOUDFLARE_API_TOKEN` is a Cloudflare API token for Wrangler/GitHub Actions. `ADMIN_REFRESH_TOKEN` is the app refresh secret generated in step 4 above.
