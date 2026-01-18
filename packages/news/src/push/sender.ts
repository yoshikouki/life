/**
 * Push 通知送信ロジック
 */
import webPush, { type PushSubscription, type WebPushError } from "web-push";
import type { Database } from "../db/client";
import type { NewsItem } from "../types";
import type { VapidKeys } from "./keys";
import { deleteSubscription, type Subscription } from "./subscription-store";

export interface NotificationPayload {
  title: string;
  body: string;
  url: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export interface SendResult {
  success: boolean;
  endpoint: string;
  statusCode?: number;
  error?: string;
}

export interface SendNotificationsResult {
  successCount: number;
  failureCount: number;
  deletedCount: number;
  results: SendResult[];
}

/**
 * NewsItem から通知ペイロードを生成
 */
export function buildNotificationPayload(item: NewsItem): NotificationPayload {
  return {
    title: item.source.name,
    body: item.title,
    url: item.url,
    tag: item.id,
  };
}

/**
 * 単一の購読に通知を送信
 */
export async function sendNotification(
  subscription: Subscription,
  payload: NotificationPayload,
  vapidKeys: VapidKeys
): Promise<SendResult> {
  const pushSubscription: PushSubscription = {
    endpoint: subscription.endpoint,
    keys: subscription.keys,
  };

  webPush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  try {
    const result = await webPush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
    return {
      success: true,
      endpoint: subscription.endpoint,
      statusCode: result.statusCode,
    };
  } catch (err) {
    const error = err as WebPushError;
    return {
      success: false,
      endpoint: subscription.endpoint,
      statusCode: error.statusCode,
      error: error.message,
    };
  }
}

/**
 * 購読が無効かどうかを判定 (410 Gone または 404 Not Found)
 */
function isSubscriptionGone(statusCode?: number): boolean {
  return statusCode === 410 || statusCode === 404;
}

/**
 * 複数の購読に一括で通知を送信
 * 注意: 引数の subscriptions 配列は変更されません
 */
export async function sendNotifications(
  db: Database,
  subscriptions: Subscription[],
  items: NewsItem[],
  vapidKeys: VapidKeys
): Promise<SendNotificationsResult> {
  const results: SendResult[] = [];
  let successCount = 0;
  let failureCount = 0;
  let deletedCount = 0;

  // 削除済み購読を追跡（配列を変更しない）
  const deletedEndpoints = new Set<string>();

  for (const item of items) {
    const payload = buildNotificationPayload(item);

    // 削除済みの購読を除外して送信
    const activeSubscriptions = subscriptions.filter(
      (sub) => !deletedEndpoints.has(sub.endpoint)
    );

    const sendResults = await Promise.all(
      activeSubscriptions.map((sub) =>
        sendNotification(sub, payload, vapidKeys)
      )
    );

    for (const result of sendResults) {
      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        failureCount++;

        // 410/404 の場合は購読を削除
        if (isSubscriptionGone(result.statusCode)) {
          await deleteSubscription(db, result.endpoint);
          deletedCount++;
          deletedEndpoints.add(result.endpoint);
        }
      }
    }
  }

  return {
    successCount,
    failureCount,
    deletedCount,
    results,
  };
}
