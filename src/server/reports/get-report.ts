import { db } from "@/db";
import { reports } from "@/db/schema";
import { reportUpvotes } from "@/db/schema";
import { sql } from "drizzle-orm";
import type { LooseUserService } from "../types";

interface GetReportParams extends LooseUserService {
	id: string;
}

export type GetReportResponse = Awaited<ReturnType<typeof getReport>>;

export const getReport = async (params: GetReportParams) => {
	const { id, user } = params;

	const isAdmin = user && user.role === "admin";
	const report = await db.query.reports.findFirst({
		where: (reports, { and, eq, sql, or }) => {
			if (!isAdmin) {
				if (user) {
					const userId = user.id;
					return and(
						eq(reports.id, id),
						or(eq(reports.is_verified, true), eq(reports.created_by_id, userId)),
					);
				}
				return and(eq(reports.id, id), eq(reports.is_verified, true));
			}

			return eq(reports.id, id);
		},
		with: {
			images: true,
			category: true,
		},
		extras: {
			upvotes: sql<number>`(
				SELECT COUNT(*)::int 
				FROM ${reportUpvotes} ru 
				WHERE ru.report_id = ${reports.id}
			)`.as("upvotes"),
		},
	});

	return report;
};
