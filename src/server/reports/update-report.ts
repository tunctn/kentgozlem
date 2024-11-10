import { REPORT_STATUS, db } from "@/db";
import { updateOne } from "@/db/operations";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import type { UserService } from "../types";

export const updateReportSchema = z.object({
	id: z.string(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	address: z.string().optional(),
	category_id: z.string().optional(),
	description: z.string().optional(),
	status: z.enum(REPORT_STATUS).optional(),
	is_verified: z.boolean().optional(),
});
export type UpdateReportPayload = z.infer<typeof updateReportSchema>;
export type UpdateReportResponse = Awaited<ReturnType<typeof updateReport>>;

interface UpdateReportParams extends UserService {
	report: UpdateReportPayload;
}
export const updateReport = async (params: UpdateReportParams) => {
	const { user, report } = params;

	const currentReport = await db.query.reports.findFirst({
		where: (reports, { eq }) => eq(reports.id, report.id),
	});
	if (!currentReport) throw new ApiError(404, "Report not found");

	const isAdmin = user.role === "admin";
	const isOwner = currentReport.created_by_id === user.id;

	if (!isOwner && !isAdmin) throw new ApiError(403, "Forbidden");

	if (!isAdmin) {
		if (report.is_verified === true) throw new ApiError(403, "Forbidden");
		if (report.status !== "pending") throw new ApiError(403, "Forbidden");
	}

	const updatedReport = await updateOne(db, reports, eq(reports.id, report.id), {
		...(report.latitude && { latitude: report.latitude.toString() }),
		...(report.longitude && { longitude: report.longitude.toString() }),
		...(report.address && { address: report.address }),
		...(report.category_id && { category_id: report.category_id }),
		...(report.description && { description: report.description }),
		...(report.is_verified !== undefined && { is_verified: report.is_verified }),
		...(report.status && { status: report.status }),
	});

	return updatedReport;
};
