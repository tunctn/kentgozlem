import { db } from "@/db";
import { insertOne } from "@/db/operations";
import { reports } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import type { UserService } from "../types";

interface CreateReportParams extends UserService {
	report: CreateReportPayload;
}
export const createReport = async (params: CreateReportParams) => {
	const { user, report } = params;

	const isAdmin = user.role === "admin";
	if (!isAdmin) {
		if (report.is_verified === true) throw new ApiError(403, "Forbidden");
		if (report.status !== "pending") throw new ApiError(403, "Forbidden");
	}

	const createdReport = await insertOne(db, reports, {
		...report,
		latitude: report.lat.toString(),
		longitude: report.lng.toString(),
		created_by_id: user.id,
	});

	return createdReport;
};
