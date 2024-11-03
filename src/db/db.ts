import { NODE_ENV, env } from "@/lib/env";

import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool as PGPool } from "pg";

import * as schema from "./schema";

const pgPool = new PGPool({
	connectionString: env.DATABASE_URL,
	ssl: NODE_ENV === "production",
});
export const db = pgDrizzle(pgPool, { schema });
