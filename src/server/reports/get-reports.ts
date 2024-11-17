import { db } from "@/db";
import { z } from "@/lib/zod";
import type { LooseUserService } from "../types";

export const getReportsQuerySchema = z
	.object({
		lat: z.coerce.number(),
		lng: z.coerce.number(),
		zoom: z.coerce.number(),
	})
	.strict();
export type GetReportsQuery = z.infer<typeof getReportsQuerySchema>;
interface GetReportsParams extends LooseUserService, GetReportsQuery {}

export type GetReportsResponse = Awaited<ReturnType<typeof getReports>>;

export const getReports = async (params: GetReportsParams) => {
	const { lat, lng, zoom, user } = params;

	const willRequireAllReports = user && user.role === "admin";

	/**
	 * Geographic Report Distribution Query
	 *
	 * Purpose:
	 * This query retrieves reports within a specified radius while ensuring even geographic distribution.
	 * It prevents clustering of reports in densely populated areas by dividing the visible map area into a grid
	 * and selecting reports evenly from each grid cell.
	 *
	 * Key Components:
	 * 1. Dynamic Radius: Adjusts based on zoom level (smaller radius when zoomed in)
	 * 2. Grid System: Divides visible area into gridSize × gridSize cells
	 *    - More cells (6×6) at low zoom levels for better distribution
	 *    - Fewer cells (2×2) when zoomed in for detailed view
	 * 3. Report Limits: Scales with zoom level
	 *    - Zoom ≤ 10: 50 reports  (viewing large areas, e.g., continents)
	 *    - Zoom ≤ 13: 100 reports (viewing regions/countries)
	 *    - Zoom ≤ 15: 200 reports (viewing cities)
	 *    - Zoom > 15: 500 reports (viewing neighborhoods)
	 *
	 * Technical Notes:
	 * - 111320 meters = 1 degree of latitude (approximate at equator)
	 * - Longitude degrees are adjusted by cos(latitude) due to globe curvature
	 * - Uses SQL MOD and FLOOR for grid cell assignment
	 * - ROW_NUMBER() ensures even distribution across cells
	 */
	const oneDegree = 111320;

	// Calculate radius based on zoom level (in meters)
	const radius = Math.max(5000 / 2 ** zoom, 2500);

	// Determine grid size based on zoom level
	let gridSize = 2; // Default: Neighborhood view
	if (zoom <= 15) gridSize = 3; // City view
	if (zoom <= 13) gridSize = 4; // Country/region view
	if (zoom <= 10) gridSize = 6; // Continental view

	// Calculate how many reports to show per grid cell
	const totalLimit = zoom <= 10 ? 50 : zoom <= 13 ? 100 : zoom <= 15 ? 200 : 500;
	const reportsPerCell = Math.ceil(totalLimit / (gridSize * gridSize));

	// // Add debug logging
	// 	const distance = await db.execute(sql`
	// 		SELECT ST_Distance(
	// 				geography(ST_MakePoint(${lng}, ${lat})),
	// 				geography(ST_MakePoint(16.3508316, 48.221395))
	// 		) as distance
	// `);

	// 	console.log("Distance to report:", distance, "meters");
	// 	console.log("Current radius:", radius, "meters");

	const reports = await db.query.reports.findMany({
		where: (reports, { and, eq, sql }) => {
			const conditions = [
				// Find reports within the radius using spherical distance calculation
				sql`ST_Distance(
					geography(ST_MakePoint(${lng}, ${lat})), 
					geography(ST_MakePoint(reports.longitude, reports.latitude))
				) <= ${radius}`,

				// Assign reports to grid cells based on latitude
				// 1. Normalize coordinates relative to viewport center
				// 2. Scale to grid size
				// 3. Use modulo to select specific cells
				sql`MOD(FLOOR((reports.latitude - ${lat} + ${radius / oneDegree}) / ${(radius * 2) / oneDegree / gridSize}), ${gridSize}) = 
					MOD(FLOOR(EXTRACT(EPOCH FROM reports.created_at) / 1000), ${gridSize})`,

				// Same for longitude, but adjust for latitude distortion
				// Longitude degrees get smaller as you move away from equator
				sql`MOD(FLOOR((reports.longitude - ${lng} + ${radius / (oneDegree * Math.cos((lat * Math.PI) / 180))}) / ${(radius * 2) / (oneDegree * Math.cos((lat * Math.PI) / 180)) / gridSize}), ${gridSize}) = 
					MOD(FLOOR(EXTRACT(EPOCH FROM reports.created_at) / 1000 / ${gridSize}), ${gridSize})`,
			];

			if (!willRequireAllReports) {
				conditions.push(eq(reports.is_verified, true));
			}

			return and(...conditions);
		},
		with: {
			images: true,
			category: true,
		},
		limit: reportsPerCell,
		orderBy: (reports, { desc }) => [desc(reports.created_at)],
	});

	return reports;
};
