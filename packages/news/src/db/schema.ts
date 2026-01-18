// TODO: Define database schema for Web Push notifications
// Required tables (from plans/news-notificator.md):
//
// 1. Subscription table:
//    - endpoint: string (primary key or unique)
//    - keys: { p256dh: string, auth: string }
//    - createdAt: timestamp
//    - updatedAt: timestamp
//    - expiresAt?: timestamp (optional)
//
// 2. NotifiedItem table:
//    - itemUrl: string (primary key)
//    - sourceId: string
//    - publishedAt: timestamp
//    - notifiedAt: timestamp
