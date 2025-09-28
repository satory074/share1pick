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
```

## Architecture Overview

This is a Next.js 15 application using App Router for a survival audition show 1-pick sharing platform. The app allows users to select their favorite contestant from various K-pop survival shows and generate shareable images. Built with TypeScript, Tailwind CSS, and Framer Motion for animations.

### Core Data Flow
1. **Show Selection**: Users browse shows on the homepage (`src/app/page.tsx`)
2. **Contestant Selection**: Users select contestants on show detail pages (`src/app/show/[id]/page.tsx`)
3. **Multi-Pick Management**: Users can select from multiple shows and view their collection (`src/app/my-picks/page.tsx`)
4. **Image Generation**: Creates shareable images using `html2canvas` via `ShareImagePreview` or `MultiPickShareImage` components
5. **Social Sharing**: Generates platform-specific text and hashtags through `shareUtils.ts`

### Key Components
- `ContestantCard`: Individual contestant display with ranking, nationality, company info
- `ContestantFilter`: Search, sort, and filter contestants by name, company, or nationality
- `ShareImagePreview`: Generates the visual 1-pick card for single contestant image export
- `MultiPickShareImage`: Generates collage-style images for multiple selections with responsive grid layout
- `ShareActions`: Manages sharing options, text generation, and social media integration
- `useSelections`: Custom hook for managing multiple selections in localStorage with legacy migration

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

## Image Generation System

The app uses `html2canvas` to convert React components into downloadable PNG images:

**Single Pick**: `ShareImagePreview` component with fixed 400x600px layout for individual contestant sharing.

**Multi-Pick**: `MultiPickShareImage` component with responsive grid layout that adjusts dimensions based on selection count:
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

- `/` - Homepage with show grid, selection badges, and My 1Picks navigation button
- `/show/[id]` - Dynamic show detail pages with contestant selection and cross-navigation to My Picks
- `/my-picks` - Multi-pick collection page with combined sharing functionality
- Static generation for homepage, dynamic rendering for show and my-picks pages

## Deployment Notes

Configured for Vercel deployment with Tokyo region (hnd1). Static assets are cached for 1 year. The app is optimized for Japanese and Korean audiences interested in K-pop survival shows.

## Production URL

The application is deployed at: https://share1pick.vercel.app

## Key Implementation Details

- **No authentication required**: Users can immediately select and share without signing up
- **Multi-pick functionality**: Users can select one contestant per show and collect them across multiple shows
- **Client-side storage**: User selections stored in localStorage with automatic legacy migration from single to multi-pick format
- **Placeholder images**: Contestants use fallback placeholder images if actual images fail to load
- **Mobile-first design**: Fully responsive across mobile, tablet, and desktop with adaptive grid layouts
- **Error handling**: Graceful fallbacks for failed image generation and sharing
- **State management**: Centralized selection logic through `useSelections` hook with type-safe operations

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Image Generation**: html2canvas
- **Types**: TypeScript with strict mode
- **Deployment**: Vercel with Tokyo region (hnd1)