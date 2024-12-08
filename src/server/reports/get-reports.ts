import { db } from "@/db";
import { type Report, categories, reportImages, reportUpvotes, reports } from "@/db/schema";
import { z } from "@/lib/zod";
import { eq, sql } from "drizzle-orm";
import type { LooseUserService } from "../types";

export const getReportsQuerySchema = z
	.object({
		sw_lat: z.coerce.number(),
		sw_lng: z.coerce.number(),
		ne_lat: z.coerce.number(),
		ne_lng: z.coerce.number(),
		zoom: z.coerce.number(),
	})
	.strict();
export type GetReportsQuery = z.infer<typeof getReportsQuerySchema>;
interface GetReportsParams extends LooseUserService, GetReportsQuery {}

export type GetReportsResponse = {
	reports: Array<
		Report & { upvotes: number; category_name: string; thumbnail_image: string | null }
	>;
};

export const getReports = async (params: GetReportsParams): Promise<GetReportsResponse> => {
	const { sw_lat, sw_lng, ne_lat, ne_lng, zoom, user } = params;
	const willRequireAllReports = user && user.role === "admin";

	// If zoomed in enough, return individual reports
	if (zoom >= 13.5) {
		const conditions = [
			sql`ST_Intersects(
        ST_MakeEnvelope(${sw_lng}, ${sw_lat}, ${ne_lng}, ${ne_lat}, 4326),
        ST_SetSRID(ST_MakePoint(reports.longitude, reports.latitude), 4326)
      )`,
		];

		if (!willRequireAllReports) {
			conditions.push(eq(reports.is_verified, true));
		}

		const reportRows = await db.query.reports.findMany({
			where: (reports, { and }) => and(...conditions),
			extras: {
				upvotes: sql<number>`(
					SELECT COUNT(*)::int 
					FROM report_upvotes ru 
					WHERE ru.report_id = reports.id
				)`.as("upvotes"),
				category_name: sql<string>`(
					SELECT name 
					FROM ${categories} c 
					WHERE c.id = ${reports.category_id}
				)`.as("category_name"),
				thumbnail_image: sql<string | null>`(
					SELECT ${reportImages.storage_path} 	
					FROM ${reportImages} ri 
					WHERE ri.report_id = ${reports.id}
				)`.as("thumbnail_image"),
			},
			orderBy: (reports, { desc }) => [desc(reports.created_at)],
		});

		return { reports: reportRows };
	}

	// Determine limit based on zoom level
	let limit = 100;
	if (zoom < 8) {
		limit = 10;
	} else if (zoom < 9) {
		limit = 25;
	} else if (zoom < 10) {
		limit = 50;
	}

	// Get IDs of top N most upvoted reports in the area
	const topReportIds = await db.execute(sql`
		SELECT r.id
		FROM ${reports} r
		LEFT JOIN ${reportUpvotes} ru ON ru.report_id = r.id
		WHERE ${willRequireAllReports ? sql`TRUE` : sql`r.is_verified = TRUE`}
		AND ST_Intersects(
			ST_MakeEnvelope(${sw_lng}, ${sw_lat}, ${ne_lng}, ${ne_lat}, 4326),
			ST_SetSRID(ST_MakePoint(r.longitude, r.latitude), 4326)
		)
		GROUP BY r.id
		ORDER BY COUNT(ru.id) DESC
		LIMIT ${limit}
	`);

	if (topReportIds.rows.length === 0) {
		return { reports: [] };
	}

	const reportRows = await db.query.reports.findMany({
		where: (reports, { inArray }) =>
			inArray(
				reports.id,
				topReportIds.rows.map((row) => row.id as string),
			),

		extras: {
			upvotes: sql<number>`(
				SELECT COUNT(*)::int 
				FROM report_upvotes ru 
				WHERE ru.report_id = reports.id
			)`.as("upvotes"),
			category_name: sql<string>`(
				SELECT name 
				FROM ${categories} c 
				WHERE c.id = ${reports.category_id}
			)`.as("category_name"),
			thumbnail_image: sql<string | null>`(
				SELECT ${reportImages.storage_path} 
				FROM ${reportImages} ri 
				WHERE ri.report_id = ${reports.id}
			)`.as("thumbnail_image"),
		},
	});

	return {
		reports: reportRows,
	};
};
