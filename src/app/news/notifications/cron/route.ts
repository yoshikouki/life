import { timingSafeEqual } from "node:crypto";
import { getDatabase } from "@life/news/db";
import { runNotificationCron } from "@life/news/push/cron";
import { NextResponse } from "next/server";

/**
 * タイミング攻撃を防ぐための安全な文字列比較
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufferA = Buffer.from(a, "utf8");
    const bufferB = Buffer.from(b, "utf8");

    if (bufferA.length !== bufferB.length) {
      // 長さが異なる場合も一定時間で比較を完了させる
      timingSafeEqual(bufferA, bufferA);
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

/**
 * GET: Cron ジョブ実行
 * Authorization ヘッダー (Bearer トークン) で認証
 */
export async function GET(request: Request) {
  try {
    const cronSecret = process.env.NEWS_NOTIFICATIONS_CRON_SECRET;

    if (!cronSecret) {
      console.error("NEWS_NOTIFICATIONS_CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Authorization ヘッダーのみサポート（クエリパラメータはセキュリティ上削除）
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      );
    }

    // Bearer トークン形式を強制
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid authorization format" },
        { status: 401 }
      );
    }

    const providedSecret = authHeader.slice(7);

    if (!secureCompare(providedSecret, cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = getDatabase();
    const result = await runNotificationCron(db);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    // 本番環境では詳細なエラーメッセージを隠す
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
