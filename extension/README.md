# No-Fluff Reader — Chrome Extension

A Manifest V3 Chrome extension that filters low-quality content and highlights valuable content across websites.

## Development

### Install dependencies
```bash
pnpm install
```

### Build (watch mode)
```bash
pnpm dev
```

### Production build
```bash
pnpm build
```

### Package as ZIP
```bash
pnpm zip
```

## Loading in Chrome

1. Run `pnpm build` to generate the `dist/` folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `dist/` folder from this directory

## Architecture

```
src/
├── manifest.json          # MV3 manifest
├── background/
│   └── service-worker.ts  # Background service worker — handles storage, message routing
├── content/
│   └── index.ts           # Content script — DOM scanning, rule application, MutationObserver
├── popup/
│   ├── index.html         # Popup entry point
│   ├── main.tsx           # React entry
│   ├── App.tsx            # Root component with tab navigation
│   ├── index.css          # Design system CSS
│   └── components/
│       ├── Header.tsx     # Logo, page-save button, enable toggle
│       ├── RulesTab.tsx   # Hide/highlight keyword rule manager
│       ├── QueueTab.tsx   # Reading queue (IndexedDB-backed)
│       └── SettingsTab.tsx # Daily limit settings
└── lib/
    ├── types.ts           # Shared TypeScript types
    ├── storage.ts         # chrome.storage.sync wrappers (rules, settings)
    ├── indexeddb.ts       # IndexedDB reading queue operations
    └── messaging.ts       # Message-passing abstractions
```

## Key Engineering Decisions

- **Message passing**: Content scripts can't access `chrome.storage` directly in MV3. All storage access goes through the background service worker via `chrome.runtime.sendMessage`.
- **MutationObserver**: Watches for DOM changes with debouncing (150ms) to handle infinite scroll and dynamic feeds efficiently.
- **Weak references**: Processed DOM nodes are tracked with a `WeakSet` to avoid memory leaks when nodes are removed.
- **IndexedDB**: Used for the reading queue because it persists across extension reinstalls, unlike `chrome.storage`.
- **Framer Motion popup**: The popup uses React + Framer Motion for smooth tab transitions and spring-based chip animations.

## Supported Sites (tested)
- Twitter / X
- LinkedIn
- Reddit
- Hacker News
- Any site with `<article>`, `[role="article"]`, or similar semantic post elements

## Publishing to Chrome Web Store
1. Run `pnpm build && pnpm zip`
2. Upload `no-fluff-reader.zip` to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Fill in store listing details and submit for review
