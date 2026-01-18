import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getVapidKeys,
  getVapidPublicKey,
  VapidKeyError,
  validateVapidKeys,
} from "./keys";

// 有効な VAPID キーのサンプル (テスト用)
const VALID_PUBLIC_KEY =
  "BNJxPjF7S3LZzj0Y8CzFCPBpg3j7KJHlBGNvQBnVJjJvJWZhJjQhJvJWZhJjQhJvJWZhJjQhJvJWZhJjQhJvJWY";
const VALID_PRIVATE_KEY = "1234567890abcdef1234567890abcdef12345678901";
const VALID_SUBJECT = "mailto:test@example.com";

describe("keys", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // 環境変数をクリア
    delete process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY;
    delete process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY;
    delete process.env.NEWS_NOTIFICATIONS_SUBJECT;
  });

  afterEach(() => {
    // 環境変数を復元
    process.env = { ...originalEnv };
  });

  describe("getVapidKeys", () => {
    it("すべての環境変数が設定されている場合、キーを返す", () => {
      process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY = VALID_PUBLIC_KEY;
      process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY = VALID_PRIVATE_KEY;
      process.env.NEWS_NOTIFICATIONS_SUBJECT = VALID_SUBJECT;

      const keys = getVapidKeys();

      expect(keys).toEqual({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: VALID_PRIVATE_KEY,
        subject: VALID_SUBJECT,
      });
    });

    it("公開鍵が未設定の場合、エラーをスローする", () => {
      process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY = VALID_PRIVATE_KEY;
      process.env.NEWS_NOTIFICATIONS_SUBJECT = VALID_SUBJECT;
      delete process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY;

      expect(() => getVapidKeys()).toThrow(VapidKeyError);
      expect(() => getVapidKeys()).toThrow(
        "NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY is not set"
      );
    });

    it("秘密鍵が未設定の場合、エラーをスローする", () => {
      process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY = VALID_PUBLIC_KEY;
      process.env.NEWS_NOTIFICATIONS_SUBJECT = VALID_SUBJECT;
      delete process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY;

      expect(() => getVapidKeys()).toThrow(VapidKeyError);
      expect(() => getVapidKeys()).toThrow(
        "NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY is not set"
      );
    });

    it("subject が未設定の場合、エラーをスローする", () => {
      process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY = VALID_PUBLIC_KEY;
      process.env.NEWS_NOTIFICATIONS_VAPID_PRIVATE_KEY = VALID_PRIVATE_KEY;
      delete process.env.NEWS_NOTIFICATIONS_SUBJECT;

      expect(() => getVapidKeys()).toThrow(VapidKeyError);
      expect(() => getVapidKeys()).toThrow(
        "NEWS_NOTIFICATIONS_SUBJECT is not set"
      );
    });
  });

  describe("getVapidPublicKey", () => {
    it("公開鍵が設定されている場合、公開鍵のみを返す", () => {
      process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY = VALID_PUBLIC_KEY;

      const publicKey = getVapidPublicKey();

      expect(publicKey).toBe(VALID_PUBLIC_KEY);
    });

    it("公開鍵が未設定の場合、エラーをスローする", () => {
      delete process.env.NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY;

      expect(() => getVapidPublicKey()).toThrow(VapidKeyError);
      expect(() => getVapidPublicKey()).toThrow(
        "NEWS_NOTIFICATIONS_VAPID_PUBLIC_KEY is not set"
      );
    });
  });

  describe("validateVapidKeys", () => {
    it("有効なキーの場合、valid: true を返す", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: VALID_PRIVATE_KEY,
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("https:// で始まる subject も有効", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: VALID_PRIVATE_KEY,
        subject: "https://example.com",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("空の公開鍵の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: "",
        privateKey: VALID_PRIVATE_KEY,
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Public key is empty");
    });

    it("空の秘密鍵の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: "",
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Private key is empty");
    });

    it("空の subject の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: VALID_PRIVATE_KEY,
        subject: "",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Subject is empty");
    });

    it("無効な文字を含む公開鍵の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: "invalid+key=with/bad+chars==",
        privateKey: VALID_PRIVATE_KEY,
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Public key contains invalid characters");
    });

    it("長さが不正な公開鍵の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: "tooshort",
        privateKey: VALID_PRIVATE_KEY,
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Public key length is invalid");
    });

    it("長さが不正な秘密鍵の場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: "short",
        subject: VALID_SUBJECT,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Private key length is invalid");
    });

    it("無効な subject プレフィックスの場合、エラーを返す", () => {
      const result = validateVapidKeys({
        publicKey: VALID_PUBLIC_KEY,
        privateKey: VALID_PRIVATE_KEY,
        subject: "http://example.com",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Subject must start with mailto: or https://"
      );
    });

    it("複数のエラーがある場合、すべてを返す", () => {
      const result = validateVapidKeys({
        publicKey: "",
        privateKey: "",
        subject: "invalid",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain("Public key is empty");
      expect(result.errors).toContain("Private key is empty");
      expect(result.errors).toContain(
        "Subject must start with mailto: or https://"
      );
    });
  });
});
