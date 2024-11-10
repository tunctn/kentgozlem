import { db } from "@/db";
import { removeOne } from "@/db/operations";
import { categories } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { UserService } from "../types";

export const deleteCategorySchema = z.object({
	id: z.string(),
});
export type DeleteCategoryPayload = z.infer<typeof deleteCategorySchema>;
export type DeleteCategoryResponse = Awaited<ReturnType<typeof deleteCategory>>;

interface DeleteCategoryParams extends UserService {
	payload: DeleteCategoryPayload;
}
export const deleteCategory = async (params: DeleteCategoryParams) => {
	const { user, payload } = params;
	if (user.role !== "admin") throw new ApiError(403, "Forbidden");

	const currentCategory = await db.query.categories.findFirst({
		where: (categories, { eq }) => eq(categories.id, payload.id),
	});
	if (!currentCategory) throw new ApiError(404, "Category not found");

	const deletedCategory = await removeOne(db, categories, eq(categories.id, payload.id));
	if (!deletedCategory) throw new ApiError(404, "Category not found");

	return deletedCategory;
};
