import { db } from "@/db";
import { apiRoute } from "@/lib/server";
import { createReport } from "@/server/reports/create-report";
import { getReports, getReportsQuerySchema } from "@/server/reports/get-reports";
import { createReportSchema } from "@/zod-schemas/reports";
import { NextResponse } from "next/server";

export const GET = apiRoute({
	query: getReportsQuerySchema,
}).loose(async (req) => {
	const user = req.user;
	const result = await getReports({
		lat: req.query.lat,
		lng: req.query.lng,
		zoom: req.query.zoom,
		user,
	});
	return NextResponse.json(result);
});

export const POST = apiRoute({
	body: createReportSchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await createReport({ tx: db, user, report: req.body });
	return NextResponse.json(result);
});
