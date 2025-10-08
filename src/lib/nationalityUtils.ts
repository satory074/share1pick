export function getNationalityFlag(nationality?: string): string {
  const flagMap: Record<string, string> = {
    'KR': '🇰🇷',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'TW': '🇹🇼',
    'HK': '🇭🇰',
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'VN': '🇻🇳',
    'ID': '🇮🇩'
  };
  return flagMap[nationality || ''] || '🌟';
}
