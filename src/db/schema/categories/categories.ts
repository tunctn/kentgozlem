import { relations } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "../abstract";
import { reports } from "../reports/reports";

export const categories = pgTable("categories", {
	...baseModel,

	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	reports: many(reports),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
