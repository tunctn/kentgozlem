import type { createReport } from "@/server/reports/create-report";
import { z } from "zod";

export const REPORT_STATUS = ["pending", "investigating", "rejected", "resolved"] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];

export const createReportSchema = z
	.object({
		lat: z.number(),
		lng: z.number(),
		street: z.string(),
		city: z.string(),
		postal_code: z.string(),
		house_number: z.string(),
		suburb: z.string(),
		country: z.string(),
		category_id: z.string(),
		description: z.string().optional(),
		status: z.enum(REPORT_STATUS).optional(),
		is_verified: z.boolean().optional(),
	})
	.strict();
export type CreateReportPayload = z.infer<typeof createReportSchema>;
export type CreateReportResponse = Awaited<ReturnType<typeof createReport>>;
