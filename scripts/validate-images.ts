/**
 * validate-images.ts
 *
 * Checks all contestants in shows.ts for empty image strings.
 * Usage:
 *   npx tsx scripts/validate-images.ts           # fails on empty images (prebuild)
 *   npx tsx scripts/validate-images.ts --warn    # warns only (exit 0)
 */

import { shows } from "../src/data/shows";

const warnOnly = process.argv.includes("--warn");

type EmptyEntry = { showId: string; showTitle: string; contestantId: string; displayName: string };

const empty: EmptyEntry[] = [];

for (const show of shows) {
  for (const contestant of show.contestants) {
    if (!contestant.image || contestant.image.trim() === "") {
      empty.push({
        showId: show.id,
        showTitle: show.title,
        contestantId: contestant.id,
        displayName: contestant.displayName,
      });
    }
  }
}

if (empty.length === 0) {
  console.log("✓ validate-images: all contestants have images.");
  process.exit(0);
}

const label = warnOnly ? "WARN" : "ERROR";
console.log(`\n${label}: ${empty.length} contestant(s) have empty image strings:\n`);

// Group by show for readability
const byShow = new Map<string, EmptyEntry[]>();
for (const e of empty) {
  const key = `${e.showId} (${e.showTitle})`;
  if (!byShow.has(key)) byShow.set(key, []);
  byShow.get(key)!.push(e);
}

for (const [showKey, entries] of byShow) {
  console.log(`  ${showKey}: ${entries.length} contestant(s)`);
  for (const e of entries) {
    console.log(`    - ${e.contestantId}: ${e.displayName}`);
  }
}

console.log(
  `\nFix: add an image URL to each contestant above.` +
    `\nSelf-hosted: /images/contestants/{show-id}/{contestant-id}.webp` +
    `\nYouTube:     https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg` +
    `\n`
);

if (warnOnly) {
  console.log("Running in --warn mode, continuing build despite empty images.");
  process.exit(0);
} else {
  console.log("Run with --warn to suppress this error and continue building.");
  process.exit(1);
}
