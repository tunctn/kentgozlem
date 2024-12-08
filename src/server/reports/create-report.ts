import { db, transaction } from "@/db";
import { insertOne } from "@/db/operations";
import { reportImages, reports } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import type { UserService } from "../types";

interface CreateReportParams extends UserService {
	report: CreateReportPayload;
}
export const createReport = async (params: CreateReportParams) => {
	return await transaction(db, async (tx) => {
		const { user, report } = params;

		const isAdmin = user.role === "admin";
		if (!isAdmin) {
			if (report.is_verified === true) throw new ApiError(403, "Forbidden");
			if (report.status !== "pending") throw new ApiError(403, "Forbidden");
		}

		const createdReport = await insertOne(tx, reports, {
			...report,
			house_number: report.house_number ?? "",
			latitude: report.lat.toString(),
			longitude: report.lng.toString(),
			created_by_id: user.id,
		});

		if (report.images.length > 0) {
			await tx.insert(reportImages).values(
				report.images.map((image) => ({
					description: image.description,
					extension: image.extension,
					file_name: image.file_name,
					mime_type: image.mime_type,
					height: image.height,
					width: image.width,
					order: image.order,
					storage_path: image.storage_path,
					size: image.size,
					report_id: createdReport.id,
					created_by_id: user.id,
				})),
			);
		}

		return createdReport;
	});
};
