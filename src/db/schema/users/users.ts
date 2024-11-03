import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "../abstract";

export const users = pgTable("users", {
	...baseModel,
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: timestamp("email_verified", { withTimezone: true }),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	image: varchar("image"),
	name: varchar("name", { length: 255 }),
});

// TypeScript type for the user
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
