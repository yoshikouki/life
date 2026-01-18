import { beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db/client";
import type { NewsItem, NewsSource } from "../types";
import { type CronDeps, runNotificationCron } from "./cron";
import type { VapidKeys } from "./keys";
import type { Subscription } from "./subscription-store";

const testSource: NewsSource = {
  id: "test-source",
  name: "Test Source",
  url: "https://example.com/feed",
  type: "rss",
};

const testVapidKeys: VapidKeys = {
  publicKey: "test-public-key",
  privateKey: "test-private-key",
  subject: "mailto:test@example.com",
};

function createTestItem(url: string, title: string): NewsItem {
  return {
    id: `item-${url}`,
    title,
    url,
    source: testSource,
    publishedAt: new Date("2024-01-01"),
  };
}

function createTestSubscription(endpoint: string): Subscription {
  return {
    endpoint,
    keys: {
      p256dh: "test-p256dh",
      auth: "test-auth",
    },
  };
}

describe("runNotificationCron", () => {
  const mockDb = {} as Database;
  let calls: Record<string, unknown[][]>;
  let deps: CronDeps;

  beforeEach(() => {
    calls = {
      fetchAllNews: [],
      filterNewItems: [],
      getAllSubscriptions: [],
      markAsNotified: [],
      sendNotifications: [],
      getVapidKeys: [],
    };

    deps = {
      fetchAllNews: (...args) => {
        calls.fetchAllNews.push(args);
        return Promise.resolve([]);
      },
      filterNewItems: (...args) => {
        calls.filterNewItems.push(args);
        return Promise.resolve(args[1]); // Return items by default
      },
      getAllSubscriptions: (...args) => {
        calls.getAllSubscriptions.push(args);
        return Promise.resolve([]);
      },
      markAsNotified: (...args) => {
        calls.markAsNotified.push(args);
        return Promise.resolve();
      },
      sendNotifications: (...args) => {
        calls.sendNotifications.push(args);
        return Promise.resolve({
          successCount: 0,
          failureCount: 0,
          deletedCount: 0,
          results: [],
        });
      },
      getVapidKeys: (...args) => {
        calls.getVapidKeys.push(args);
        return testVapidKeys;
      },
    };
  });

  it("should return early when no new items found", async () => {
    const allItems = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
    ];

    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve(allItems);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve([]); // No new items
    };

    const result = await runNotificationCron(mockDb, { deps });

    expect(result).toEqual({
      totalItems: 2,
      newItems: 0,
      subscriptions: 0,
      sent: 0,
      failed: 0,
    });
    expect(calls.getAllSubscriptions.length).toBe(0);
    expect(calls.sendNotifications.length).toBe(0);
    expect(calls.markAsNotified.length).toBe(0);
  });

  it("should mark items as notified when no subscriptions exist", async () => {
    const allItems = [createTestItem("https://example.com/1", "Article 1")];
    const newItems = [createTestItem("https://example.com/1", "Article 1")];

    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve(allItems);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve(newItems);
    };
    deps.getAllSubscriptions = (...args) => {
      calls.getAllSubscriptions.push(args);
      return Promise.resolve([]);
    };

    const result = await runNotificationCron(mockDb, { deps });

    expect(result).toEqual({
      totalItems: 1,
      newItems: 1,
      subscriptions: 0,
      sent: 0,
      failed: 0,
    });
    expect(calls.markAsNotified.length).toBe(1);
    expect(calls.markAsNotified[0]).toEqual([
      mockDb,
      [
        {
          itemUrl: "https://example.com/1",
          sourceId: "test-source",
          publishedAt: new Date("2024-01-01"),
        },
      ],
    ]);
    expect(calls.sendNotifications.length).toBe(0);
  });

  it("should send notifications and mark items as notified", async () => {
    const allItems = [
      createTestItem("https://example.com/1", "Article 1"),
      createTestItem("https://example.com/2", "Article 2"),
    ];
    const newItems = [createTestItem("https://example.com/1", "Article 1")];
    const subscriptions = [
      createTestSubscription("https://push.example.com/sub1"),
      createTestSubscription("https://push.example.com/sub2"),
    ];

    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve(allItems);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve(newItems);
    };
    deps.getAllSubscriptions = (...args) => {
      calls.getAllSubscriptions.push(args);
      return Promise.resolve(subscriptions);
    };
    deps.sendNotifications = (...args) => {
      calls.sendNotifications.push(args);
      return Promise.resolve({
        successCount: 2,
        failureCount: 0,
        deletedCount: 0,
        results: [
          { success: true, endpoint: "https://push.example.com/sub1" },
          { success: true, endpoint: "https://push.example.com/sub2" },
        ],
      });
    };

    const result = await runNotificationCron(mockDb, { deps });

    expect(result).toEqual({
      totalItems: 2,
      newItems: 1,
      subscriptions: 2,
      sent: 2,
      failed: 0,
    });
    expect(calls.sendNotifications.length).toBe(1);
    expect(calls.sendNotifications[0]).toEqual([
      mockDb,
      subscriptions,
      newItems,
      testVapidKeys,
    ]);
    expect(calls.markAsNotified.length).toBe(1);
  });

  it("should handle partial failures in notification sending", async () => {
    const allItems = [createTestItem("https://example.com/1", "Article 1")];
    const newItems = [createTestItem("https://example.com/1", "Article 1")];
    const subscriptions = [
      createTestSubscription("https://push.example.com/sub1"),
      createTestSubscription("https://push.example.com/sub2"),
    ];

    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve(allItems);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve(newItems);
    };
    deps.getAllSubscriptions = (...args) => {
      calls.getAllSubscriptions.push(args);
      return Promise.resolve(subscriptions);
    };
    deps.sendNotifications = (...args) => {
      calls.sendNotifications.push(args);
      return Promise.resolve({
        successCount: 1,
        failureCount: 1,
        deletedCount: 0,
        results: [
          { success: true, endpoint: "https://push.example.com/sub1" },
          {
            success: false,
            endpoint: "https://push.example.com/sub2",
            error: "Network error",
          },
        ],
      });
    };

    const result = await runNotificationCron(mockDb, { deps });

    expect(result).toEqual({
      totalItems: 1,
      newItems: 1,
      subscriptions: 2,
      sent: 1,
      failed: 1,
    });
  });

  it("should use provided vapidKeys from options", async () => {
    const customVapidKeys: VapidKeys = {
      publicKey: "custom-public-key",
      privateKey: "custom-private-key",
      subject: "mailto:custom@example.com",
    };
    const allItems = [createTestItem("https://example.com/1", "Article 1")];
    const newItems = [createTestItem("https://example.com/1", "Article 1")];
    const subscriptions = [
      createTestSubscription("https://push.example.com/sub1"),
    ];

    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve(allItems);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve(newItems);
    };
    deps.getAllSubscriptions = (...args) => {
      calls.getAllSubscriptions.push(args);
      return Promise.resolve(subscriptions);
    };
    deps.sendNotifications = (...args) => {
      calls.sendNotifications.push(args);
      return Promise.resolve({
        successCount: 1,
        failureCount: 0,
        deletedCount: 0,
        results: [{ success: true, endpoint: "https://push.example.com/sub1" }],
      });
    };

    await runNotificationCron(mockDb, { vapidKeys: customVapidKeys, deps });

    expect(calls.getVapidKeys.length).toBe(0);
    expect(calls.sendNotifications[0][3]).toEqual(customVapidKeys);
  });

  it("should handle empty feed result", async () => {
    deps.fetchAllNews = (...args) => {
      calls.fetchAllNews.push(args);
      return Promise.resolve([]);
    };
    deps.filterNewItems = (...args) => {
      calls.filterNewItems.push(args);
      return Promise.resolve([]);
    };

    const result = await runNotificationCron(mockDb, { deps });

    expect(result).toEqual({
      totalItems: 0,
      newItems: 0,
      subscriptions: 0,
      sent: 0,
      failed: 0,
    });
    expect(calls.getAllSubscriptions.length).toBe(0);
  });
});
