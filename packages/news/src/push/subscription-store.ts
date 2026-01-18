import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type PushSubscriptionKeys, subscriptions } from "../db/schema";
import { SubscriptionError } from "../errors";

export interface Subscription {
  endpoint: string;
  keys: PushSubscriptionKeys;
  expiresAt?: Date | null;
}

export async function saveSubscription(
  db: Database,
  subscription: Subscription
): Promise<void> {
  try {
    await db
      .insert(subscriptions)
      .values({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expiresAt: subscription.expiresAt,
      })
      .onConflictDoUpdate({
        target: subscriptions.endpoint,
        set: {
          keys: subscription.keys,
          expiresAt: subscription.expiresAt,
        },
      });
  } catch (error) {
    throw new SubscriptionError(
      "Failed to save subscription",
      subscription.endpoint,
      error
    );
  }
}

export async function deleteSubscription(
  db: Database,
  endpoint: string
): Promise<void> {
  try {
    await db.delete(subscriptions).where(eq(subscriptions.endpoint, endpoint));
  } catch (error) {
    throw new SubscriptionError(
      "Failed to delete subscription",
      endpoint,
      error
    );
  }
}

export async function getAllSubscriptions(db: Database) {
  try {
    return await db.select().from(subscriptions);
  } catch (error) {
    throw new SubscriptionError(
      "Failed to fetch subscriptions",
      undefined,
      error
    );
  }
}

export async function getSubscriptionByEndpoint(
  db: Database,
  endpoint: string
) {
  try {
    const results = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.endpoint, endpoint));
    return results[0] ?? null;
  } catch (error) {
    throw new SubscriptionError(
      "Failed to fetch subscription",
      endpoint,
      error
    );
  }
}
