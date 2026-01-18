import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.TURSO_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TURSO_DATABASE_URL is required");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: databaseUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
