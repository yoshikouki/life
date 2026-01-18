import type { Database } from "../db/client";
import type { NewsItem } from "../types";
import { getNotifiedUrls } from "./notification-store";

/**
 * 通知済みURLリストから新規アイテムを抽出する（純粋関数）
 */
export function extractItemsToNotify(
  allItems: NewsItem[],
  notifiedUrls: string[]
): NewsItem[] {
  const notifiedSet = new Set(notifiedUrls);
  return allItems.filter((item) => !notifiedSet.has(item.url));
}

/**
 * RSS フィードから未通知のアイテムのみを返す
 */
export async function filterNewItems(
  db: Database,
  items: NewsItem[]
): Promise<NewsItem[]> {
  if (items.length === 0) {
    return [];
  }

  const urls = items.map((item) => item.url);
  const notifiedUrls = await getNotifiedUrls(db, urls);

  return extractItemsToNotify(items, notifiedUrls);
}
