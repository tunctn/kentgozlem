import { REPORT_STATUS } from "@/zod-schemas/reports";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseModelWithUser } from "../abstract";
import { users } from "../users";
import { reports } from "./reports";

export const reportAuditStatusEnum = pgEnum("report_audit_status_enum", REPORT_STATUS);

export const reportAudits = pgTable(
	"report_audits",
	{
		...baseModelWithUser,

		report_id: text("report_id")
			.references(() => reports.id)
			.notNull(),

		status: reportAuditStatusEnum("status").notNull(),
		reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
		reviewed_by_id: text("reviewed_by_id").references(() => users.id),
		review_note: text("review_note"),
	},
	(table) => ({
		reportIdIdx: index("report_audits_report_id_idx").on(table.report_id),
		statusIdx: index("report_audits_status_idx").on(table.status),
		reviewedByIdIdx: index("report_audits_reviewed_by_id_idx").on(table.reviewed_by_id),
		createdByIdIdx: index("report_audits_created_by_id_idx").on(table.created_by_id),
	}),
);

export const reportAuditsRelations = relations(reportAudits, ({ one }) => ({
	report: one(reports, {
		fields: [reportAudits.report_id],
		references: [reports.id],
	}),
}));

export type ReportAudit = typeof reportAudits.$inferSelect;
export type NewReportAudit = typeof reportAudits.$inferInsert;
