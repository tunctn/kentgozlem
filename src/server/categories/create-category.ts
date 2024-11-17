import { db } from "@/db";
import { insertOne } from "@/db/operations";
import { categories } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import type { CreateCategoryPayload } from "@/zod-schemas/categories";
import { eq } from "drizzle-orm";
import type { UserService } from "../types";

export type CreateCategoryResponse = Awaited<ReturnType<typeof createCategory>>;

interface CreateCategoryParams extends UserService {
	category: CreateCategoryPayload;
}
export const createCategory = async (params: CreateCategoryParams) => {
	const { user, category } = params;

	const isAdmin = user.role === "admin";
	if (!isAdmin) throw new ApiError(403, "Forbidden");

	const existingCategory = await db.query.categories.findFirst({
		where: eq(categories.name, category.name),
	});
	if (existingCategory) throw new ApiError(400, "Kategori zaten mevcut");

	const createdCategory = await insertOne(db, categories, {
		...category,
	});

	return createdCategory;
};
