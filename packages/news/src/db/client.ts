import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// TODO: Import schema once defined
// import * as schema from "./schema";

const databaseUrl = process.env.TURSO_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TURSO_DATABASE_URL is required");
}

const client = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// TODO: Add schema to drizzle() call once defined
// export const db = drizzle(client, { schema });
export const db = drizzle(client);
