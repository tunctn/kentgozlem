import { z } from "@/lib/zod";
import type { createCategory } from "@/server/categories/create-category";
import type { deleteCategory } from "@/server/categories/delete-category";
import type { getCategories } from "@/server/categories/get-categories";
import type { getCategory } from "@/server/categories/get-category";
import type { updateCategory } from "@/server/categories/update-category";

export const createCategorySchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
	})
	.strict();
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponse = Awaited<ReturnType<typeof createCategory>>;

export type GetCategoriesResponse = Awaited<ReturnType<typeof getCategories>>;

export type GetCategoryResponse = Awaited<ReturnType<typeof getCategory>>;

export const updateCategorySchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.strict();
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryResponse = Awaited<ReturnType<typeof updateCategory>>;

export type DeleteCategoryResponse = Awaited<ReturnType<typeof deleteCategory>>;
