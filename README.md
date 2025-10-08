# Share1Pick

サバイバルオーディション番組の1pickを選んでシェアできるウェブアプリケーション

## 🎯 機能

- **番組選択**: PRODUCE、Girls Planet、Boys Planet、I-LANDなど主要サバイバルオーディション番組に対応
- **1pick選択**: 参加者から1人を選択
- **マルチピック**: 複数番組から1pickを選んでコレクション作成
- **画像生成**: 美しいシェア用画像を自動生成（1〜10+枚の柔軟なレイアウト）
- **SNSシェア**: X(Twitter)での投稿に最適化されたテキストとハッシュタグを自動生成
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

- **フレームワーク**: Next.js 15.5.4 (App Router)
- **言語**: TypeScript 5
- **React**: 19.1.0
- **スタイリング**: Tailwind CSS 4
- **アニメーション**: Framer Motion 12.23.22
- **画像生成**: html2canvas 1.4.1
- **デプロイ**: Vercel (Tokyo region)

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
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ (番組一覧)
│   ├── show/[id]/         # 番組詳細ページ
│   └── my-picks/          # マルチピックコレクション
├── components/            # UIコンポーネント
│   ├── ContestantCard.tsx
│   ├── MultiPickShareImage.tsx
│   └── ShareImagePreview.tsx
├── data/                  # 番組・参加者データ
│   └── shows.ts
├── hooks/                 # カスタムフック
│   └── useSelections.ts
├── lib/                   # ユーティリティ
│   └── shareUtils.ts
└── types/                 # TypeScript型定義
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
  officialWebsite: 'https://official-site.com/',
  contestants: [
    {
      id: 'contestant-1',
      displayName: '参加者名',
      furigana: 'Sankasha Mei', // オプショナル: 読み仮名
      image: '/images/contestants/contestant-1.jpg'
    }
  ]
}
```

また、`src/lib/shareUtils.ts`のハッシュタグマッピングも更新してください。

## 🚀 デプロイ

```bash
# Vercelへデプロイ
vercel --prod
```

**Production URL**: https://share1pick.vercel.app

アプリは東京リージョン（hnd1）にデプロイされています。

