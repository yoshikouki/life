import { getVapidPublicKey, VapidKeyError } from "@life/news/push/keys";
import { NextResponse } from "next/server";

/**
 * GET: VAPID 公開鍵を返す
 */
export function GET() {
  try {
    const publicKey = getVapidPublicKey();

    return NextResponse.json({ publicKey });
  } catch (error) {
    if (error instanceof VapidKeyError) {
      console.error("VAPID key configuration error:", error.message);
      return NextResponse.json(
        { error: "VAPID key not configured" },
        { status: 500 }
      );
    }

    console.error("Failed to get VAPID public key:", error);
    return NextResponse.json(
      { error: "Failed to get public key" },
      { status: 500 }
    );
  }
}
