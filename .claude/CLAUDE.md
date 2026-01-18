# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

yoshikouki.com - ポートフォリオサイト。Next.js 16 (App Router) + React 19 + Tailwind CSS 4 で構築。

## Commands

```bash
# Development
bun dev           # 開発サーバー起動 (Turbopack)
bun run build     # 本番ビルド
bun start         # 本番サーバー起動

# Quality
bun lint          # Biome によるチェック
bun format        # Biome による自動修正
bun test          # テスト実行

# Package Management
bun install       # 依存関係インストール
bun update:all    # 全依存関係を最新版に更新
```

## Architecture

### Monorepo Structure (Bun Workspaces)

```
life/
├── src/app/           # Next.js App Router ページ
├── src/components/    # 共有 UI コンポーネント
├── src/lib/           # ユーティリティ (utils.ts など)
└── packages/
    └── news/          # @life/news パッケージ
```

### Path Aliases

- `@/*` → `./src/*`
- `@life/news` → `./packages/news/src/index.ts`

### @life/news Package

RSSフィード取得・PWA対応を担当する内部パッケージ。

- `fetcher.ts` - RSS フェッチ・パース
- `sources.ts` - 購読フィード一覧
- `manifest.ts` - PWA manifest 定義
- `types.ts` - 型定義

UI層 (`src/app/news/`) からは `@life/news` をインポートして使用。

### Key Technologies

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | Bun |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Animation | motion (Framer Motion), next-view-transitions |
| Linter/Formatter | Biome via Ultracite |
| Pre-commit | Husky + Ultracite auto-format |

## Code Quality (Ultracite/Biome)

- **Format**: `bun format` (または `bun x ultracite fix`)
- **Check**: `bun lint` (または `bun x ultracite check`)
- Pre-commit hook で自動フォーマット適用

### Biome Rules

- インデント: スペース
- クォート: ダブルクォート
- import 自動整理
- Tailwind クラスソート (`useSortedClasses`)

## Framework Guidelines

### Next.js

- Server Components をデフォルトで使用
- 画像は `next/image` の `<Image>` を使用
- metadata は App Router の metadata API を使用

### React 19+

- `React.forwardRef` ではなく ref を props として直接受け取る
- function components のみ使用

### Styling

- kiso.css をベーススタイルとして使用
- Tailwind CSS 4 でユーティリティスタイリング
- CSS Modules は必要に応じて使用 (`.module.css`)
