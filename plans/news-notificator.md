# News RSS 更新の Web Push 通知 実装計画

## 目的

- `packages/news/src/sources.ts` の RSS が更新されたら Web Push Notification で通知する
- `/news` の将来拡張方針（`src/app/news/CLAUDE.md`）に沿って、**`@life/news` パッケージが取得〜通知まで担当**する

## 非対象（今回やらないこと）

- 既読管理 UI の高度化（タグ/フィルタ/まとめ通知など）
- メール通知や外部チャンネル配信
- フィード追加 UI（`sources.ts` の直接編集は継続）

## 成果物（アウトプット）

- Web Push の購読/解除ができる UI（/news）
- Service Worker による通知表示とクリック遷移
- RSS 更新検知と差分通知（重複通知なし）
- 購読情報と既通知アイテムの永続化

## 主要な設計ポイント

- **通知の単位**: 1 記事 = 1 通知（将来まとめ通知に拡張可能な構造）
- **重複防止**: `item.url` を主キーにし、送信済みログを保持
- **スケジューリング**: Cron で定期実行（デプロイ環境の Cron に合わせる）
- **保存先**: サーバー環境に合わせて選定（下記の決定ポイント参照）

## 決定ポイント（最初に確定させる）

1. **永続ストア**
   - 候補: SQLite（ローカル/単一ホスト）, Vercel KV, Upstash Redis
   - 期待条件: 書き込み頻度は低め・読み書きは単純・サーバレスでも永続化可能
2. **Cron 実行基盤**
   - 候補: Vercel Cron / GitHub Actions / ローカル cron
3. **Web Push ライブラリ**
   - 候補: `web-push`（標準的な VAPID 実装）

## 追加するモジュール（案）

### `packages/news/`

- `push/keys.ts`: VAPID key の取得/検証
- `push/subscription-store.ts`: 購読情報の CRUD
- `push/notification-store.ts`: 送信済みアイテムの記録
- `push/sender.ts`: Web Push 送信処理
- `push/diff.ts`: 新規アイテム抽出（差分検知）
- `push/cron.ts`: RSS 更新取得 → 差分抽出 → 送信

### `src/app/news/`

- `push/subscribe/route.ts`: 購読登録 API
- `push/unsubscribe/route.ts`: 購読解除 API
- `push/cron/route.ts`: Cron エンドポイント
- `sw.js/route.ts` or `public/news/sw.js`: Service Worker
- `/news` UI で購読状態の表示・操作

## 実装ステップ

1. **基盤整備**
   - VAPID key 生成スクリプト/手順を用意
   - `.env` 追加（公開鍵/秘密鍵/通知アイコン URL など）
2. **永続ストアの実装**
   - `Subscription` テーブル/コレクション: `endpoint`, `keys`, `createdAt`, `updatedAt`, `expiresAt?`
   - `NotifiedItem` テーブル/コレクション: `itemUrl`, `sourceId`, `publishedAt`, `notifiedAt`
3. **差分検知**
   - `fetchAllNews` の結果から新規アイテムのみ抽出
   - 送信済みログにないものだけ通知対象にする
4. **Push 送信ロジック**
   - `web-push` で一括送信
   - 410/404 は購読削除
   - 1 通知に `title`, `body`, `url`, `source`, `publishedAt` を含める
5. **Service Worker 実装**
   - `push` イベントで通知表示
   - `notificationclick` で `/news` or 記事 URL へ遷移
   - `icon`, `badge`, `image` を適用
6. **購読 UI**
   - 権限確認（`Notification.permission`）
   - 登録/解除ボタン
   - 登録済み時の状態表示
7. **Cron 連携**
   - `GET /news/push/cron` で実行（秘密トークン保護）
   - 失敗時はログ/メトリクスに残す
8. **テスト/検証**
   - 差分検知ユーティリティの単体テスト
   - Service Worker の動作確認（ローカル HTTPS or `localhost`）

## 受け入れ基準（DoD）

- 新しい記事が出たら、購読済みブラウザに通知が届く
- 同一記事は二重通知されない
- 購読解除後は通知が届かない
- 410/404 の購読は自動で削除される
- `/news` から購読/解除ができる

## リスク/注意点

- Safari の Web Push 対応条件（iOS は PWA インストール必須）
- サーバレス環境での永続化選定ミス
- RSS 側の `pubDate` 不整合に備え、`id/url` を主キーにする

## 参考タスク（あとで必要になりそう）

- 通知頻度の制御（まとめ通知・時間帯制限）
- フィード追加 UI
- 通知テンプレートのカスタマイズ
