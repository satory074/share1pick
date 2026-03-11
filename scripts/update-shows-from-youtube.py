#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = []
# ///
"""
YouTube IDのJSONをもとにshows.tsを更新するスクリプト

Usage:
  uv run scripts/update-shows-from-youtube.py <show-id>

  show-idに対応するscripts/youtube-ids-{show-id}.jsonを読み込み、
  src/data/shows.ts の image フィールドを更新する。

Options:
  --dry-run    実際には変更しない（差分表示のみ）
"""

import sys
import json
import re
from pathlib import Path

SHOWS_TS_PATH = Path("src/data/shows.ts")


def load_results(show_id: str) -> list[dict]:
    """収集済みJSONを読み込む"""
    json_path = Path(f"scripts/youtube-ids-{show_id}.json")
    if not json_path.exists():
        print(f"ERROR: {json_path} not found. Run collect-youtube-ids.py first.")
        sys.exit(1)
    with open(json_path, encoding='utf-8') as f:
        return json.load(f)


def update_shows_ts(results: list[dict], dry_run: bool = False) -> int:
    """shows.tsのimage URLを更新。変更件数を返す"""
    content = SHOWS_TS_PATH.read_text(encoding='utf-8')
    original = content

    changed = 0
    skipped = 0
    failed = 0

    for result in results:
        contestant_id = result['id']
        video_id = result.get('videoId')

        if not video_id:
            print(f"  SKIP (no videoId): {result['displayName']} ({contestant_id})")
            failed += 1
            continue

        new_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

        # id フィールドでこの参加者を特定する正規表現
        # { id: 'contestant-id', ... image: '...' } パターン
        # 改行をまたぐケースも対応
        pattern = rf"(id: '{re.escape(contestant_id)}'[^}}]*?image: ')(.*?)(')"

        def replacer(m, new_url=new_url):
            old_url = m.group(2)
            if old_url == new_url:
                return m.group(0)  # 変更なし
            return m.group(1) + new_url + m.group(3)

        new_content, n = re.subn(pattern, replacer, content, flags=re.DOTALL)

        if n == 0:
            print(f"  NOT FOUND in shows.ts: {contestant_id}")
            failed += 1
            continue

        # 変更があったかチェック
        if new_content == content:
            print(f"  UNCHANGED (already correct): {contestant_id}")
            skipped += 1
        else:
            # 何が変わったか表示
            old_match = re.search(pattern, content, re.DOTALL)
            old_url = old_match.group(2) if old_match else '?'
            print(f"  UPDATE: {result['displayName']} ({contestant_id})")
            print(f"    OLD: {old_url}")
            print(f"    NEW: {new_url}")
            changed += 1
            content = new_content

    if not dry_run and changed > 0:
        SHOWS_TS_PATH.write_text(content, encoding='utf-8')
        print(f"\nWrote {SHOWS_TS_PATH}")
    elif dry_run:
        print(f"\n[DRY RUN] Would write {SHOWS_TS_PATH}")

    print(f"\nSummary: {changed} updated, {skipped} unchanged, {failed} failed")
    return changed


if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith('--')]

    if not args:
        print("Usage: uv run scripts/update-shows-from-youtube.py <show-id> [--dry-run]")
        sys.exit(1)

    show_id = args[0]
    print(f"Updating shows.ts for: {show_id}")
    if dry_run:
        print("[DRY RUN mode]")
    print("=" * 60)

    results = load_results(show_id)
    print(f"Loaded {len(results)} contestants from youtube-ids-{show_id}.json")
    print()

    update_shows_ts(results, dry_run=dry_run)
