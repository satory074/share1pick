# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (uses Turbopack in development only)
npm run dev

# Production build (does NOT use Turbopack - uses standard Next.js build)
# Includes linting
npm run build

# Lint code
npm run lint

# Start production server locally
npm start

# Deploy to production
vercel --prod

# Set production alias (after deployment)
vercel alias <deployment-url> share1pick.vercel.app
```

**Important**:
- Turbopack is ONLY used in development mode (`npm run dev`). Production builds use the standard Next.js compiler for stability.
- The development server may use port 3001 if 3000 is already in use.

## Architecture Overview

This is a Next.js 15 application using App Router for a survival audition show 1-pick sharing platform. Users select their favorite contestant from various K-pop survival shows and generate shareable images. Built with TypeScript, Tailwind CSS, and Framer Motion for animations.

### Core Data Flow
1. **Show Selection**: Users browse shows on the homepage (`src/app/page.tsx`) where selected contestants are displayed with images
2. **Contestant Selection**: Users select contestants on show detail pages (`src/app/show/[id]/page.tsx`)
3. **Selection Feedback**: After selection, users stay on the same page to browse other contestants
4. **Multi-Pick Collection**: Users access their collection via the "🎉 シェアする" button on homepage
5. **Bulk Sharing**: Users share all selections at once from the My Picks page (`src/app/my-picks/page.tsx`)
6. **Image Generation**: Creates shareable images using `html2canvas` via `MultiPickShareImage` components
7. **Social Sharing**: Generates platform-specific text and hashtags through `shareUtils.ts`

### Key Components
- **`ContestantCard`**: Individual contestant display showing only name and furigana. Supports disabled state during selection. Features placeholder system with initials extraction and dynamic gradient backgrounds based on name hash (8 gradient combinations).
- **`MultiPickShareImage`**: Generates minimalist share images with responsive grid layout. Design philosophy: ultra-simple with only contestant photos/names, pick count in top-left, and gradient background. No headers, footers, show names, or decorative emojis. Grid adjusts dimensions based on selection count (1-10+ picks).
  - **Background Color System**: 12 preset gradients that users can cycle through by clicking
  - Initial background chosen randomly on page load using `Math.random()`
  - Click handler cycles to next preset in sequence (loops back to start after 12th)
  - Displays preset name and number in bottom-right (e.g., "Pink + Purple 6/12")
  - User hint displayed below image: "💡 クリックで背景色変更 (12種類)"
  - Presets include: Mint+Coral, Purple+Pink+Orange, Mint+Blue+Coral, Blue+Purple, Coral+Gold, Pink+Purple, Ocean, Sunset, Forest, Lavender, Fire, Night
- **`useSelections`**: Custom hook for managing multiple selections in localStorage with legacy migration.
- **`shareUtils.ts`**: Utilities for social sharing including:
  - `generateTwitterShareText()`: Creates tweet text with contestant `displayName` hashtags + #1pick + #Share1Pick (no show hashtags, fits in 140 chars)
  - `encodeShareData()`/`decodeShareData()`: Minimal URL encoding using only showId+contestantId, restores full data from `shows.ts`
  - `copyToClipboard()`: Cross-browser clipboard support

### Share URL System
Share URLs use a minimal encoding strategy to keep URLs short:
- Encodes only `showId` and `contestantId` (not full contestant data)
- Base64-encoded with URL-safe characters
- Average length: ~120 characters for typical multi-pick
- `decodeShareData()` restores full data by looking up IDs in `src/data/shows.ts`
- Backward compatible: handles both old (full data) and new (minimal) formats
- Used by: `/share/[shareId]` page and OGP image generation

### User Flow & UI
**Intentional Simplifications**:
- ❌ No search/filter, company/agency, nationality, rank, gender badges, show descriptions, contestant count, status badges, year display on homepage
- ✅ Ultra-minimal UI: title, clickable debut group name (links to official site), selected contestant only

**Sticky Bottom Bars**:
- **Homepage**: "🎉 シェアする" button + selection count badge (visible when selections exist)
- **Show Detail Pages**: Selected contestant info (thumbnail, name, furigana) + "ホーム" button
- Both use white background (dark: gray-800), purple border-top, shadow-lg, z-50, slide-up animation via Framer Motion
- Pages use `pb-28` padding to prevent content overlap

**Layout**:
- Homepage displays shows in chronological single-column list (sorted by year)
- Show cards display optional logo above title (48px height, auto width, SVG recommended)
- Selected contestant display:
  - **Desktop**: Left-right split layout with show info on left (flex-1) and full-height contestant image on right (192px width)
  - **Mobile**: Stacked layout with show info on top and larger contestant image below (224px height)
  - Card minimum height: 200px when contestant is selected
  - Image uses `object-cover` to fill entire height
  - **Hover effect** (desktop only): Contestant name and furigana appear on image hover with gradient overlay (300ms fade transition)
  - **Mobile**: Name and furigana always visible with gradient overlay
- Show detail pages: Contestants automatically sorted by `furigana` (or `displayName`) using Japanese locale sorting (`localeCompare('ja')`)

### Design System
**Color Palette** (Mint + Coral):
- **Primary (Mint)**: #5DD9B9 (`mint-600`) - Fresh, modern feel for primary actions and links
- **Secondary (Coral)**: #FF8A80 (`coral-600`) - Warm, energetic accent for secondary actions
- **Accent Colors**: Gold (#FFD54F) and Blue (#6EC5FF) for additional highlights
- **Background**:
  - Light mode: Mint-50 (#F0FFFC) to Warm cream (#FFFBF0) gradient
  - Dark mode: Dark teal (#0f1f1c) to Dark surface (#1a2d29) gradient
- **Text**: Dark teal (#2D5F56) for emphasized text

**Button Design Philosophy**:
- Use **solid colors only** - no gradients (user preference for clean, simple aesthetic)
- Primary actions: `bg-mint-600 hover:bg-mint-500`
- Secondary actions: `bg-coral-600 hover:bg-coral-500`
- Example: "シェアする" button uses solid mint, "コピー" button uses solid coral

**CSS Custom Properties**:
- All colors defined in `src/app/globals.css` as CSS variables
- Available as Tailwind utilities throughout the app (e.g., `bg-mint-600`, `text-coral-600`)
- Mint scale: 50, 100, 300, 400, 500, 600
- Coral scale: 400, 500, 600

### Data Management
All show and contestant data is statically defined in `src/data/shows.ts`. No external APIs or databases. Images use placeholder fallbacks with gradient backgrounds and initials.

**Selection Storage** (localStorage):
- `allSelections`: Object mapping showId to UserSelection for multi-pick functionality
- `lastSelection`: Legacy single selection (automatically migrated to allSelections)
- Managed through the `useSelections` hook with type-safe operations

## Data Schema

### Type Definitions

```typescript
// Show interface
{
  id: string;
  title: string;
  year: number;  // Used for chronological sorting
  debutGroup?: string;
  officialWebsite?: string;
  logo?: string;  // Path to show logo (SVG recommended, displayed on homepage)
  contestants: Contestant[];
}

// Contestant interface
{
  id: string;  // Unique identifier (required for selection tracking)
  displayName: string;  // Main display name (e.g., "김채원", "宮脇咲良")
  furigana?: string;  // IMPORTANT: Must be Katakana format with middle dot (・)
  image: string;  // Path to image (local or external URL)
}
```

**Furigana Requirements**:
- Korean names: Based on Korean pronunciation (e.g., 강다니엘 → "カン・ダニエル")
- Japanese names: Standard Katakana reading (e.g., 笠原桃奈 → "カサハラ・モモナ")
- Chinese names: Based on Chinese pronunciation (e.g., 許豊凡 → "シュー・フォンファン")

### Adding New Shows

To add a new show, modify `src/data/shows.ts`:

```typescript
{
  id: 'unique-show-id',
  title: 'Show Name',
  year: 2024,
  debutGroup: 'Final Group Name',
  officialWebsite: 'https://official-site.com/',
  logo: '/images/logos/show-logo.svg',  // Optional: Show logo (SVG recommended)
  contestants: [
    {
      id: 'unique-contestant-id',
      displayName: '김채원',
      furigana: 'キム・チェウォン',
      image: '/images/contestants/image.jpg'
    }
  ]
}
```

**Important**: When adding new shows, you do NOT need to update hashtag mappings in `src/lib/shareUtils.ts`. The Twitter sharing feature (`generateTwitterShareText()`) only uses contestant names (`displayName`) + `#1pick` + `#Share1Pick` - no show-specific hashtags.

**Adding Show Logos**:
1. Download official logo from show's website (SVG format preferred)
2. Save to `public/images/logos/` directory
3. Add `logo` field to show data pointing to the saved file
4. Logo displayed above show title on homepage (height: 48px, auto width)

## Critical Technical Constraints

### html2canvas Compatibility

**IMPORTANT**: `html2canvas` cannot parse modern CSS color functions (OKLCH/oklab) from Tailwind CSS 4.

**Never use** in components rendered by html2canvas:
- ❌ Tailwind opacity modifiers: `bg-white/10`, `bg-black/20`, `opacity-80`
- ❌ Tailwind gradients: `bg-gradient-to-br from-purple-500`

**Always use** explicit RGB/RGBA inline styles:
- ✅ `style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}`
- ✅ `style={{ background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153))' }}`

This applies to `MultiPickShareImage` and any component passed to html2canvas.

### Satori Layout Requirements (OGP Images)

The `ImageResponse` API (`src/app/share/[shareId]/opengraph-image.tsx`) uses Satori for rendering JSX to images at 1200x630px.

**Strict Rules**:
1. All `<div>` elements with multiple children MUST have explicit `display: 'flex'` or `display: 'none'`
2. All text content MUST be wrapped in elements like `<span>` - cannot be direct children of divs
3. Only flexbox layout supported (no CSS grid, no absolute positioning)
4. All styles must be inline (no className or external stylesheets)

**Metadata Configuration**:
- `metadataBase: new URL('https://share1pick.vercel.app')` is **required** in `src/app/layout.tsx`
- `generateMetadata` cannot be exported from `'use client'` components
- Pattern: Server component exports `generateMetadata`, UI logic in separate client component

**OGP Image Behavior**:
- OGP images do NOT display in Twitter/X Web Intent compose dialog (this is normal Twitter behavior)
- OGP images DO display after the tweet is posted and when the URL is shared
- To verify OGP: View page source and check `<meta property="og:image">` or use Twitter Card Validator

### Image Proxy for CORS

External images (e.g., from https://3rd.produce101.jp/) require CORS headers for html2canvas. The app implements `/api/image-proxy/route.ts`:
- Accepts `url` query parameter
- Returns image with `Access-Control-Allow-Origin: *`
- Implements aggressive caching (`max-age=31536000, immutable`)

Usage in components:
```typescript
const getProxiedImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }
  return imageUrl;
};
```

### External Image Configuration

Next.js configuration allows external images from official sources:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '3rd.produce101.jp',
      pathname: '/static/produce101s3/profile/**',
    }
  ]
}
```

When adding images from new external sources, update the `remotePatterns` array.

## Implementation Patterns

### React 19 Best Practices
- Use the `use()` hook for unwrapping Promises in dynamic routes instead of nested useEffect patterns
- Example: `const resolvedParams = use(params);` instead of `useEffect(() => params.then(setParams), [params])`
- Prevents React hydration errors and follows React 19 conventions

### Avoiding Hydration Errors
- Never nest `<a>` tags (or Next.js `<Link>` components that render as `<a>`)
- Use `<span>` with `onClick` handlers for nested interactive elements
- Use `window.open()` for external links inside clickable cards
- Example: Homepage debut group names use `<span onClick>` with `window.open()` instead of `<a>` to avoid nesting inside `<Link>`

### Image Error Handling
- Use React's declarative approach with `useState` for tracking image errors
- Never manipulate DOM directly (e.g., `e.target.style.display = 'none'`)
- Use conditional rendering: `{!imageError ? <Image /> : <Placeholder />}`
- All images should have `loading="lazy"` for performance

### Component State Management
- `ContestantCard` components become disabled during selection to prevent multiple rapid selections
- Show detail pages re-enable selection after 1 second without redirecting
- Selection state managed globally through `useSelections` hook with localStorage persistence
- Homepage show cards use `ShowCard` component with independent image error state for each contestant thumbnail
- Sticky bars use separate image error states for proper fallback handling

### Modal Pattern (Tweet Modal)
The tweet modal in `src/app/my-picks/page.tsx` demonstrates the app's modal pattern:
- Uses Framer Motion for smooth animations (`initial`, `animate`, `exit`)
- Backdrop click closes modal (with `onClick` on outer div, `stopPropagation` on inner)
- ESC key support via `useEffect` with keyboard listener
- Editable textarea for tweet text with character count
- Visual hashtag preview matching actual tweet content
- Modal UI must stay in sync with share logic (both use `displayName` for hashtags)

### User Flow After Selection
After selecting a contestant on show detail pages, users remain on the same page to browse other contestants. They return to homepage using the "ホーム" button in the sticky bottom bar.

### Twitter/X Sharing Flow
The "Xでシェア" button on `/my-picks` page follows this flow:
1. Generates share URL: `https://share1pick.vercel.app/share/{shareId}`
2. Creates tweet text with contestant hashtags only (no show hashtags): `#参加者名 #1pick #Share1Pick`
3. Attempts Web Share API first (mobile-friendly)
4. Falls back to Twitter Web Intent if Web Share unavailable
5. **Important**: Tweet text + URL must fit in 140 characters (Twitter counts all URLs as 23 chars via t.co)
6. OGP image displays after tweet is posted, not in compose dialog

### Hover Effects
Homepage contestant cards use Tailwind's `group` utility for hover detection:
- Add `group` class to the container element
- Child elements use `md:opacity-0 md:group-hover:opacity-100` for desktop-only hover reveals
- Mobile uses `opacity-100` to always show content (touch devices don't have hover)
- Smooth transitions with `transition-opacity duration-300`
- Example: Contestant name overlay fades in on image hover (desktop), always visible on mobile

## Deployment

Configured for Vercel deployment with Tokyo region (hnd1). Static assets cached for 1 year. Optimized for Japanese and Korean audiences interested in K-pop survival shows.

**Production URL**: https://share1pick.vercel.app

**Technology Stack**:
- Next.js 15.5.4 with App Router (Turbopack for dev only)
- TypeScript 5 with strict mode
- React 19.1.0
- Tailwind CSS 4 with PostCSS
- Framer Motion 12.23.22
- html2canvas 1.4.1
- Vercel with Tokyo region (hnd1)
