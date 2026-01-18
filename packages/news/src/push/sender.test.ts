import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { createDatabase, type Database } from "../db/client";
import type { NewsItem, NewsSource } from "../types";
import type { VapidKeys } from "./keys";
import {
  buildNotificationPayload,
  sendNotification,
  sendNotifications,
} from "./sender";
import { getAllSubscriptions, saveSubscription } from "./subscription-store";

// web-push をモック
vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
  },
}));

// モック後にインポート
import webPush from "web-push";

const mockVapidKeys: VapidKeys = {
  publicKey:
    "BNJxPjF7S3LZzj0Y8CzFCPBpg3j7KJHlBGNvQBnVJjJvJWZhJjQhJvJWZhJjQhJvJWZhJjQhJvJWZhJjQhJvJWY",
  privateKey: "1234567890abcdef1234567890abcdef12345678901",
  subject: "mailto:test@example.com",
};

const mockSource: NewsSource = {
  id: "test-source",
  name: "Test News",
  url: "https://example.com/feed",
  type: "rss",
};

const mockNewsItem: NewsItem = {
  id: "item-1",
  title: "Test News Title",
  url: "https://example.com/news/1",
  source: mockSource,
  publishedAt: new Date("2025-01-18T00:00:00Z"),
  description: "Test description",
};

const mockSubscription = {
  endpoint: "https://push.example.com/abc123",
  keys: {
    p256dh: "test-p256dh-key",
    auth: "test-auth-key",
  },
};

describe("sender", () => {
  const mockSendNotification = webPush.sendNotification as Mock;
  const mockSetVapidDetails = webPush.setVapidDetails as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("buildNotificationPayload", () => {
    it("NewsItem から通知ペイロードを生成する", () => {
      const payload = buildNotificationPayload(mockNewsItem);

      expect(payload).toEqual({
        title: "Test News",
        body: "Test News Title",
        url: "https://example.com/news/1",
        tag: "item-1",
      });
    });

    it("ソース名をタイトルとして使用する", () => {
      const item: NewsItem = {
        ...mockNewsItem,
        source: { ...mockSource, name: "Different Source" },
      };

      const payload = buildNotificationPayload(item);

      expect(payload.title).toBe("Different Source");
    });
  });

  describe("sendNotification", () => {
    it("成功時に success: true を返す", async () => {
      mockSendNotification.mockResolvedValue({
        statusCode: 201,
        headers: {},
        body: "",
      });

      const payload = buildNotificationPayload(mockNewsItem);
      const result = await sendNotification(
        mockSubscription,
        payload,
        mockVapidKeys
      );

      expect(result.success).toBe(true);
      expect(result.endpoint).toBe(mockSubscription.endpoint);
      expect(result.statusCode).toBe(201);
      expect(mockSetVapidDetails).toHaveBeenCalledWith(
        mockVapidKeys.subject,
        mockVapidKeys.publicKey,
        mockVapidKeys.privateKey
      );
    });

    it("失敗時に success: false とエラー情報を返す", async () => {
      const error = new Error("Push service unavailable") as Error & {
        statusCode: number;
      };
      error.statusCode = 503;
      mockSendNotification.mockRejectedValue(error);

      const payload = buildNotificationPayload(mockNewsItem);
      const result = await sendNotification(
        mockSubscription,
        payload,
        mockVapidKeys
      );

      expect(result.success).toBe(false);
      expect(result.endpoint).toBe(mockSubscription.endpoint);
      expect(result.statusCode).toBe(503);
      expect(result.error).toBe("Push service unavailable");
    });
  });

  describe("sendNotifications", () => {
    let db: Database;

    beforeEach(async () => {
      db = createDatabase(":memory:");

      await db.run(/* sql */ `
        CREATE TABLE IF NOT EXISTS news_subscriptions (
          endpoint TEXT PRIMARY KEY,
          keys TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
          expires_at INTEGER
        )
      `);
    });

    it("複数の購読に通知を送信し結果を集計する", async () => {
      const subscriptions = [
        mockSubscription,
        {
          endpoint: "https://push.example.com/def456",
          keys: { p256dh: "key2", auth: "auth2" },
        },
      ];

      mockSendNotification.mockResolvedValue({
        statusCode: 201,
        headers: {},
        body: "",
      });

      const result = await sendNotifications(
        db,
        subscriptions,
        [mockNewsItem],
        mockVapidKeys
      );

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
      expect(result.deletedCount).toBe(0);
      expect(result.results).toHaveLength(2);
    });

    it("410 レスポンス時に購読を削除する", async () => {
      await saveSubscription(db, mockSubscription);

      const error = new Error("Subscription gone") as Error & {
        statusCode: number;
      };
      error.statusCode = 410;
      mockSendNotification.mockRejectedValue(error);

      const result = await sendNotifications(
        db,
        [mockSubscription],
        [mockNewsItem],
        mockVapidKeys
      );

      expect(result.failureCount).toBe(1);
      expect(result.deletedCount).toBe(1);

      const remaining = await getAllSubscriptions(db);
      expect(remaining).toHaveLength(0);
    });

    it("404 レスポンス時に購読を削除する", async () => {
      await saveSubscription(db, mockSubscription);

      const error = new Error("Not found") as Error & { statusCode: number };
      error.statusCode = 404;
      mockSendNotification.mockRejectedValue(error);

      const result = await sendNotifications(
        db,
        [mockSubscription],
        [mockNewsItem],
        mockVapidKeys
      );

      expect(result.failureCount).toBe(1);
      expect(result.deletedCount).toBe(1);

      const remaining = await getAllSubscriptions(db);
      expect(remaining).toHaveLength(0);
    });

    it("503 レスポンス時は購読を削除しない", async () => {
      await saveSubscription(db, mockSubscription);

      const error = new Error("Service unavailable") as Error & {
        statusCode: number;
      };
      error.statusCode = 503;
      mockSendNotification.mockRejectedValue(error);

      const result = await sendNotifications(
        db,
        [mockSubscription],
        [mockNewsItem],
        mockVapidKeys
      );

      expect(result.failureCount).toBe(1);
      expect(result.deletedCount).toBe(0);

      const remaining = await getAllSubscriptions(db);
      expect(remaining).toHaveLength(1);
    });

    it("複数のニュースアイテムを処理する", async () => {
      const items: NewsItem[] = [
        mockNewsItem,
        { ...mockNewsItem, id: "item-2", title: "Second News" },
      ];

      mockSendNotification.mockResolvedValue({
        statusCode: 201,
        headers: {},
        body: "",
      });

      const result = await sendNotifications(
        db,
        [mockSubscription],
        items,
        mockVapidKeys
      );

      expect(result.successCount).toBe(2);
      expect(result.results).toHaveLength(2);
    });

    it("空の購読リストでは何も送信しない", async () => {
      const result = await sendNotifications(
        db,
        [],
        [mockNewsItem],
        mockVapidKeys
      );

      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
      expect(mockSendNotification).not.toHaveBeenCalled();
    });

    it("空のニュースリストでは何も送信しない", async () => {
      const result = await sendNotifications(
        db,
        [mockSubscription],
        [],
        mockVapidKeys
      );

      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
      expect(mockSendNotification).not.toHaveBeenCalled();
    });
  });
});
