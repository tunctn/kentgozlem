import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { reports } from "./reports";

export const reportImages = pgTable(
	"report_images",
	{
		...baseModelWithUser,

		report_id: text("report_id")
			.references(() => reports.id)
			.notNull(),
		storage_path: varchar("image_url").notNull(),
		size: integer("size").notNull(),
		extension: varchar("extension").notNull(),

		// Metadata fields
		file_name: varchar("file_name").notNull(), // original file name
		mime_yype: varchar("mime_type").notNull(), // e.g., image/jpeg, image/png
		width: integer("width").notNull(),
		height: integer("height").notNull(),

		// Optional but useful fields
		description: text("description"), // caption or description of the image
		order: integer("order"), // if you want to maintain specific image order
	},
	(table) => ({
		reportIdIdx: index("report_images_report_id_idx").on(table.report_id),
		orderIdx: index("report_images_order_idx").on(table.order),
		storagePathIdx: index("report_images_storage_path_idx").on(table.storage_path),
	}),
);

export const reportImagesRelations = relations(reportImages, ({ one }) => ({
	report: one(reports, {
		fields: [reportImages.report_id],
		references: [reports.id],
	}),
}));

export type ReportImage = typeof reportImages.$inferSelect;
export type NewReportImage = typeof reportImages.$inferInsert;
