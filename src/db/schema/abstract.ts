import { text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users/users";

export const baseIdModel = {
	id: text("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => uuidv7()),
};

export const baseModel = {
	...baseIdModel,
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
	deleted_at: timestamp("deleted_at", { withTimezone: true }),
};

export const baseModelWithUser = {
	...baseModel,
	created_by_id: text("created_by_id")
		.notNull()
		.references(() => users.id),
	updated_by_id: text("updated_by_id").references(() => users.id),
	deleted_by_id: text("deleted_by_id").references(() => users.id),
};
