# /news ページ

## 設計方針

**`@life/news` パッケージがフィード取得から通知まで全てを担当する。**

## 構成

### `packages/news/` (`@life/news`)
- `fetcher.ts` - RSS フェッチ、パース
- `sources.ts` - 購読フィード一覧
- `manifest.ts` - PWA manifest 定義
- `types.ts` - 型定義

### `src/app/news/` (UI層・ルーティング)
- `page.tsx` - ニュース一覧ページ
- `layout.tsx` - manifest リンク追加
- `manifest.json/route.ts` - @life/news の manifest を返す

## 将来の拡張

`@life/news` に追加予定：
- Service Worker 設定
- Push Notification ロジック
- 更新検知・差分通知
