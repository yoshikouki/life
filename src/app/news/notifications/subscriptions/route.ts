import { getDatabase } from "@life/news/db";
import {
  deleteSubscription,
  saveSubscription,
} from "@life/news/push/subscription-store";
import { NextResponse } from "next/server";

interface SubscribeRequestBody {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expiresAt?: string | null;
}

interface UnsubscribeRequestBody {
  endpoint: string;
}

/**
 * POST: 購読登録
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeRequestBody;

    if (!(body.endpoint && body.keys?.p256dh && body.keys?.auth)) {
      return NextResponse.json(
        { error: "Missing required fields: endpoint, keys.p256dh, keys.auth" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    await saveSubscription(db, {
      endpoint: body.endpoint,
      keys: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    });

    return NextResponse.json(
      { message: "Subscription saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 購読解除
 */
export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as UnsubscribeRequestBody;

    if (!body.endpoint) {
      return NextResponse.json(
        { error: "Missing required field: endpoint" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    await deleteSubscription(db, body.endpoint);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
