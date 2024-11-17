import { db } from "@/db";
import type { UserService } from "../types";

interface GetCategoriesParams extends UserService {}
export type GetCategoriesResponse = Awaited<ReturnType<typeof getCategories>>;
export const getCategories = async (params: GetCategoriesParams) => {
	const categories = await db.query.categories.findMany({
		orderBy: (reports, { desc }) => [desc(reports.created_at)],
	});

	return categories;
};
