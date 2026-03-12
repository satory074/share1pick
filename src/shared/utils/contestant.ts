/**
 * 名前からイニシャルを取得する（AvatarFallback 用）
 * Source of truth: 全コンポーネントでこの関数を使用すること
 */
export function getNameInitials(displayName: string): string {
  if (displayName.length > 1) {
    return displayName.slice(0, 2);
  }
  return displayName.charAt(0);
}

const GRADIENTS = [
  'from-purple-400 to-pink-400',
  'from-blue-400 to-cyan-400',
  'from-green-400 to-teal-400',
  'from-orange-400 to-red-400',
  'from-indigo-400 to-purple-400',
  'from-pink-400 to-rose-400',
  'from-cyan-400 to-blue-400',
  'from-teal-400 to-green-400',
] as const;

const gradientCache = new Map<string, string>();

/**
 * 名前ハッシュに基づいて一貫したグラデーションクラスを返す
 * Source of truth: 全コンポーネントでこの関数を使用すること
 */
export function getNameGradientClass(displayName: string): string {
  if (gradientCache.has(displayName)) return gradientCache.get(displayName)!;
  const hash = displayName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const result = GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  gradientCache.set(displayName, result);
  return result;
}
