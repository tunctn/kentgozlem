import { db } from "@/db";
import { insertOne } from "@/db/operations";
import { categories } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import { z } from "zod";
import type { UserService } from "../types";

export const createCategorySchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
	})
	.strict();
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponse = Awaited<ReturnType<typeof createCategory>>;

interface CreateCategoryParams extends UserService {
	category: CreateCategoryPayload;
}
export const createCategory = async (params: CreateCategoryParams) => {
	const { user, category } = params;

	const isAdmin = user.role === "admin";
	if (!isAdmin) throw new ApiError(403, "Forbidden");

	const createdCategory = await insertOne(db, categories, {
		...category,
	});

	return createdCategory;
};
