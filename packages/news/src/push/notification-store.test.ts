import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import { createDatabase, type Database } from "../db/client";
import { notifiedItems } from "../db/schema";
import {
  cleanupOldNotifications,
  getNotifiedUrls,
  isAlreadyNotified,
  markAsNotified,
} from "./notification-store";

describe("notification-store", () => {
  let db: Database;

  beforeEach(async () => {
    db = createDatabase(":memory:");
    // Create table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS news_notified_items (
        item_url TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        published_at INTEGER,
        notified_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
      )
    `);
  });

  afterEach(async () => {
    await db.run(sql`DROP TABLE IF EXISTS news_notified_items`);
  });

  describe("markAsNotified", () => {
    it("should record items as notified", async () => {
      const items = [
        { itemUrl: "https://example.com/1", sourceId: "source-1" },
        {
          itemUrl: "https://example.com/2",
          sourceId: "source-1",
          publishedAt: new Date("2024-01-01"),
        },
      ];

      await markAsNotified(db, items);

      const result = await db.select().from(notifiedItems);
      expect(result).toHaveLength(2);
      expect(result[0].itemUrl).toBe("https://example.com/1");
      expect(result[1].itemUrl).toBe("https://example.com/2");
    });

    it("should handle empty items array", async () => {
      await markAsNotified(db, []);
      const result = await db.select().from(notifiedItems);
      expect(result).toHaveLength(0);
    });

    it("should ignore duplicate items", async () => {
      const item = { itemUrl: "https://example.com/1", sourceId: "source-1" };

      await markAsNotified(db, [item]);
      await markAsNotified(db, [item]);

      const result = await db.select().from(notifiedItems);
      expect(result).toHaveLength(1);
    });
  });

  describe("isAlreadyNotified", () => {
    it("should return true for notified items", async () => {
      await markAsNotified(db, [
        { itemUrl: "https://example.com/1", sourceId: "source-1" },
      ]);

      const result = await isAlreadyNotified(db, "https://example.com/1");
      expect(result).toBe(true);
    });

    it("should return false for non-notified items", async () => {
      const result = await isAlreadyNotified(db, "https://example.com/unknown");
      expect(result).toBe(false);
    });
  });

  describe("getNotifiedUrls", () => {
    it("should return notified URLs from the list", async () => {
      await markAsNotified(db, [
        { itemUrl: "https://example.com/1", sourceId: "source-1" },
        { itemUrl: "https://example.com/2", sourceId: "source-1" },
      ]);

      const result = await getNotifiedUrls(db, [
        "https://example.com/1",
        "https://example.com/3",
      ]);

      expect(result).toEqual(["https://example.com/1"]);
    });

    it("should return empty array when no matches", async () => {
      const result = await getNotifiedUrls(db, ["https://example.com/unknown"]);
      expect(result).toEqual([]);
    });

    it("should handle empty input array", async () => {
      const result = await getNotifiedUrls(db, []);
      expect(result).toEqual([]);
    });
  });

  describe("cleanupOldNotifications", () => {
    it("should delete notifications older than the specified date", async () => {
      // Insert with explicit notifiedAt
      const oldDate = new Date("2024-01-01");
      const newDate = new Date("2024-06-01");

      await db.insert(notifiedItems).values([
        {
          itemUrl: "https://example.com/old",
          sourceId: "source-1",
          notifiedAt: oldDate,
        },
        {
          itemUrl: "https://example.com/new",
          sourceId: "source-1",
          notifiedAt: newDate,
        },
      ]);

      const deleted = await cleanupOldNotifications(db, new Date("2024-03-01"));

      expect(deleted).toBe(1);

      const remaining = await db.select().from(notifiedItems);
      expect(remaining).toHaveLength(1);
      expect(remaining[0].itemUrl).toBe("https://example.com/new");
    });

    it("should return 0 when no old notifications exist", async () => {
      await markAsNotified(db, [
        { itemUrl: "https://example.com/1", sourceId: "source-1" },
      ]);

      const deleted = await cleanupOldNotifications(db, new Date("2020-01-01"));
      expect(deleted).toBe(0);
    });
  });
});
