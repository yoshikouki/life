import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = sql`(unixepoch('now') * 1000)`;

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export const subscriptions = sqliteTable("news_subscriptions", {
  endpoint: text("endpoint").primaryKey(),
  keys: text("keys", { mode: "json" }).$type<PushSubscriptionKeys>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(now),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(now)
    .$onUpdate(() => now),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
});

export const notifiedItems = sqliteTable("news_notified_items", {
  itemUrl: text("item_url").primaryKey(),
  sourceId: text("source_id").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  notifiedAt: integer("notified_at", { mode: "timestamp_ms" })
    .notNull()
    .default(now),
});
