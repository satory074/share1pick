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
2. **Contestant Selection**: Users select a contestant on show detail pages (`src/app/show/[id]/page.tsx`)
3. **Image Generation**: Creates shareable images using `html2canvas` via `ShareImagePreview` component
4. **Social Sharing**: Generates platform-specific text and hashtags through `shareUtils.ts`

### Key Components
- `ContestantCard`: Individual contestant display with ranking, nationality, company info
- `ContestantFilter`: Search, sort, and filter contestants by name, company, or nationality
- `ShareImagePreview`: Generates the visual 1-pick card for image export
- `ShareActions`: Manages sharing options, text generation, and social media integration

### Data Management
All show and contestant data is statically defined in `src/data/shows.ts`. No external APIs or databases are used. Images are referenced by path but use placeholder fallbacks.

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

Also update the hashtag mapping in `src/lib/shareUtils.ts` `generateHashtags()` function for show-specific social media tags.

## Image Generation System

The app uses `html2canvas` to convert the `ShareImagePreview` component into downloadable PNG images. The component is designed with a fixed 400x600px layout optimized for social media sharing.

## Share Text Generation

The `shareUtils.ts` provides:
- **Dynamic hashtags**: Show-specific tags plus common ones (#1pick, #Share1Pick)
- **Multiple templates**: Random selection from 3 different sharing text formats
- **Nationality mapping**: Converts country codes to emoji flags
- **Clipboard integration**: Copy sharing text for manual posting

## Routing Structure

- `/` - Homepage with show grid
- `/show/[id]` - Dynamic show detail pages with contestant selection
- Static generation for homepage, dynamic rendering for show pages

## Deployment Notes

Configured for Vercel deployment with Tokyo region (hnd1). Static assets are cached for 1 year. The app is optimized for Japanese and Korean audiences interested in K-pop survival shows.

## Production URL

The application is deployed at: https://share1pick.vercel.app

## Key Implementation Details

- **No authentication required**: Users can immediately select and share without signing up
- **Client-side storage**: User selections stored in localStorage for session persistence
- **Placeholder images**: Contestants use fallback placeholder images if actual images fail to load
- **Mobile-first design**: Fully responsive across mobile, tablet, and desktop
- **Error handling**: Graceful fallbacks for failed image generation and sharing

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Image Generation**: html2canvas
- **Types**: TypeScript with strict mode
- **Deployment**: Vercel with Tokyo region (hnd1)