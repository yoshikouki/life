# /news ページ

## 構成

- **`packages/news/`** (`@life/news`) - コアロジック（RSS フェッチ、パース、型定義）
- **`src/app/news/`** - UI 層（ページ、レイアウト、PWA manifest）

## PWA 対応

- `manifest.json/route.ts` - `/news/manifest.json` を返す Route Handler
- `layout.tsx` - manifest へのリンクを `<head>` に追加
- `start_url: "/news"` で /news 専用の PWA として動作

## 将来の拡張

- Service Worker の追加
- Push Notification による RSS 更新通知
