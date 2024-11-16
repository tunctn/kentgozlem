import { REPORT_STATUS } from "@/zod-schemas/reports";
import { relations } from "drizzle-orm";
import { boolean, decimal, index, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { categories } from "../categories/categories";
import { reportAudits } from "./report-audits";
import { reportImages } from "./report-images";

export const reportStatusEnum = pgEnum("report_status_enum", REPORT_STATUS);

export const reports = pgTable(
	"reports",
	{
		...baseModelWithUser,

		latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
		longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),

		category_id: text("category_id")
			.references(() => categories.id)
			.notNull(),

		street: varchar("street", { length: 255 }).notNull(),
		house_number: varchar("house_number", { length: 255 }).notNull(),
		suburb: varchar("suburb", { length: 255 }).notNull(),
		city: varchar("city", { length: 100 }).notNull(),
		postal_code: varchar("postal_code", { length: 20 }).notNull(),
		country: varchar("country", { length: 100 }).notNull(),

		description: text("description"),

		is_verified: boolean("is_verified").notNull().default(false),
		status: reportStatusEnum("status").notNull().default("pending"),
	},
	(table) => ({
		locationIdx: index("reports_location_idx").on(table.latitude, table.longitude),
		categoryIdx: index("reports_category_id_idx").on(table.category_id),
		statusIdx: index("reports_status_idx").on(table.status),
		verifiedIdx: index("reports_is_verified_idx").on(table.is_verified),
	}),
);

export const reportsRelations = relations(reports, ({ one, many }) => ({
	category: one(categories, {
		fields: [reports.category_id],
		references: [categories.id],
	}),
	images: many(reportImages),
	audits: many(reportAudits),
}));

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
