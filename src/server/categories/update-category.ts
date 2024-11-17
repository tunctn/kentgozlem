import { db } from "@/db";
import { updateOne } from "@/db/operations";
import { categories } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import type { UpdateCategoryPayload } from "@/zod-schemas/categories";
import { eq } from "drizzle-orm";
import type { UserService } from "../types";

interface UpdateCategoryParams extends UserService {
	id: string;
	category: UpdateCategoryPayload;
}
export const updateCategory = async (params: UpdateCategoryParams) => {
	const { user, id, category } = params;
	if (user.role !== "admin") throw new ApiError(403, "Forbidden");

	const currentCategory = await db.query.categories.findFirst({
		where: (categories, { eq }) => eq(categories.id, id),
	});
	if (!currentCategory) throw new ApiError(404, "Category not found");

	const updatedCategory = await updateOne(db, categories, eq(categories.id, id), {
		...category,
		updated_at: new Date(),
	});

	return updatedCategory;
};
