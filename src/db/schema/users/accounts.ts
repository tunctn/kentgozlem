import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const accounts = pgTable("accounts", {
	userId: varchar("userId", { length: 255 })
		.references(() => users.id)
		.notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	provider: varchar("provider", { length: 255 }).notNull(),
	providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
	refresh_token: varchar("refresh_token", { length: 255 }),
	access_token: varchar("access_token", { length: 255 }),
	expires_at: integer("expires_at"),
	token_type: varchar("token_type", { length: 255 }),
	scope: varchar("scope", { length: 255 }),
	id_token: text("id_token"),
	session_state: varchar("session_state", { length: 255 }),
});

// TypeScript type for the user
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
