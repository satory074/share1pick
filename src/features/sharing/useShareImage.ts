'use client';

/**
 * html2canvas を動的 import してシェア画像を生成するカスタムフック
 * 動的 import により初期バンドルサイズを削減
 *
 * html2canvas 制約（重要）:
 * - OKLCH カラー関数は使用不可（Tailwind CSS 4 の opacity 修飾子・グラデーション禁止）
 * - 代わりに RGBA inline style を使用すること
 */
export function useShareImage() {
  const captureImage = async (elementId: string): Promise<boolean> => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element #${elementId} not found`);
      return false;
    }

    try {
      // 動的 import で初期バンドルから除外
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        logging: false,
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'my-1picks.png';
      link.href = url;
      link.click();

      return true;
    } catch (err) {
      console.error('Failed to capture image:', err);
      return false;
    }
  };

  return { captureImage };
}
