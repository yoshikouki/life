import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { notifiedItems, subscriptions } from "./schema";

export type Database = ReturnType<typeof createDatabase>;

export function createDatabase(url: string, authToken?: string) {
  const client = createClient({
    url,
    authToken,
  });
  return drizzle(client, { schema: { notifiedItems, subscriptions } });
}

let _db: Database | null = null;

export function getDatabase(): Database {
  if (_db) {
    return _db;
  }

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("TURSO_DATABASE_URL is required");
  }

  _db = createDatabase(databaseUrl, process.env.TURSO_AUTH_TOKEN);
  return _db;
}

// For backwards compatibility
export const db = new Proxy({} as Database, {
  get(_, prop) {
    return getDatabase()[prop as keyof Database];
  },
});
