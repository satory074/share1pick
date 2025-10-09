import { ImageResponse } from 'next/og';
import { decodeShareData } from '@/lib/shareUtils';

export const runtime = 'edge';
export const alt = 'オールスター1pickコレクション';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ shareId: string }>;
}

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const shareData = decodeShareData(resolvedParams.shareId);

  if (!shareData || shareData.picks.length === 0) {
    // エラー画像を返す
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153))',
            color: 'white',
            fontSize: 48,
            fontWeight: 'bold',
          }}
        >
          無効な共有リンクです
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153), rgb(251, 146, 60))',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ fontSize: 20, marginBottom: '16px', opacity: 0.9 }}>
            MY ALL-STAR 1PICKS
          </div>
          <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: '16px' }}>
            {shareData.picks.length}つの番組から選んだ推しメン
          </div>
          <div style={{ fontSize: 24, opacity: 0.9 }}>
            サバイバルオーディション 1pick コレクション
          </div>
        </div>

        {/* Picks List */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {shareData.picks.slice(0, 4).map((pick, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '28px',
                  fontWeight: 'bold',
                }}
              >
                {pick.contestantName.charAt(0)}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {pick.contestantName}
                </div>
                <div style={{ fontSize: '20px', opacity: 0.8 }}>
                  {pick.showTitle}
                </div>
              </div>
            </div>
          ))}
          {shareData.picks.length > 4 && (
            <div
              style={{
                display: 'flex',
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
                opacity: 0.8,
              }}
            >
              他 {shareData.picks.length - 4}名
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '40px',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: 18, opacity: 0.8 }}>
            Created with
          </div>
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>
            Share1Pick
          </div>
          <div style={{ fontSize: 18, opacity: 0.7 }}>
            share1pick.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
