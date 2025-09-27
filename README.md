# Share1Pick

サバイバルオーディション番組の1pickを選んでシェアできるウェブアプリケーション

## 🎯 機能

- **番組選択**: PRODUCE、Girls Planet、Boys Planet、I-LANDなど主要サバイバルオーディション番組に対応
- **1pick選択**: 参加者から1人を選択
- **画像生成**: 美しいシェア用画像を自動生成
- **SNSシェア**: X(Twitter)での投稿に最適化されたテキストとハッシュタグを自動生成
- **検索・フィルター**: 参加者の検索、並び替え、国籍フィルター
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## 🚀 対応番組

### 韓国版
- PRODUCE 101 (2016) → I.O.I
- PRODUCE 101 SEASON2 (2017) → Wanna One
- PRODUCE 48 (2018) → IZ*ONE
- PRODUCE X 101 (2019) → X1
- Girls Planet 999 (2021) → Kep1er
- Boys Planet (2023) → ZEROBASEONE
- I-LAND (2020) → ENHYPEN
- R U Next? (2023) → ILLIT

### 日本版
- PRODUCE 101 JAPAN (2019) → JO1
- PRODUCE 101 JAPAN SEASON2 (2021) → INI
- PRODUCE 101 JAPAN THE GIRLS (2023) → ME:I
- Nizi Project (2020) → NiziU

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **画像生成**: html2canvas
- **デプロイ**: Vercel

## 📦 インストール・開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 利用可能なコマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint
```

## 📁 プロジェクト構成

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # レイアウト
│   ├── page.tsx        # ホームページ
│   └── show/[id]/      # 番組詳細ページ
├── components/         # UIコンポーネント
│   ├── ContestantCard.tsx
│   ├── ContestantFilter.tsx
│   ├── ShareActions.tsx
│   └── ShareImagePreview.tsx
├── data/              # 番組・参加者データ
│   └── shows.ts
├── lib/               # ユーティリティ
│   └── shareUtils.ts
└── types/             # TypeScript型定義
    └── index.ts
```

## 🎨 カスタマイズ

### 新しい番組の追加

`src/data/shows.ts`に新しい番組データを追加:

```typescript
{
  id: 'new-show',
  title: '新番組',
  year: 2024,
  type: 'mixed',
  status: 'ongoing',
  debutGroup: 'NEW GROUP',
  description: '番組説明',
  contestants: [
    {
      id: 'contestant-1',
      name: '参加者名',
      image: '/images/contestants/contestant-1.jpg',
      company: '事務所名',
      rank: 1,
      nationality: 'KR'
    }
  ]
}
```

## 🚀 デプロイ

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
