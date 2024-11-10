// export const GET = apiRoute({ query: getReportsQuerySchema }).loose(async (req) => {
// 	const user = req.user;

import { NextResponse } from "next/server";

// 	// const result = await getReports({
// 	// 	lat: req.query.lat,
// 	// 	lng: req.query.lng,
// 	// 	zoom: req.query.zoom,
// 	// 	user,
// 	// });

// 	return NextResponse.json({});
// });

export const GET = () => {
	return NextResponse.json({});
};
