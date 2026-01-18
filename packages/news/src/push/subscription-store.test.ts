import { beforeEach, describe, expect, it } from "vitest";
import { createDatabase, type Database } from "../db/client";
import {
  deleteSubscription,
  getAllSubscriptions,
  getSubscriptionByEndpoint,
  saveSubscription,
} from "./subscription-store";

describe("subscription-store", () => {
  let db: Database;

  beforeEach(async () => {
    db = createDatabase(":memory:");

    // Create table for in-memory SQLite
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

  describe("saveSubscription", () => {
    it("should save a new subscription", async () => {
      const subscription = {
        endpoint: "https://push.example.com/abc123",
        keys: {
          p256dh: "test-p256dh-key",
          auth: "test-auth-key",
        },
      };

      await saveSubscription(db, subscription);

      const result = await getSubscriptionByEndpoint(db, subscription.endpoint);
      expect(result).not.toBeNull();
      expect(result?.endpoint).toBe(subscription.endpoint);
      expect(result?.keys).toEqual(subscription.keys);
    });

    it("should update an existing subscription", async () => {
      const endpoint = "https://push.example.com/abc123";
      const initialSubscription = {
        endpoint,
        keys: {
          p256dh: "initial-p256dh",
          auth: "initial-auth",
        },
      };

      await saveSubscription(db, initialSubscription);

      const updatedSubscription = {
        endpoint,
        keys: {
          p256dh: "updated-p256dh",
          auth: "updated-auth",
        },
      };

      await saveSubscription(db, updatedSubscription);

      const result = await getSubscriptionByEndpoint(db, endpoint);
      expect(result?.keys).toEqual(updatedSubscription.keys);

      const all = await getAllSubscriptions(db);
      expect(all).toHaveLength(1);
    });

    it("should save subscription with expiresAt", async () => {
      const expiresAt = new Date("2025-12-31T23:59:59Z");
      const subscription = {
        endpoint: "https://push.example.com/expires",
        keys: {
          p256dh: "test-p256dh",
          auth: "test-auth",
        },
        expiresAt,
      };

      await saveSubscription(db, subscription);

      const result = await getSubscriptionByEndpoint(db, subscription.endpoint);
      expect(result?.expiresAt).toEqual(expiresAt);
    });
  });

  describe("deleteSubscription", () => {
    it("should delete an existing subscription", async () => {
      const subscription = {
        endpoint: "https://push.example.com/to-delete",
        keys: {
          p256dh: "test-p256dh",
          auth: "test-auth",
        },
      };

      await saveSubscription(db, subscription);
      await deleteSubscription(db, subscription.endpoint);

      const result = await getSubscriptionByEndpoint(db, subscription.endpoint);
      expect(result).toBeNull();
    });

    it("should not throw when deleting non-existent subscription", async () => {
      // Should complete without throwing
      await deleteSubscription(db, "https://push.example.com/non-existent");
    });
  });

  describe("getAllSubscriptions", () => {
    it("should return empty array when no subscriptions exist", async () => {
      const results = await getAllSubscriptions(db);
      expect(results).toEqual([]);
    });

    it("should return all subscriptions", async () => {
      const subscriptions = [
        {
          endpoint: "https://push.example.com/1",
          keys: { p256dh: "key1", auth: "auth1" },
        },
        {
          endpoint: "https://push.example.com/2",
          keys: { p256dh: "key2", auth: "auth2" },
        },
        {
          endpoint: "https://push.example.com/3",
          keys: { p256dh: "key3", auth: "auth3" },
        },
      ];

      for (const sub of subscriptions) {
        await saveSubscription(db, sub);
      }

      const results = await getAllSubscriptions(db);
      expect(results).toHaveLength(3);
    });
  });

  describe("getSubscriptionByEndpoint", () => {
    it("should return null for non-existent endpoint", async () => {
      const result = await getSubscriptionByEndpoint(
        db,
        "https://push.example.com/non-existent"
      );
      expect(result).toBeNull();
    });

    it("should return subscription for existing endpoint", async () => {
      const subscription = {
        endpoint: "https://push.example.com/existing",
        keys: { p256dh: "test-p256dh", auth: "test-auth" },
      };

      await saveSubscription(db, subscription);

      const result = await getSubscriptionByEndpoint(db, subscription.endpoint);
      expect(result).not.toBeNull();
      expect(result?.endpoint).toBe(subscription.endpoint);
      expect(result?.keys).toEqual(subscription.keys);
    });
  });
});
