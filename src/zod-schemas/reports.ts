import { z } from "@/lib/zod";
import type { createReport } from "@/server/reports/create-report";

export const REPORT_STATUS = ["pending", "investigating", "rejected", "resolved"] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];

export const IMAGE_EXTENSIONS = [
	"jpeg",
	"jpg",
	"png",
	"webp",
	"gif",
	"heic",
	"heif",
	"tiff",
	"bmp",
] as const;
export type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];

export const CreateReportImageSchema = z
	.object({
		field_array_id: z.string(),
		storage_path: z.string(),
		size: z.number(),
		extension: z.string(),
		file_name: z.string(),
		mime_type: z.string(),
		width: z.number(),
		height: z.number(),
		description: z.string().optional(),
		order: z.number(),
	})
	.strict();

export const createReportSchema = z
	.object({
		lat: z.number().min(1, "Enlem zorunludur."),
		lng: z.number().min(1, "Boylam zorunludur."),
		street: z.string().min(1, "Cadde zorunludur."),
		city: z.string().min(1, "Şehir zorunludur."),
		postal_code: z.string().min(1, "Posta kodu zorunludur."),
		house_number: z.string().optional(),
		suburb: z.string().min(1, "Mahalle zorunludur."),
		country: z.string().min(1, "Ülke zorunludur."),
		category_id: z.string().min(1, "Kategori zorunludur."),
		description: z.string().optional(),
		status: z.enum(REPORT_STATUS).optional(),
		is_verified: z.boolean().optional(),
		images: CreateReportImageSchema.array().max(5, "En fazla 5 görsel ekleyebilirsiniz."),
	})
	.strict();
export type CreateReportPayload = z.infer<typeof createReportSchema>;
export type CreateReportResponse = Awaited<ReturnType<typeof createReport>>;
