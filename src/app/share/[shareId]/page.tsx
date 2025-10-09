import { decodeShareData } from '@/lib/shareUtils';
import type { Metadata } from 'next';
import SharePageClient from './SharePageClient';

interface PageProps {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const shareData = decodeShareData(resolvedParams.shareId);

  if (!shareData || shareData.picks.length === 0) {
    return {
      title: '無効な共有リンク | Share1Pick',
      description: 'このリンクは無効か、期限切れの可能性があります。',
    };
  }

  const title = `オールスター1pickコレクション - ${shareData.picks.length}つの番組から選んだ推しメン`;
  const description = shareData.picks.map(p => `${p.showTitle}: ${p.contestantName}`).join(', ');
  const ogImageUrl = `/share/${resolvedParams.shareId}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'オールスター1pickコレクション',
        },
      ],
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const resolvedParams = await params;

  return <SharePageClient shareId={resolvedParams.shareId} />;
}
