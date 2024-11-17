import { db } from "@/db";
import { removeOne } from "@/db/operations";
import { categories } from "@/db/schema";
import { ApiError } from "@/lib/server/error-handler";
import { eq } from "drizzle-orm";
import type { UserService } from "../types";

interface DeleteCategoryParams extends UserService {
	payload: { id: string };
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
