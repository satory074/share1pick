# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev              # Dev server (Turbopack — dev only)
npm run build            # Production build (runs validate:images --warn first)
npm run lint             # ESLint only
npm test                 # Vitest unit tests (run once)
npm run test:watch       # Vitest in watch mode
npm run validate:images  # Check for contestants with empty image strings
vercel --prod            # Deploy to production
```

- Dev server uses the next available port if 3000 is occupied (may be 3001, 3002, etc.)
- Production builds do NOT use Turbopack

## Architecture Overview

Next.js 15 App Router app. Users pick one favorite contestant per K-pop survival show and share the collection as an image or tweet. All data is static — no database or external API.

### Directory Structure

```
src/
├── app/                          # Routes only (pages, layouts, error boundaries)
│   ├── page.tsx                  # Homepage
│   ├── show/[id]/page.tsx        # Contestant selection
│   ├── my-picks/page.tsx         # Share collection
│   └── share/[shareId]/          # Share view + OGP image
├── features/
│   ├── shows/                    # ShowCard, StickyShareBar
│   ├── contestants/              # ContestantCard, ContestantGrid, StickySelectionBar
│   └── sharing/                  # ShareImage, TweetModal, useShareImage, constants
├── shared/
│   ├── components/               # AvatarFallback, Modal
│   ├── hooks/useSelections.ts    # Zustand adapter (thin wrapper)
│   └── utils/                    # contestant.ts, imageProxy.ts, share.ts
├── store/selectionsStore.ts      # Zustand 5 + persist middleware
├── data/shows.ts                 # All show + contestant data (static)
└── types/index.ts
scripts/
├── collect-youtube-ids.py        # Collect YouTube video IDs per show (uv + yt-dlp)
├── update-shows-from-youtube.py  # Apply collected IDs to shows.ts
└── youtube-ids-{show-id}.json   # Collected results per show
```

### State Management (Zustand)

`src/store/selectionsStore.ts` persists to `localStorage` key `allSelections` (backward-compatible with old format). The `_hasHydrated` flag prevents SSR mismatches — components read 0/empty until hydration completes.

`src/shared/hooks/useSelections.ts` is the public adapter. **Critical**: `getAllMultiPickData` is a `useMemo`-memoized **value** (array), not a function — use `const picks = getAllMultiPickData`, not `getAllMultiPickData()`.

### Shared Utilities (Single Source of Truth)

| Utility | Location | Purpose |
|---|---|---|
| `getNameInitials`, `getNameGradientClass` | `shared/utils/contestant.ts` | Avatar fallback — do NOT duplicate in components |
| `getProxiedImageUrl` | `shared/utils/imageProxy.ts` | CORS proxy for html2canvas |
| `encodeShareData`, `decodeShareData`, `generateTwitterShareText`, `generateMultiPickShareText`, `copyToClipboard` | `shared/utils/share.ts` | Share URL + Twitter/copy text |

`AvatarFallback` (`shared/components/AvatarFallback.tsx`) handles image error with initials fallback declaratively. Never manipulate `e.target.style.display` — use this component everywhere.

### Data Flow

1. All show/contestant data lives in `src/data/shows.ts` (array order = homepage display order)
2. User selects → `addSelection(showId, contestantId)` → Zustand persists to localStorage
3. Share URL encodes only `showId+contestantId` as URL-safe Base64; `decodeShareData` looks up full data from `shows.ts` (Zod-validated)
4. Share page (`/share/[shareId]`) decodes **server-side** in `page.tsx` and passes as props to `SharePageClient.tsx`

## Data Schema

```typescript
interface Show {
  id: string;
  title: string;
  year: number;        // metadata only; display order = array position in shows.ts
  debutGroup?: string;
  officialWebsite?: string;
  logo?: string;       // public/images/logos/ — SVG recommended, 48px height
  contestants: Contestant[];
}

interface Contestant {
  id: string;
  displayName: string; // e.g. "김채원", "宮脇咲良"
  furigana?: string;   // Katakana with middle dot: "キム・チェウォン"
  image: string;       // local path or external URL
}
```

**Furigana format**: Korean names → Korean pronunciation in Katakana (`강다니엘 → "カン・ダニエル"`). Japanese names → standard reading. Chinese names → Chinese pronunciation.

**Adding a new show**: Insert into `shows` array in `src/data/shows.ts` (position = homepage display order). No other files need updating — Twitter sharing uses only contestant `displayName`, not show-specific hashtags. New hosts for `<Image>` require an entry in `next.config.ts` → `images.remotePatterns`.

**Display order**: Rearrange objects in the `shows` array. The `year` field does not affect ordering.

### Contestant Image Policy

**Priority order for `image` field (空文字禁止):**

| Priority | Format | Example |
|---|---|---|
| ① Best | Self-hosted WebP | `/images/contestants/{show-id}/{id}.webp` |
| ② OK | YouTube thumbnail | `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg` |
| ③ Allowed | External profile | `https://kprofiles.com/...` |
| ④ **Forbidden** | Empty string | `""` ← **never use for new data** |

**Self-hosted spec**: `public/images/contestants/{show-id}/{contestant-id}.webp`, 300×400px, ≤100KB.
- Self-hosted images: no CORS proxy needed (html2canvas works directly)
- YouTube thumbnails: `AvatarFallback` handles 404s gracefully
- External URLs: fragile — migrate to YouTube thumbnails or self-hosted when possible

**Current image state** (517/522 contestants use YouTube thumbnails): 5 contestants have no official solo video and retain non-YouTube images: `jo-eun-woo`, `yeom-tae-gyun`, `tao-yuan` (Boys Planet early eliminations), `sutani-ririka` (P101 Japan The Girls), `seo-sanghyuk` (P101 S2).

**Validation:**
```bash
npm run validate:images   # lists all empty-image contestants (exit 1 on any)
npm run build             # runs validate:images --warn before building
```

New show checklist:
- [ ] All contestants have non-empty `image` values
- [ ] New image hosts added to `next.config.ts` → `images.remotePatterns`
- [ ] Run `npm run validate:images` before committing

### Contestant Image Collection Scripts

When adding a new show or updating images, use the `scripts/` workflow:

```bash
# 1. Add the show config to SHOW_CONFIGS in collect-youtube-ids.py
# 2. Collect YouTube video IDs (requires uv + yt-dlp):
uv run --with yt-dlp scripts/collect-youtube-ids.py <show-id>
# → writes scripts/youtube-ids-{show-id}.json

# 3. Review the JSON for incorrect matches, fix manually if needed

# 4. Apply to shows.ts:
uv run scripts/update-shows-from-youtube.py <show-id>
uv run scripts/update-shows-from-youtube.py <show-id> --dry-run  # preview only
```

**Show-specific series used per show** (for search queries):
| Show | YouTube Series | Channel |
|---|---|---|
| PRODUCE 48 | `[48스페셜] 도전! 아.이.컨.택` | Mnet TV |
| PRODUCE 101 S1 | `1:1 Eyecontact` | Mnet TV |
| PRODUCE 101 S2 | `자기소개_1분 PR` | Mnet TV |
| Boys Planet | `타임어택 1분 자기소개` | Mnet K-POP |
| Girls Planet 999 | `99 PR_자기소개` | Mnet K-POP |
| PRODUCE X 101 | `일대일아이컨택` | Mnet K-POP |
| I-LAND | `글로벌 투표 PR 영상` | Mnet K-POP |
| P101 JAPAN / THE GIRLS | `自己紹介_1分PR` / `1分PR` | PRODUCE 101 JAPAN 新世界 |
| R U Next? | `Recipe of Me!` | HYBE LABELS + |

## Critical Technical Constraints

### html2canvas (ShareImage component)

`src/features/sharing/ShareImage.tsx` is captured by html2canvas. Tailwind CSS 4 generates OKLCH colors that html2canvas cannot parse.

**Never use inside this component:**
- Tailwind opacity modifiers: `bg-white/10`, `text-black/50`
- Tailwind gradients: `bg-gradient-to-br from-purple-500`

**Always use inline RGBA:**
```tsx
style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
style={{ background: 'linear-gradient(to bottom right, rgb(168, 85, 247), ...)' }}
```

The 12 background presets and grid config live in `src/features/sharing/constants.ts`. `useShareImage.ts` dynamic-imports html2canvas to keep it out of the initial bundle.

### Satori (OGP Image Generation)

`src/app/share/[shareId]/opengraph-image.tsx` uses `runtime = 'edge'` and Satori.

- All `<div>` with multiple children **must** have `display: 'flex'`
- Text **must** be in `<span>` — not direct children of divs
- No CSS grid, no absolute positioning, inline styles only
- `metadataBase: new URL('https://share1pick.vercel.app')` is required in `layout.tsx`
- `generateMetadata` must be in a Server Component (not `'use client'`)

### External Images (CORS + Next.js config)

External images used with Next.js `<Image>` require entries in `next.config.ts` → `images.remotePatterns`. Current allowed hosts: `img.youtube.com`, `kprofiles.com`, `kpopping.com`, `3rd.produce101.jp`.

For html2canvas, all external URLs must go through `/api/image-proxy` (adds `Access-Control-Allow-Origin: *`). Use `getProxiedImageUrl()` from `shared/utils/imageProxy.ts`.

**YouTube thumbnail hotlinking**: `img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg` works for most videos but YouTube may block hotlinks for some, causing `AvatarFallback` (gradient color block) to appear. This is a YouTube-side restriction — gradient fallback is acceptable UX.

## Implementation Patterns

### Avoiding Hydration Errors
- Never nest `<a>` / `<Link>` tags. Use `<span onClick={() => window.open(...)}>`  for external links inside `<Link>` cards.
- Dynamic content that differs between server and client (e.g., selection count) is guarded by `_hasHydrated` in the Zustand store.

### Accessibility
- `ContestantCard` uses `role="radio"`, `aria-checked`, `tabIndex`, and `onKeyDown` for Enter/Space. Its callback prop is **`onSelect: (contestant: Contestant) => void`** (not `onClick`) — the card calls `onSelect(contestant)` internally, so `ContestantGrid` passes `onSelect={onSelect}` directly without a lambda wrapper.
- `ContestantGrid` uses `role="radiogroup"`.
- `Modal` (`shared/components/Modal.tsx`) uses `focus-trap-react` for keyboard trap, ESC handler, and backdrop click.
- Sticky bars use `role="status"` + `aria-live="polite"`.

### Twitter/X Sharing Flow
1. `generateTwitterShareText(multiPicks)` → contestant `#displayName` hashtags + `#1pick #Share1Pick` (no show hashtags)
2. `encodeShareData(multiPicks)` → URL-safe Base64 share ID
3. Tries Web Share API (mobile); falls back to `twitter.com/intent/tweet`
4. Tweet text + URL must fit 140 chars (Twitter counts all URLs as 23 chars)

### Animation
- Framer Motion entry animations use `delay: Math.min(index * 0.05, 0.3)` to cap stagger at 0.3s regardless of list size.

## Design System

**Colors** (defined as CSS variables in `globals.css`, available as Tailwind utilities):
- Primary: `bg-mint-600` (#5DD9B9) — buttons, links
- Secondary: `bg-coral-600` (#FF8A80) — secondary actions
- Pink: `bg-pink-500` (#EC4899), `bg-pink-400` (#F472B6), `bg-pink-200` (#FBCFE8) — selection state, hearts
- Backgrounds: `from-mint-50 to-bg-warm` (light) / `from-dark-bg to-dark-surface` (dark)

**Buttons**: `bg-mint-600 hover:bg-mint-500` for primary, `bg-coral-600 hover:bg-coral-500` for secondary. CTA buttons (e.g. StickyShareBar) use `linear-gradient(to right, #5DD9B9, #EC4899)` inline style — **not** Tailwind gradient classes (OKLCH constraint).

**Selection state**: Pink (`border-pink-500 ring-pink-200 shadow-pink-200`), heart icon ♥ — not purple. Hover state: `hover:border-pink-300 group-hover:text-pink-500`.

## Testing

```bash
npm test                    # Run all tests once
npm run test:watch          # Watch mode
npx vitest run src/shared/utils/__tests__/share.test.ts  # Single file
```

Tests live in `__tests__/` alongside source files. Config: `vitest.config.mts`. Current coverage: `shared/utils/contestant.ts` and `shared/utils/share.ts` (encode/decode round-trip, Zod validation, Twitter text generation).

## Deployment

Vercel (Tokyo region `hnd1`). Production URL: `https://share1pick.vercel.app`

**Deploy requirement**: `git config user.email` must match the Vercel account email (`satory074@gmail.com`). A mismatch causes `Error: Git author ... must have access to the team` and the deploy fails.

**Stack**: Next.js 15.5.9 · React 19.1.0 · TypeScript 5 (strict) · Tailwind CSS 4 · Zustand 5 · Zod · Framer Motion · html2canvas · focus-trap-react

**React version note**: `react` and `react-dom` must stay at the same version. If Turbopack dev server crashes with "Incompatible React versions", run `npm install` to resync `node_modules`.
