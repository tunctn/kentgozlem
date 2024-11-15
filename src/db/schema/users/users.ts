import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "../abstract";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const userRolesEnum = pgEnum("user_role_enum", USER_ROLES);

export const users = pgTable("users", {
	...baseModel,
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: timestamp("email_verified", { withTimezone: true }),
	passwordHash: varchar("password_hash", { length: 255 }),
	image: varchar("image"),
	name: varchar("name", { length: 255 }).notNull(),
	role: userRolesEnum("role").default("user"),
});

// TypeScript type for the user
export type User = typeof users.$inferSelect;
export type AuthUser = Omit<User, "passwordHash">;
export type NewUser = typeof users.$inferInsert;
