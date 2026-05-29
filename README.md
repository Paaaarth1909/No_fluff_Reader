## No Fluff Reader

A minimal, privacy-minded Chrome extension + landing site and small API to read articles without paywalls or clutter. This repository contains three main packages: the browser extension (`extension/`), a marketing `landing/` site, and a small `api-server/` used for optional backend features.

## Project Structure

- `extension/` — Chrome Extension (Manifest V3) source, built with Vite and packaged into `no-fluff-reader.zip`.
- `landing/` — React + Vite landing site that hosts marketing pages and the extension download link.
- `api-server/` — Express + TypeScript API server (optional) for any server-side features.
- `lib/` — shared libraries and generated API client code used by other packages.

## Features

- Chrome extension (MV3): popup, background service worker, and content script.
- Packaged `.zip` for Web Store submission (built from `extension/dist`).
- Landing site with install CTA, theme toggle (light/dark), and extension download fallback.
- Local dev scripts and a `vercel-build` script to support CI builds.

## Prerequisites

- Node >= 18
- pnpm (recommended) — install via `npm i -g pnpm`

## Quick start (local)

1. Install dependencies at repository root:

```bash
pnpm install
```

2. Run the landing app locally (dev):

```bash
PORT=5173 BASE_PATH=/ pnpm --dir landing dev
```

3. Run the API server locally (dev):

```bash
PORT=3000 pnpm --dir api-server dev
```

4. Build and load the extension for development:

```bash
pnpm --dir extension build
pnpm --dir extension zip
# Load the unpacked extension from extension/dist in chrome://extensions
```

## Build (production)

Build all packages:

```bash
pnpm run build
```

There is also a robust script for CI (used for Vercel):

```bash
pnpm run vercel-build
```

This runs the extension `build` + `zip` and copies the generated ZIP into `landing/public` (the copy step is guarded to avoid CI failures if the destination doesn't exist).

## Environment variables

- `PORT` — port for the API server or landing (when running locally)
- `DATABASE_URL` — (optional) database connection for the API server
- `VITE_CHROME_WEB_STORE_URL` — optional Web Store URL used by the landing CTA
- `VITE_EXTENSION_DOWNLOAD_URL` — fallback download URL for the extension ZIP

## Packaging & Publishing the Extension

1. Build the extension:

```bash
pnpm --dir extension build
pnpm --dir extension zip
```

2. The created file is `extension/no-fluff-reader.zip`. For convenience the repo's `zip` script copies this ZIP into `landing/public` when that folder exists.

3. Submit the ZIP to the Chrome Web Store via the Developer Dashboard.

## Deployment recommendations

- Landing (static): Vercel or Netlify — set the build command to `pnpm run vercel-build` and publish `landing/dist/public`.
- API server: Render or Fly or Heroku — a simple Node service running the Express app on `PORT`.

## Contributing

Please open issues or PRs against `main`. Keep changes small and focused. If you modify build scripts, ensure CI-friendly behavior (avoid `cp` failures; create directories before copying).

## Troubleshooting

- If Vercel or other CI fails during the extension copy step, ensure the build command creates the `landing/public` directory before copying. The repository includes `vercel-build` which does this safely.

## License

MIT
