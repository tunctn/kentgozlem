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
	email_address: varchar("email_address", { length: 255 }).unique().notNull(),
	avatar_url: varchar("avatar_url", { length: 255 }),
	role: userRolesEnum("role").default("user").notNull(),
	is_email_address_verified: boolean("is_email_address_verified").default(false).notNull(),
	google_id: text("google_id").unique(),
	password_hash: text("password_hash"),
});

// TypeScript type for the user
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AuthUser = {
	id: string;
	name: string;
	email_address: string;
	google_id: string | null;
	role: UserRole;
	avatar_url: string | null;
};

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(userSessions),
}));
