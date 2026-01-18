# @life/news

News feed aggregation and (planned) web push notifications for the /news page.

## Environment variables

Required for the notification pipeline:

- `TURSO_DATABASE_URL`: libSQL connection URL
- `TURSO_AUTH_TOKEN`: Turso auth token
- `NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY`: VAPID public key (served via API)
- `NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY`: VAPID private key (signing only)
- `NEWS_NOTIFICATIONS_SUBJECT`: VAPID subject (mailto or URL)
- `NEWS_NOTIFICATIONS_CRON_SECRET`: shared secret for the cron endpoint

Optional:

- `NEWS_NOTIFICATIONS_ICON_URL`: notification icon URL
- `NEWS_NOTIFICATIONS_BADGE_URL`: notification badge URL

Example `.env.local`:

```
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"
NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY="your-vapid-public-key"
NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY="your-vapid-private-key"
NEWS_NOTIFICATIONS_SUBJECT="mailto:you@example.com"
NEWS_NOTIFICATIONS_CRON_SECRET="change-me"
NEWS_NOTIFICATIONS_ICON_URL="https://example.com/news/icon.png"
NEWS_NOTIFICATIONS_BADGE_URL="https://example.com/news/badge.png"
```

## Build

This package is consumed by the Next.js app at the repo root.

1. Install dependencies:

```
bun install
```

2. Build the app:

```
bun run build
```

3. Optional checks:

```
bun run lint
bun run format
```
