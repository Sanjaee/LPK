import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString || /@host\//.test(connectionString)) {
  throw new Error(
    "DATABASE_URL is not set or is a placeholder. " +
      "Set the real PostgreSQL/Neon connection string (e.g. postgresql://user:pass@<your-neon-host>.neon.tech/db)."
  );
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
export type Db = typeof db;
