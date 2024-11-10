import { db } from "@/db";
import { ApiError } from "@/lib/server/error-handler";
import type { UserService } from "../types";

interface GetCategoryParams extends UserService {
	id: string;
}

export type GetCategoryResponse = Awaited<ReturnType<typeof getCategory>>;

export const getCategory = async (params: GetCategoryParams) => {
	const { id, user } = params;

	const isAdmin = user.role === "admin";
	if (!isAdmin) throw new ApiError(403, "Forbidden");

	const category = await db.query.categories.findFirst({
		where: (categories, { eq }) => eq(categories.id, id),
	});
	if (!category) throw new ApiError(404, "Category not found");

	return category;
};
