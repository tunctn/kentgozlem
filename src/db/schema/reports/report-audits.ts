import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { users } from "../users";
import { reportStatusEnum, reports } from "./reports";

export const reportAudits = pgTable(
	"report_audits",
	{
		...baseModelWithUser,

		reportId: text("report_id")
			.references(() => reports.id)
			.notNull(),

		status: reportStatusEnum("status").notNull(),
		reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
		reviewedById: text("reviewed_by_id").references(() => users.id),
		reviewNote: text("review_note"),
	},
	(table) => ({
		reportIdIdx: index("report_audits_report_id_idx").on(table.reportId),
		statusIdx: index("report_audits_status_idx").on(table.status),
		reviewedByIdIdx: index("report_audits_reviewed_by_id_idx").on(table.reviewedById),
		createdByIdIdx: index("report_audits_created_by_id_idx").on(table.createdById),
	}),
);

export type ReportAudit = typeof reportAudits.$inferSelect;
export type NewReportAudit = typeof reportAudits.$inferInsert;
