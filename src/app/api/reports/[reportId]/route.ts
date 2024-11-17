import { db } from "@/db";
import { apiRoute } from "@/lib/server";
import { z } from "@/lib/zod";
import { createReport } from "@/server/reports/create-report";
import { deleteReport } from "@/server/reports/delete-report";
import { getReport } from "@/server/reports/get-report";
import { createReportSchema } from "@/zod-schemas/reports";
import { NextResponse } from "next/server";

const ReportIdSchema = z.object({ reportId: z.string() });

export const GET = apiRoute({
	params: ReportIdSchema,
}).loose(async (req) => {
	const user = req.user;
	const result = await getReport({
		id: req.params.reportId,
		user,
	});
	return NextResponse.json(result);
});

export const DELETE = apiRoute({
	params: ReportIdSchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await deleteReport({
		payload: { id: req.params.reportId },
		user,
	});
	return NextResponse.json(result);
});

export const PATCH = apiRoute({
	params: ReportIdSchema,
	body: createReportSchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await createReport({ tx: db, user, report: req.body });
	return NextResponse.json(result);
});
