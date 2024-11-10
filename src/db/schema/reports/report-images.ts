import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { reports } from "./reports";

export const reportImages = pgTable(
	"report_images",
	{
		...baseModelWithUser,

		reportId: text("report_id")
			.references(() => reports.id)
			.notNull(),
		storagePath: varchar("image_url").notNull(),
		size: integer("size").notNull(),
		extension: varchar("extension").notNull(),

		// Metadata fields
		fileName: varchar("file_name").notNull(), // original file name
		mimeType: varchar("mime_type").notNull(), // e.g., image/jpeg, image/png
		width: integer("width").notNull(),
		height: integer("height").notNull(),

		// Optional but useful fields
		description: text("description"), // caption or description of the image
		order: integer("order"), // if you want to maintain specific image order
	},
	(table) => ({
		reportIdIdx: index("report_images_report_id_idx").on(table.reportId),
		orderIdx: index("report_images_order_idx").on(table.order),
		storagePathIdx: index("report_images_storage_path_idx").on(table.storagePath),
	}),
);

export type ReportImage = typeof reportImages.$inferSelect;
export type NewReportImage = typeof reportImages.$inferInsert;
