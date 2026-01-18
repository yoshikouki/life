import { getDatabase } from "@life/news/db";
import {
  deleteSubscription,
  saveSubscription,
} from "@life/news/push/subscription-store";
import { NextResponse } from "next/server";

// 入力値の制限
const MAX_ENDPOINT_LENGTH = 2000;
const MAX_KEY_LENGTH = 200;
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

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
 * 入力値を検証する
 */
function validateSubscription(body: SubscribeRequestBody): string | null {
  if (!(body.endpoint && body.keys?.p256dh && body.keys?.auth)) {
    return "Missing required fields: endpoint, keys.p256dh, keys.auth";
  }

  if (body.endpoint.length > MAX_ENDPOINT_LENGTH) {
    return "Endpoint URL is too long";
  }

  if (
    body.keys.p256dh.length > MAX_KEY_LENGTH ||
    body.keys.auth.length > MAX_KEY_LENGTH
  ) {
    return "Encryption keys are too long";
  }

  // URL形式の検証
  try {
    new URL(body.endpoint);
  } catch {
    return "Invalid endpoint URL format";
  }

  // Base64 URL形式の検証
  if (
    !(
      BASE64_URL_PATTERN.test(body.keys.p256dh) &&
      BASE64_URL_PATTERN.test(body.keys.auth)
    )
  ) {
    return "Invalid key format";
  }

  return null;
}

/**
 * POST: 購読登録
 */
export async function POST(request: Request) {
  let body: SubscribeRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const validationError = validateSubscription(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  let expiresAt: Date | null = null;
  if (body.expiresAt) {
    expiresAt = new Date(body.expiresAt);
    if (Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json(
        { error: "Invalid expiresAt date format" },
        { status: 400 }
      );
    }
  }

  try {
    const db = getDatabase();
    await saveSubscription(db, {
      endpoint: body.endpoint,
      keys: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      expiresAt,
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
  let body: UnsubscribeRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  if (!body.endpoint) {
    return NextResponse.json(
      { error: "Missing required field: endpoint" },
      { status: 400 }
    );
  }

  if (body.endpoint.length > MAX_ENDPOINT_LENGTH) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
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
