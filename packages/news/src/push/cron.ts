/**
 * Cron ジョブで呼び出される通知メイン処理
 */
import type { Database } from "../db/client";
import { fetchAllNews as defaultFetchAllNews } from "../fetcher";
import { feedSources } from "../sources";
import type { NewsItem, NewsSource } from "../types";
import { filterNewItems as defaultFilterNewItems } from "./diff";
import { getVapidKeys as defaultGetVapidKeys, type VapidKeys } from "./keys";
import {
  markAsNotified as defaultMarkAsNotified,
  type NotificationItem,
} from "./notification-store";
import {
  sendNotifications as defaultSendNotifications,
  type SendNotificationsResult,
} from "./sender";
import {
  getAllSubscriptions as defaultGetAllSubscriptions,
  type Subscription,
} from "./subscription-store";

export interface CronResult {
  totalItems: number;
  newItems: number;
  subscriptions: number;
  sent: number;
  failed: number;
}

export interface CronDeps {
  fetchAllNews?: (sources: NewsSource[]) => Promise<NewsItem[]>;
  filterNewItems?: (db: Database, items: NewsItem[]) => Promise<NewsItem[]>;
  getAllSubscriptions?: (db: Database) => Promise<Subscription[]>;
  markAsNotified?: typeof defaultMarkAsNotified;
  sendNotifications?: typeof defaultSendNotifications;
  getVapidKeys?: typeof defaultGetVapidKeys;
}

export interface CronOptions {
  vapidKeys?: VapidKeys;
  deps?: CronDeps;
}

/**
 * NewsItem を NotificationItem に変換
 */
function toNotificationItems(items: NewsItem[]): NotificationItem[] {
  return items.map((item) => ({
    itemUrl: item.url,
    sourceId: item.source.id,
    publishedAt: item.publishedAt,
  }));
}

/**
 * 通知 Cron ジョブのメイン処理
 */
export async function runNotificationCron(
  db: Database,
  options: CronOptions = {}
): Promise<CronResult> {
  const {
    fetchAllNews = defaultFetchAllNews,
    filterNewItems = defaultFilterNewItems,
    getAllSubscriptions = defaultGetAllSubscriptions,
    markAsNotified = defaultMarkAsNotified,
    sendNotifications = defaultSendNotifications,
    getVapidKeys = defaultGetVapidKeys,
  } = options.deps ?? {};

  // 1. 全記事を取得
  const allItems = await fetchAllNews(feedSources);

  // 2. 未通知アイテムを抽出
  const newItems = await filterNewItems(db, allItems);

  // 3. 購読者がいない、または新規アイテムがない場合は早期リターン
  if (newItems.length === 0) {
    return {
      totalItems: allItems.length,
      newItems: 0,
      subscriptions: 0,
      sent: 0,
      failed: 0,
    };
  }

  // 4. 全購読を取得
  const subscriptions = await getAllSubscriptions(db);

  if (subscriptions.length === 0) {
    // 購読者がいなくても通知済みとして記録
    await markAsNotified(db, toNotificationItems(newItems));
    return {
      totalItems: allItems.length,
      newItems: newItems.length,
      subscriptions: 0,
      sent: 0,
      failed: 0,
    };
  }

  // 5. VAPID キーを取得
  const vapidKeys = options.vapidKeys ?? getVapidKeys();

  // 6. 通知を送信
  const sendResult: SendNotificationsResult = await sendNotifications(
    db,
    subscriptions,
    newItems,
    vapidKeys
  );

  // 7. 送信済みとして記録
  await markAsNotified(db, toNotificationItems(newItems));

  return {
    totalItems: allItems.length,
    newItems: newItems.length,
    subscriptions: subscriptions.length,
    sent: sendResult.successCount,
    failed: sendResult.failureCount,
  };
}
