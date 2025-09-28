# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (with Turbopack for faster builds)
npm run dev

# Production build (includes linting and type checking)
npm run build

# Lint code
npm run lint

# Start production server
npm start

# Deploy to production
vercel --prod
```

## Architecture Overview

This is a Next.js 15 application using App Router for a survival audition show 1-pick sharing platform. The app allows users to select their favorite contestant from various K-pop survival shows and generate shareable images. Built with TypeScript, Tailwind CSS, and Framer Motion for animations.

### Core Data Flow
1. **Show Selection**: Users browse shows on the homepage (`src/app/page.tsx`)
2. **Contestant Selection**: Users select contestants on show detail pages (`src/app/show/[id]/page.tsx`)
3. **Auto-Redirect**: After selection, users are automatically redirected back to homepage with success feedback
4. **Multi-Pick Collection**: Users access their collection via the prominent "🎉 シェアする" button on homepage
5. **Bulk Sharing**: Users share all selections at once from the My Picks page (`src/app/my-picks/page.tsx`)
6. **Image Generation**: Creates shareable images using `html2canvas` via `MultiPickShareImage` components
7. **Social Sharing**: Generates platform-specific text and hashtags through `shareUtils.ts`

### Key Components
- `ContestantCard`: Individual contestant display with ranking, nationality, company info. Supports disabled state during selection. Features enhanced placeholder system with smart initials extraction and dynamic gradient backgrounds based on name hash and rank.
- `ContestantFilter`: Search, sort, and filter contestants by name, company, or nationality
- `MultiPickShareImage`: Generates collage-style images for multiple selections with responsive grid layout
- `useSelections`: Custom hook for managing multiple selections in localStorage with legacy migration

### User Flow Implementation
The application follows a streamlined flow optimized for mobile-first usage:
- **Selection Page**: Shows success feedback (✅ + contestant name) and auto-redirects after 1 second
- **Homepage**: Prominent gradient "🎉 シェアする" button with selection count badge
- **Sharing Flow**: Centralized in My Picks page with bulk operations for all selections

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
      name: 'Contestant Name',
      image: '/images/contestants/image.jpg',
      company: 'Company Name',
      rank: 1,
      nationality: 'KR' // Maps to emoji flags
    }
  ]
}
```

Also update the hashtag mapping in both `generateHashtags()` and `generateMultiPickShareText()` functions in `src/lib/shareUtils.ts` for show-specific social media tags.

## Current Show Data

The application currently includes comprehensive contestant data for major survival audition shows:

- **PRODUCE 101 (2016)**: 67 contestants including I.O.I members and extensive eliminated contestants through rank 61
- **PRODUCE 101 SEASON2 (2017)**: 47 contestants including Wanna One members and JBJ formation members
- **PRODUCE 48 (2018)**: 55 contestants including IZ*ONE members and AKB48 Group participants
- **PRODUCE 101 JAPAN (2019)**: Complete JO1 debut lineup (11 members)
- **PRODUCE 101 JAPAN SEASON2 (2021)**: Complete INI debut lineup (11 members)
- **PRODUCE 101 JAPAN THE GIRLS (2023)**: Comprehensive dataset with 35 contestants including ME:I debut members (ranks 1-11), finalists (ranks 12-20), and additional contestants (ranks 21-35)
- **Other shows**: Basic debut member data for remaining shows (PRODUCE X 101, Girls Planet 999, Boys Planet, I-LAND, R U Next?, Nizi Project)

Each show includes official website links displayed on both homepage cards and detail pages.

## Enhanced Placeholder System

The application features a sophisticated placeholder system when contestant images are unavailable:

**Smart Initials Extraction**:
- For names like "김채원 (Kim Chaewon)", extracts "김K" as initials
- Handles Korean/English name combinations intelligently
- Falls back to first character if parsing fails

**Dynamic Gradient Backgrounds**:
- 8 different gradient combinations based on name hash for consistency
- Special rank-based colors: gold gradient for ranks 1-3, purple for ranks 4-11
- Algorithm: `name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)`

**Visual Elements**:
- Displays initials and rank number in placeholder state
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
- **Nationality mapping**: Converts country codes to emoji flags
- **Clipboard integration**: Copy sharing text for manual posting

## Routing Structure

- `/` - Homepage with chronological show list (single-column layout), selection badges, and prominent "🎉 シェアする" button
- `/show/[id]` - Dynamic show detail pages with contestant selection and auto-redirect after selection
- `/my-picks` - Multi-pick collection page with centralized sharing functionality
- Static generation for homepage, dynamic rendering for show and my-picks pages

## Critical Implementation Notes

**User Flow**: The app implements a specific flow where users are automatically redirected to the homepage after making a selection on show detail pages. Do not modify this behavior without user request.

**Component State Management**:
- `ContestantCard` components become disabled during selection to prevent multiple rapid selections
- Show detail pages display success feedback with auto-redirect after 1 second
- Selection state is managed globally through the `useSelections` hook with localStorage persistence

## Deployment Notes

Configured for Vercel deployment with Tokyo region (hnd1). Static assets are cached for 1 year. The app is optimized for Japanese and Korean audiences interested in K-pop survival shows.

## Production URL

The application is deployed at: https://share1pick.vercel.app

## Homepage Layout

The homepage displays shows in a chronological single-column list format (not grid layout), sorted by year from 2016 to 2023. This ensures clear temporal organization and optimal readability across all device sizes.

## Key Implementation Details

- **No authentication required**: Users can immediately select and share without signing up
- **Multi-pick functionality**: Users can select one contestant per show and collect them across multiple shows
- **Client-side storage**: User selections stored in localStorage with automatic legacy migration from single to multi-pick format
- **Enhanced placeholder system**: When contestant images fail to load, displays smart initials extraction from Korean/English names with dynamic gradient backgrounds. Colors are generated consistently based on name hash, with special gradients for top ranks (gold for top 3, purple for top 11)
- **Mobile-first design**: Fully responsive across mobile, tablet, and desktop with single-column chronological layout
- **Error handling**: Graceful fallbacks for failed image generation and sharing
- **State management**: Centralized selection logic through `useSelections` hook with type-safe operations
- **Official website integration**: External links to show official websites with proper security attributes

## Technology Stack

- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.23.22
- **Image Generation**: html2canvas 1.4.1
- **Deployment**: Vercel with Tokyo region (hnd1)
- **Package Manager**: npm

## Data Architecture Notes

**Show Interface**: Core `Show` type includes `officialWebsite?: string` field for external website links. Shows are organized chronologically in a single-column list layout on the homepage.

**Contestant Interface**: Each contestant record includes optional `rank`, `company`, and `nationality` fields. Nationality codes map to emoji flags via `getNationalityFlag()` utility.

**Comprehensive Data**:
- Major PRODUCE series shows (2016-2018) include extensive contestant rosters beyond just debut members
- All Japanese PRODUCE series include complete debut group lineups
- PRODUCE 101 JAPAN THE GIRLS features the most comprehensive dataset with 35 contestants, including post-show career information reflected in company fields (e.g., contestants who joined other groups like MADEIN, UN1CON, cosmosy)
- Supports detailed fan exploration of complete show casts beyond just debut members