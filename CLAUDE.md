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
- Turbopack is ONLY used in development mode (`npm run dev`). Production builds use the standard Next.js compiler for stability. Do not add `--turbopack` flag to the build script.
- The development server may use port 3001 if 3000 is already in use.

## Architecture Overview

This is a Next.js 15 application using App Router for a survival audition show 1-pick sharing platform. The app allows users to select their favorite contestant from various K-pop survival shows and generate shareable images. Built with TypeScript, Tailwind CSS, and Framer Motion for animations.

### Core Data Flow
1. **Show Selection**: Users browse shows on the homepage (`src/app/page.tsx`) where selected contestants are displayed with images on the right side of show cards
2. **Contestant Selection**: Users select contestants on show detail pages (`src/app/show/[id]/page.tsx`)
3. **Selection Feedback**: After selection, users see success feedback (✅ + contestant name) and stay on the same page to browse other contestants
4. **Multi-Pick Collection**: Users access their collection via the prominent "🎉 シェアする" button on homepage
5. **Bulk Sharing**: Users share all selections at once from the My Picks page (`src/app/my-picks/page.tsx`)
6. **Image Generation**: Creates shareable images using `html2canvas` via `MultiPickShareImage` components
7. **Social Sharing**: Generates platform-specific text and hashtags through `shareUtils.ts`

### Key Components
- `ContestantCard`: Individual contestant display with clean, focused design showing only name and furigana. Supports disabled state during selection. Features enhanced placeholder system with smart initials extraction and dynamic gradient backgrounds based on name hash.
- `MultiPickShareImage`: Generates collage-style images for multiple selections with responsive grid layout
- `ShareImagePreview`: Generates single contestant share images (legacy feature, less commonly used)
- `useSelections`: Custom hook for managing multiple selections in localStorage with legacy migration

### Simplified Data Architecture
**Important**: The app has been intentionally simplified to focus on core functionality:
- ❌ No search/filter functionality
- ❌ No company/agency display
- ❌ No nationality display
- ❌ No rank/position display
- ❌ No gender badges on homepage
- ❌ No show description text on homepage
- ❌ No contestant count display on homepage
- ❌ No status badges (completed/ongoing) on homepage
- ❌ No year display on homepage (removed for minimalism)
- ❌ No "selected" badges on homepage cards (redundant when contestant is shown)
- ❌ No standalone official website links (integrated into debut group name)
- ✅ Clean focus on contestant names only (displayName + optional furigana in Katakana)
- ✅ Ultra-minimal homepage UI: title, clickable debut group name (links to official site), selected contestant only

### User Flow Implementation
The application follows a streamlined flow optimized for mobile-first usage:
- **Homepage**: Sticky bottom bar with "🎉 シェアする" button (visible when selections exist). Selected contestants are displayed with images on the right side of show cards (desktop) or below show info (mobile)
- **Selection Page**: Sticky bottom bar shows selected contestant thumbnail, name, and "ホーム" button for easy navigation. Users remain on the page to browse other contestants (no auto-redirect)
- **Sharing Flow**: Centralized in My Picks page with bulk operations for all selections

### Sticky UI Elements
The app uses sticky bottom bars for improved mobile UX:
- **Homepage** (`src/app/page.tsx`): Fixed bottom bar with "🎉 シェアする" button + selection count badge (only visible when selectionCount > 0)
- **Show Detail Pages** (`src/app/show/[id]/page.tsx`): Fixed bottom bar with selected contestant info (thumbnail 60-64px, displayName, furigana) + "ホーム" button
- **Design Consistency**: Both use white background (dark mode: gray-800), purple border-top, shadow-lg, z-50, slide-up animation via Framer Motion
- **Layout Adjustment**: Pages use `pb-28` (bottom padding) to prevent content from being hidden by sticky bars

### Data Management
All show and contestant data is statically defined in `src/data/shows.ts`. No external APIs or databases are used. Images are referenced by path but use placeholder fallbacks.

**Selection Storage**: The app uses localStorage to persist user selections across sessions:
- `allSelections`: Object mapping showId to UserSelection for multi-pick functionality
- `lastSelection`: Legacy single selection (automatically migrated to allSelections)
- Selections are managed through the `useSelections` hook with type-safe operations

## Adding New Shows

To add a new survival audition show, modify `src/data/shows.ts`:

```typescript
{
  id: 'unique-show-id',
  title: 'Show Name',
  year: 2024,
  type: 'male' | 'female' | 'mixed',
  status: 'completed' | 'ongoing' | 'upcoming',
  debutGroup: 'Final Group Name',
  description: 'Brief description',
  officialWebsite: 'https://official-site.com/',
  contestants: [
    {
      id: 'unique-contestant-id',
      displayName: '김채원',
      furigana: 'キム・チェウォン', // IMPORTANT: Must be in Katakana format with middle dot (・)
      image: '/images/contestants/image.jpg'
    }
  ]
}
```

Also update the hashtag mapping in both `generateHashtags()` and `generateMultiPickShareText()` functions in `src/lib/shareUtils.ts` for show-specific social media tags.

## Current Show Data

The application currently includes comprehensive contestant data for major survival audition shows:

- **PRODUCE 101 (2016)**: 67 contestants including I.O.I members and extensive eliminated contestants
- **PRODUCE 101 SEASON2 (2017)**: 47 contestants including Wanna One members and JBJ formation members
- **PRODUCE 48 (2018)**: 55 contestants including IZ*ONE members and AKB48 Group participants
- **PRODUCE 101 JAPAN (2019)**: Complete JO1 debut lineup (11 members)
- **PRODUCE 101 JAPAN SEASON2 (2021)**: Complete INI debut lineup (11 members)
- **PRODUCE 101 JAPAN THE GIRLS (2023)**: Comprehensive dataset with 97 contestants including ME:I debut members, finalists, and additional contestants. Features official images from https://3rd.produce101.jp/ for 87 contestants
- **Other shows**: Basic debut member data for remaining shows (PRODUCE X 101, Girls Planet 999, Boys Planet, I-LAND, R U Next?, Nizi Project)

Each show includes official website links displayed on both homepage cards and detail pages.

## Enhanced Placeholder System

The application features a sophisticated placeholder system when contestant images are unavailable:

**Smart Initials Extraction**:
- Extracts initials from the contestant's displayName
- Falls back to first character if extraction fails

**Dynamic Gradient Backgrounds**:
- 8 different gradient combinations based on name hash for consistency
- Algorithm: `name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)`
- Ensures each contestant has a visually distinct and consistent placeholder

**Visual Elements**:
- Displays initials in placeholder state
- Maintains visual consistency across the application
- Seamless fallback when images fail to load

## Image Generation System

The app uses `html2canvas` to convert React components into downloadable PNG images. Single contestant sharing has been removed in favor of bulk multi-pick sharing.

**Multi-Pick Only**: `MultiPickShareImage` component with responsive grid layout that adjusts dimensions based on selection count:
- 1 pick: 400x600px (single column)
- 2 picks: 600x400px (2 columns, 1 row)
- 3-4 picks: 600x700px (2 columns, 2 rows)
- 5-6 picks: 800x600px (3 columns, 2 rows)
- 7-9 picks: 800x800px (3 columns, 3 rows)
- 10+ picks: 1000x800px (4 columns, 3 rows)

## Share Text Generation

The `shareUtils.ts` provides:
- **Dynamic hashtags**: Show-specific tags plus common ones (#1pick, #Share1Pick)
- **Multiple templates**: Random selection from 3 different sharing text formats
- **Multi-pick support**: `generateMultiPickShareText()` combines hashtags from all selected shows
- **Clipboard integration**: Copy sharing text for manual posting

## Routing Structure

- `/` - Homepage with chronological show list (single-column layout), selected contestant thumbnails on cards, and sticky bottom "🎉 シェアする" button
- `/show/[id]` - Dynamic show detail pages with contestant selection and sticky bottom bar showing selected contestant + "ホーム" button
- `/my-picks` - Multi-pick collection page with centralized sharing functionality
- Static generation for homepage, dynamic rendering for show and my-picks pages

## Critical Implementation Notes

**React 19 Best Practices**:
- Use the `use()` hook for unwrapping Promises (e.g., params in dynamic routes) instead of nested useEffect patterns
- This prevents React hydration errors and follows React 19 conventions
- Example: `const resolvedParams = use(params);` instead of `useEffect(() => params.then(setParams), [params])`

**Avoiding Hydration Errors**:
- Never nest `<a>` tags (or Next.js `<Link>` components that render as `<a>`)
- Use `<span>` with `onClick` handlers for nested interactive elements
- Use `window.open()` for external links inside clickable cards to avoid nesting
- Example: Homepage debut group names use `<span onClick>` with `window.open()` instead of `<a>` tags to avoid nesting inside `<Link>`

**Image Error Handling**:
- Use React's declarative approach with `useState` for tracking image errors
- Never manipulate DOM directly (e.g., `e.target.style.display = 'none'`)
- Use conditional rendering: `{!imageError ? <Image /> : <Placeholder />}`
- All images should have `loading="lazy"` for performance

**Shared Utilities**:
- Common utility functions are in `src/lib/` directory
- Import from shared utilities instead of duplicating code across components

**User Flow**: After selecting a contestant on show detail pages, users remain on the same page to browse other contestants. They can return to the homepage using the "ホーム" button in the sticky bottom bar.

**Component State Management**:
- `ContestantCard` components become disabled during selection to prevent multiple rapid selections
- Show detail pages re-enable selection after 1 second without redirecting
- Selection state is managed globally through the `useSelections` hook with localStorage persistence
- Homepage show cards use a `ShowCard` component that manages image error state independently for each contestant's thumbnail
- Sticky bars on both homepage and show detail pages use separate image error states for proper fallback handling

## Deployment Notes

Configured for Vercel deployment with Tokyo region (hnd1). Static assets are cached for 1 year. The app is optimized for Japanese and Korean audiences interested in K-pop survival shows.

## Production URL

The application is deployed at: https://share1pick.vercel.app

## Homepage Layout

The homepage displays shows in a chronological single-column list format (not grid layout), sorted by year from 2016 to 2023. This ensures clear temporal organization and optimal readability across all device sizes.

**Selected Contestant Display**: When a contestant is selected for a show, their information appears on the homepage show card:
- **Desktop (md and above)**: 2-column layout with show info on the left and contestant image (80x80px or 96x96px) with name on the right
- **Mobile**: Contestant info appears below show description with image on the left and name on the right in a horizontal layout
- Uses the same placeholder system as `ContestantCard` (gradient backgrounds with initials) for failed image loads

## Key Implementation Details

- **No authentication required**: Users can immediately select and share without signing up
- **Multi-pick functionality**: Users can select one contestant per show and collect them across multiple shows
- **Client-side storage**: User selections stored in localStorage with automatic legacy migration from single to multi-pick format
- **Enhanced placeholder system**: When contestant images fail to load, displays initials with dynamic gradient backgrounds. Colors are generated consistently based on name hash for visual distinction
- **Mobile-first design**: Fully responsive across mobile, tablet, and desktop with single-column chronological layout
- **Error handling**: Graceful fallbacks for failed image generation and sharing
- **State management**: Centralized selection logic through `useSelections` hook with type-safe operations
- **Official website integration**: External links to show official websites with proper security attributes

## Technology Stack

- **Framework**: Next.js 15.5.4 with App Router (Turbopack for dev only)
- **Language**: TypeScript 5 with strict mode
- **React**: 19.1.0 (uses modern `use()` hook for async operations)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animations**: Framer Motion 12.23.22
- **Image Generation**: html2canvas 1.4.1
- **Linting**: ESLint 9 with Next.js config
- **Deployment**: Vercel with Tokyo region (hnd1)
- **Package Manager**: npm

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (show list)
│   ├── show/[id]/         # Dynamic show detail pages
│   └── my-picks/          # Multi-pick collection & sharing
├── components/            # React components
│   ├── ContestantCard.tsx # Individual contestant display
│   └── MultiPickShareImage.tsx # Image generation component
├── data/
│   └── shows.ts          # All show & contestant data (single source of truth)
├── hooks/
│   └── useSelections.ts  # localStorage management for user selections
├── lib/                  # Shared utilities
│   └── shareUtils.ts     # Social sharing text generation
└── types/
    └── index.ts          # TypeScript type definitions
```

## Data Architecture Notes

**Show Interface**: Core `Show` type includes `officialWebsite?: string` field for external website links. Shows are organized chronologically in a single-column list layout on the homepage.

**Homepage Display**: The homepage show cards display only essential information with extreme minimalism:
- Show title only (no year, no badges, no metadata)
- Debut group name (if available) - clickable to open official website
  - When `officialWebsite` is present, clicking the debut group name opens the site in a new tab
  - Hover effect shows underline and external link icon (↗)
  - Purple color scheme indicates clickability
- Selected contestant thumbnail and name (when selected)
- Card padding reduced to `p-5` for compact design
- Hover effect is subtle (`scale: 1.02`) for refined interaction
- All non-essential elements removed: year, gender badges, description, contestant count, status, "selected" badge

**Contestant Interface**: Each contestant record includes:
- `displayName`: The main display name (e.g., "김채원", "宮脇咲良")
- `furigana`: Optional pronunciation/reading in **Katakana format** (e.g., "キム・チェウォン", "ミヤワキ・サクラ")
  - **IMPORTANT**: All furigana must be in Katakana, not Romanized
  - Use middle dot (・) separator for multi-part names
  - Korean names: Based on Korean pronunciation (e.g., 강다니엘 → "カン・ダニエル")
  - Japanese names: Standard Katakana reading (e.g., 笠原桃奈 → "カサハラ・モモナ")
  - Chinese names: Based on Chinese pronunciation (e.g., 許豊凡 → "シュー・フォンファン")
- `image`: Path to contestant image (local or external URL)
- `id`: Unique identifier

**Comprehensive Data**:
- Major PRODUCE series shows (2016-2018) include extensive contestant rosters beyond just debut members
- All Japanese PRODUCE series include complete debut group lineups
- PRODUCE 101 JAPAN THE GIRLS features the most comprehensive dataset with 97 contestants including ME:I debut members, finalists, and additional contestants. 87 contestants use official images from https://3rd.produce101.jp/
- Supports detailed fan exploration of complete show casts beyond just debut members

## External Image Configuration

**Critical Configuration**: The Next.js configuration allows external images from the official PRODUCE 101 JAPAN THE GIRLS website:

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

This configuration is required for official contestant images to load properly. Without this, images from external domains will be blocked by Next.js security features.

**Adding New External Image Domains**: When adding images from new external sources, update the `remotePatterns` array in `next.config.ts`. Each new domain requires a separate pattern configuration for security.