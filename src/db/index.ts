import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

function createClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || /@host\//.test(connectionString)) {
    throw new Error(
      "DATABASE_URL is not set or is a placeholder. " +
        "Set the real PostgreSQL/Neon connection string (e.g. postgresql://user:pass@<your-neon-host>.neon.tech/db)."
    );
  }

  const client = postgres(connectionString, { prepare: false });
  return drizzle(client);
}

// Lazy client: building/importing `@/db` never connects or throws, so
// `next build` on Vercel works even before DATABASE_URL is configured.
// Validation happens on the first actual query.
let client: PostgresJsDatabase | null = null;
function getClient(): PostgresJsDatabase {
  if (!client) client = createClient();
  return client;
}

export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop: string | symbol) {
    const c = getClient();
    const value = (c as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(c) : value;
  },
});

export type Db = PostgresJsDatabase;
