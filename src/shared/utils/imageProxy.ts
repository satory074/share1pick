/**
 * 外部URLをCORS対応プロキシ経由で返す
 * Source of truth: html2canvas使用コンポーネントはこの関数を使うこと
 */
export function getProxiedImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }
  return imageUrl;
}
