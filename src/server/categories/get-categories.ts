import { db } from "@/db";
import { ApiError } from "@/lib/server/error-handler";
import type { UserService } from "../types";

interface GetCategoriesParams extends UserService {}
export type GetCategoriesResponse = Awaited<ReturnType<typeof getCategories>>;
export const getCategories = async (params: GetCategoriesParams) => {
	const { user } = params;
	if (user.role !== "admin") throw new ApiError(403, "Forbidden");

	const categories = await db.query.categories.findMany({
		orderBy: (reports, { desc }) => [desc(reports.created_at)],
	});

	return categories;
};
