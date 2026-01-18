import { getDatabase } from "@life/news/db";
import { runNotificationCron } from "@life/news/push/cron";
import { NextResponse } from "next/server";

/**
 * GET: Cron ジョブ実行
 * Authorization ヘッダーまたはクエリパラメータで secret を確認
 */
export async function GET(request: Request) {
  try {
    const cronSecret = process.env.NEWS_NOTIFICATIONS_CRON_SECRET;

    if (!cronSecret) {
      console.error("NEWS_NOTIFICATIONS_CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    // Authorization ヘッダーまたはクエリパラメータから secret を取得
    const authHeader = request.headers.get("Authorization");
    const url = new URL(request.url);
    const querySecret = url.searchParams.get("secret");

    // Bearer トークン形式をサポート
    const headerSecret = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const providedSecret = headerSecret || querySecret;

    if (!providedSecret) {
      return NextResponse.json(
        { error: "Missing authorization" },
        { status: 401 }
      );
    }

    if (providedSecret !== cronSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    const db = getDatabase();
    const result = await runNotificationCron(db);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
