import { eq, inArray, lt } from "drizzle-orm";
import type { Database } from "../db/client";
import { notifiedItems } from "../db/schema";
import { DatabaseError } from "../errors";

export interface NotificationItem {
  itemUrl: string;
  sourceId: string;
  publishedAt?: Date;
}

/**
 * 通知済みとして記録する
 */
export async function markAsNotified(
  db: Database,
  items: NotificationItem[]
): Promise<void> {
  if (items.length === 0) {
    return;
  }

  try {
    await db
      .insert(notifiedItems)
      .values(
        items.map((item) => ({
          itemUrl: item.itemUrl,
          sourceId: item.sourceId,
          publishedAt: item.publishedAt,
        }))
      )
      .onConflictDoNothing();
  } catch (error) {
    throw new DatabaseError("Failed to mark items as notified", error);
  }
}

/**
 * 通知済みか確認する
 */
export async function isAlreadyNotified(
  db: Database,
  itemUrl: string
): Promise<boolean> {
  try {
    const result = await db
      .select({ itemUrl: notifiedItems.itemUrl })
      .from(notifiedItems)
      .where(eq(notifiedItems.itemUrl, itemUrl))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    throw new DatabaseError("Failed to check notification status", error);
  }
}

/**
 * 指定URLのうち通知済みのものを返す
 */
export async function getNotifiedUrls(
  db: Database,
  urls: string[]
): Promise<string[]> {
  if (urls.length === 0) {
    return [];
  }

  try {
    const result = await db
      .select({ itemUrl: notifiedItems.itemUrl })
      .from(notifiedItems)
      .where(inArray(notifiedItems.itemUrl, urls));

    return result.map((r) => r.itemUrl);
  } catch (error) {
    throw new DatabaseError("Failed to fetch notified URLs", error);
  }
}

/**
 * 古い通知記録を削除する
 */
export async function cleanupOldNotifications(
  db: Database,
  olderThan: Date
): Promise<number> {
  try {
    const result = await db
      .delete(notifiedItems)
      .where(lt(notifiedItems.notifiedAt, olderThan))
      .returning({ itemUrl: notifiedItems.itemUrl });

    return result.length;
  } catch (error) {
    throw new DatabaseError("Failed to cleanup old notifications", error);
  }
}
