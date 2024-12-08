import { relations } from "drizzle-orm";
import { index, pgTable, text } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { reports } from "./reports";

export const reportUpvotes = pgTable(
	"report_upvotes",
	{
		...baseModelWithUser,
		report_id: text("report_id")
			.references(() => reports.id)
			.notNull(),
	},
	(table) => ({
		reportIdIdx: index("report_upvotes_report_id_idx").on(table.report_id),
	}),
);

export const reportUpvotesRelations = relations(reportUpvotes, ({ one }) => ({
	report: one(reports, {
		fields: [reportUpvotes.report_id],
		references: [reports.id],
	}),
}));

export type ReportUpvote = typeof reportUpvotes.$inferSelect;
export type NewReportUpvote = typeof reportUpvotes.$inferInsert;
