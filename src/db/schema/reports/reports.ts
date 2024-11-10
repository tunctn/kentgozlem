import { boolean, decimal, index, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { categories } from "../categories/categories";

export const REPORT_STATUS = ["pending", "investigating", "rejected", "resolved"] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];
export const reportStatusEnum = pgEnum("report_status", REPORT_STATUS);

export const reports = pgTable(
	"reports",
	{
		...baseModelWithUser,

		latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
		longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),

		categoryId: text("category_id")
			.references(() => categories.id)
			.notNull(),

		address: varchar("address", { length: 255 }).notNull(),
		description: text("description"),

		isVerified: boolean("is_verified").notNull().default(false),
		status: reportStatusEnum("status").notNull().default("pending"),
	},
	(table) => ({
		locationIdx: index("reports_location_idx").on(table.latitude, table.longitude),
		categoryIdx: index("reports_category_id_idx").on(table.categoryId),
		statusIdx: index("reports_status_idx").on(table.status),
		verifiedIdx: index("reports_is_verified_idx").on(table.isVerified),
	}),
);

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
