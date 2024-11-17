import { db } from "@/db";
import { removeOne } from "@/db/operations";
import { reports } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import { z } from "@/lib/zod";
import { eq } from "drizzle-orm";
import type { UserService } from "../types";

export const deleteReportSchema = z.object({
	id: z.string(),
});
export type DeleteReportPayload = z.infer<typeof deleteReportSchema>;
export type DeleteReportResponse = Awaited<ReturnType<typeof deleteReport>>;

interface DeleteReportParams extends UserService {
	payload: DeleteReportPayload;
}
export const deleteReport = async (params: DeleteReportParams) => {
	const { user, payload } = params;

	const currentReport = await db.query.reports.findFirst({
		where: (reports, { eq }) => eq(reports.id, payload.id),
	});
	if (!currentReport) throw new ApiError(404, "Report not found");

	const isOwner = currentReport.created_by_id === user.id;
	if (!isOwner && user.role !== "admin") throw new ApiError(403, "Forbidden");

	const deletedReport = await removeOne(db, reports, eq(reports.id, payload.id));
	if (!deletedReport) throw new ApiError(404, "Report not found");

	return deletedReport;
};
