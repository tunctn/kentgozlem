import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "../abstract";
import { userSessions } from "./user-sessions";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const userRolesEnum = pgEnum("user_role_enum", USER_ROLES);

export const users = pgTable("users", {
	...baseModel,
	name: varchar("name", { length: 255 }).notNull(),
	emailAddress: varchar("email_address", { length: 255 }).unique().notNull(),
	avatarUrl: varchar("avatar_url", { length: 255 }),
	role: userRolesEnum("role").default("user").notNull(),
	isEmailAddressVerified: boolean("is_email_address_verified").default(false).notNull(),
	googleId: text("google_id").unique(),
	passwordHash: text("password_hash"),
});

// TypeScript type for the user
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	googleId: string | null;
	role: UserRole;
	image: string | null;
};

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(userSessions),
}));
