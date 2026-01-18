import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db/client";
import { notifiedItems } from "../db/schema";
import type { NewsItem, NewsSource } from "../types";
import { extractItemsToNotify, filterNewItems } from "./diff";
import { markAsNotified } from "./notification-store";

const schema = { notifiedItems };

const testSource: NewsSource = {
  id: "test-source",
  name: "Test Source",
  url: "https://example.com/feed",
  type: "rss",
};

function createTestItem(url: string, title: string): NewsItem {
  return {
    id: `item-${url}`,
    title,
    url,
    source: testSource,
    publishedAt: new Date(),
  };
}

describe("extractItemsToNotify", () => {
  it("should return all items when notifiedUrls is empty", () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
    ];
    const notifiedUrls: string[] = [];

    const result = extractItemsToNotify(items, notifiedUrls);

    expect(result).toEqual(items);
  });

  it("should return empty array when all items are notified", () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
    ];
    const notifiedUrls = ["https://example.com/1", "https://example.com/2"];

    const result = extractItemsToNotify(items, notifiedUrls);

    expect(result).toEqual([]);
  });

  it("should filter out notified items", () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
      createTestItem("https://example.com/3", "Article 3"),
    ];
    const notifiedUrls = ["https://example.com/2"];

    const result = extractItemsToNotify(items, notifiedUrls);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.url)).toEqual([
      "https://example.com/1",
      "https://example.com/3",
    ]);
  });

  it("should return empty array when items is empty", () => {
    const items: NewsItem[] = [];
    const notifiedUrls = ["https://example.com/1"];

    const result = extractItemsToNotify(items, notifiedUrls);

    expect(result).toEqual([]);
  });
});

describe("filterNewItems", () => {
  let db: Database;

  beforeEach(async () => {
    const client = createClient({ url: ":memory:" });
    db = drizzle(client, { schema });

    // Create tables
    await client.execute(`
      CREATE TABLE news_notified_items (
        item_url TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        published_at INTEGER,
        notified_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
      )
    `);
  });

  it("should return all items when none are notified", async () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
    ];

    const result = await filterNewItems(db, items);

    expect(result).toEqual(items);
  });

  it("should filter out already notified items", async () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
      createTestItem("https://example.com/3", "Article 3"),
    ];

    // Mark some as notified
    await markAsNotified(db, [
      { itemUrl: "https://example.com/1", sourceId: "test-source" },
      { itemUrl: "https://example.com/3", sourceId: "test-source" },
    ]);

    const result = await filterNewItems(db, items);

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("https://example.com/2");
  });

  it("should return empty array when all items are notified", async () => {
    const items: NewsItem[] = [
      createTestItem("https://example.com/1", "Article 1"),
    ];

    await markAsNotified(db, [
      { itemUrl: "https://example.com/1", sourceId: "test-source" },
    ]);

    const result = await filterNewItems(db, items);

    expect(result).toEqual([]);
  });

  it("should return empty array when items is empty", async () => {
    const result = await filterNewItems(db, []);

    expect(result).toEqual([]);
  });
});
