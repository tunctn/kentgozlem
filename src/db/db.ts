import { env } from "@/lib/env";

import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool as PGPool } from "pg";

import * as schema from "./schema";

const pgPool = new PGPool({
	connectionString: env.DATABASE_URL,
	ssl: env.DATABASE_SSL === "true" ? true : { rejectUnauthorized: false },
});
export const db = pgDrizzle(pgPool, { schema });
