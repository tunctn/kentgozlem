import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "../abstract";

export const categories = pgTable("categories", {
	...baseModel,

	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
