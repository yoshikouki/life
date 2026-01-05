# yoshikouki.com

ポートフォリオサイト

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| UI | React 19, Tailwind CSS 4 |
| Animation | Framer Motion |
| Language | TypeScript |
| Linter/Formatter | Biome, ESLint |

## Infrastructure

```
GitHub (main branch)
      │
      ├──▶ GitHub Actions (CI)
      │    - Lint & Format check
      │    - Test
      │    - Build
      │
      └──▶ Vercel (CD)
           - 自動デプロイ
           - yoshikouki.com
```

## Getting Started

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev

# ビルド
bun run build
```

## Directory Structure

```
src/
├── app/           # ページ (App Router)
├── components/    # 再利用可能コンポーネント
└── lib/           # ユーティリティ関数
```
