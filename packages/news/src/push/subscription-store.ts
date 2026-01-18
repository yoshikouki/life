import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type PushSubscriptionKeys, subscriptions } from "../db/schema";

export interface Subscription {
  endpoint: string;
  keys: PushSubscriptionKeys;
  expiresAt?: Date | null;
}

export async function saveSubscription(
  db: Database,
  subscription: Subscription
): Promise<void> {
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
}

export async function deleteSubscription(
  db: Database,
  endpoint: string
): Promise<void> {
  await db.delete(subscriptions).where(eq(subscriptions.endpoint, endpoint));
}

export function getAllSubscriptions(db: Database) {
  return db.select().from(subscriptions);
}

export async function getSubscriptionByEndpoint(
  db: Database,
  endpoint: string
) {
  const results = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.endpoint, endpoint));
  return results[0] ?? null;
}
