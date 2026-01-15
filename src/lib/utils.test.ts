import { describe, expect, test } from "bun:test";
import { cn } from "./utils";

describe("cn", () => {
  test("単一のクラス名を返す", () => {
    expect(cn("foo")).toBe("foo");
  });

  test("複数のクラス名を結合する", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("条件付きクラス名を処理する", () => {
    expect(cn("foo", false, "baz")).toBe("foo baz");
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  test("Tailwindの競合するクラスをマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  test("undefinedとnullを無視する", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  test("空の入力で空文字列を返す", () => {
    expect(cn()).toBe("");
  });
});
