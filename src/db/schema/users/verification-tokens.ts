import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
	identifier: varchar("identifier", { length: 255 }).notNull(),
	token: varchar("token", { length: 255 }).notNull(),
	expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// TypeScript type for the user
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
