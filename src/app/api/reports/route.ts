import { apiRoute } from "@/lib/api/api-route";
import { getReports, getReportsQuerySchema } from "@/server/reports/get-reports";
import { NextResponse } from "next/server";

export const GET = apiRoute({ query: getReportsQuerySchema }).loose(async (req) => {
	const user = req.user;

	const result = await getReports({
		lat: req.query.lat,
		lng: req.query.lng,
		zoom: req.query.zoom,
		user,
	});

	return NextResponse.json(result);
});
