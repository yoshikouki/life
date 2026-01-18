/**
 * 共通エラークラス
 */

/**
 * 設定関連エラーの基底クラス
 */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

/**
 * データベース操作エラー
 */
export class DatabaseError extends Error {
  readonly originalError?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = cause;
  }
}

/**
 * 購読操作エラー
 */
export class SubscriptionError extends DatabaseError {
  readonly subscriptionEndpoint?: string;

  constructor(message: string, endpoint?: string, cause?: unknown) {
    super(message, cause);
    this.name = "SubscriptionError";
    this.subscriptionEndpoint = endpoint;
  }
}
