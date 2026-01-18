/**
 * VAPID キーの取得・検証ロジック
 */

// Base64 URL 文字セットの正規表現
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
  subject: string;
}

export class VapidKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VapidKeyError";
  }
}

/**
 * 環境変数から VAPID キーを取得
 */
export function getVapidKeys(): VapidKeys {
  const publicKey = process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY;
  const privateKey = process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY;
  const subject = process.env.NEWS_NOTIFICATIONS_SUBJECT;

  if (!publicKey) {
    throw new VapidKeyError(
      "NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY is not set in environment variables"
    );
  }

  if (!privateKey) {
    throw new VapidKeyError(
      "NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY is not set in environment variables"
    );
  }

  if (!subject) {
    throw new VapidKeyError(
      "NEWS_NOTIFICATIONS_SUBJECT is not set in environment variables"
    );
  }

  return { publicKey, privateKey, subject };
}

/**
 * クライアント配布用に公開鍵のみを取得
 */
export function getVapidPublicKey(): string {
  const publicKey = process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    throw new VapidKeyError(
      "NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY is not set in environment variables"
    );
  }

  return publicKey;
}

/**
 * VAPID キーの形式を検証
 * - 公開鍵: Base64 URL エンコードされた 65 バイト (P-256 曲線の非圧縮点)
 * - 秘密鍵: Base64 URL エンコードされた 32 バイト
 * - subject: mailto: または https:// で始まる URL
 */
export function validateVapidKeys(keys: VapidKeys): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 公開鍵の検証 (87文字: 65バイト -> Base64で約87文字)
  if (!keys.publicKey) {
    errors.push("Public key is empty");
  } else if (!BASE64_URL_PATTERN.test(keys.publicKey)) {
    errors.push("Public key contains invalid characters");
  } else if (keys.publicKey.length < 80 || keys.publicKey.length > 90) {
    errors.push(
      `Public key length is invalid (expected ~87 characters, got ${keys.publicKey.length})`
    );
  }

  // 秘密鍵の検証 (43文字: 32バイト -> Base64で約43文字)
  if (!keys.privateKey) {
    errors.push("Private key is empty");
  } else if (!BASE64_URL_PATTERN.test(keys.privateKey)) {
    errors.push("Private key contains invalid characters");
  } else if (keys.privateKey.length < 40 || keys.privateKey.length > 50) {
    errors.push(
      `Private key length is invalid (expected ~43 characters, got ${keys.privateKey.length})`
    );
  }

  // subject の検証
  if (!keys.subject) {
    errors.push("Subject is empty");
  } else if (
    !(keys.subject.startsWith("mailto:") || keys.subject.startsWith("https://"))
  ) {
    errors.push("Subject must start with mailto: or https://");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
