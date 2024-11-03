import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
	userId: varchar("userId", { length: 255 })
		.references(() => users.id)
		.notNull(),
	expires: timestamp("expires", { withTimezone: true }).notNull(),
	sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
});

// TypeScript type for the user
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
