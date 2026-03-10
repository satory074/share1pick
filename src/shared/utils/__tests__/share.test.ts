import { describe, it, expect } from 'vitest';
import { encodeShareData, decodeShareData, generateTwitterShareText } from '../share';
import { MultiPickData } from '@/types';

// 実際の shows.ts に存在するIDを使用（decodeShareData がlookupするため）
const mockPicks: MultiPickData[] = [
  {
    show: {
      id: 'produce48',
      title: 'PRODUCE 48',
      year: 2018,
      debutGroup: 'IZ*ONE',
      contestants: [
        { id: 'park-seoyoung', displayName: '박서영', furigana: 'パク・ソヨン', image: '/test.jpg' },
      ],
    },
    contestant: { id: 'park-seoyoung', displayName: '박서영', furigana: 'パク・ソヨン', image: '/test.jpg' },
  },
  {
    show: {
      id: 'girls-planet-999',
      title: 'Girls Planet 999',
      year: 2021,
      debutGroup: 'Kep1er',
      contestants: [
        { id: 'kim-chaehyun', displayName: '김채현', furigana: 'キム・チェヒョン', image: '/test2.jpg' },
      ],
    },
    contestant: { id: 'kim-chaehyun', displayName: '김채현', furigana: 'キム・チェヒョン', image: '/test2.jpg' },
  },
];

describe('encodeShareData + decodeShareData (round-trip)', () => {
  it('encodes without special chars that break URLs', () => {
    const encoded = encodeShareData(mockPicks);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
  });

  it('decodes back to same show/contestant IDs', () => {
    const encoded = encodeShareData(mockPicks);
    const decoded = decodeShareData(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.picks).toHaveLength(2);
    expect(decoded!.picks[0].showId).toBe('produce48');
    expect(decoded!.picks[0].contestantId).toBe('park-seoyoung');
    expect(decoded!.picks[1].showId).toBe('girls-planet-999');
    expect(decoded!.picks[1].contestantId).toBe('kim-chaehyun');
  });
});

describe('decodeShareData', () => {
  it('returns null for invalid input', () => {
    expect(decodeShareData('not-valid-base64!!!')).toBeNull();
    expect(decodeShareData('')).toBeNull();
  });

  it('returns null for valid base64 but no picks', () => {
    const encoded = Buffer.from(JSON.stringify({ picks: [] })).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(decodeShareData(encoded)).toBeNull();
  });

  it('returns null for picks with unknown show/contestant IDs', () => {
    const data = { picks: [{ s: 'nonexistent-show', c: 'nobody' }] };
    const encoded = Buffer.from(JSON.stringify(data)).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(decodeShareData(encoded)).toBeNull();
  });
});

describe('generateTwitterShareText', () => {
  it('includes contestant displayName as hashtags', () => {
    const text = generateTwitterShareText(mockPicks);
    expect(text).toContain('#박서영');
    expect(text).toContain('#김채현');
  });

  it('includes base hashtags', () => {
    const text = generateTwitterShareText(mockPicks);
    expect(text).toContain('#1pick');
    expect(text).toContain('#Share1Pick');
  });

  it('does not include show-specific hashtags', () => {
    const text = generateTwitterShareText(mockPicks);
    expect(text).not.toContain('#PRODUCE48');
    expect(text).not.toContain('#GirlsPlanet999');
  });
});
